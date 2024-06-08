const EmploymentContract = artifacts.require("EmploymentContract");
const EmploymentContractFactory = artifacts.require(
	"EmploymentContractFactory",
);

contract("EmploymentContract", (accounts) => {
	const [employer, employee, reserve] = accounts;
	const salary = web3.utils.toWei("1", "ether"); // 1 ETH
	const bonus = web3.utils.toWei("0.1", "ether"); // 0.1 ETH
	const vacationPay = web3.utils.toWei("0.05", "ether"); // 0.05 ETH
	const sickLeavePay = web3.utils.toWei("0.05", "ether"); // 0.05 ETH
	const penalty = web3.utils.toWei("0.5", "ether"); // 0.5 ETH
	const startDate = Math.floor(Date.now() / 1000); // текущая дата
	const endDate = startDate + 60 * 60 * 24 * 30; // через 30 дней
	const paymentInterval = 60; // 1 минута

	let employmentContract;

	beforeEach(async () => {
		employmentContract = await EmploymentContract.new(
			employer,
			salary,
			bonus,
			vacationPay,
			sickLeavePay,
			startDate,
			endDate,
			penalty,
			paymentInterval,
			reserve,
		);
	});

	it("should allow the employer to sign the contract", async () => {
		await employmentContract.signContract(employee, { from: employer });
		const isSigned = await employmentContract.isSigned();
		assert.isTrue(isSigned, "Contract should be signed by the employer");
	});

	it("should allow the employee to confirm their signature", async () => {
		await employmentContract.signContract(employee, { from: employer });
		const initialReserveBalance = await web3.eth.getBalance(reserve);
		console.log("Initial Reserve Balance:", initialReserveBalance);

		const tx = await employmentContract.confirmEmployeeSignature({
			from: employee,
			value: penalty,
		});
		const contractBalance = await web3.eth.getBalance(
			employmentContract.address,
		);
		console.log("Contract Balance after confirmation:", contractBalance);

		const finalReserveBalance = await web3.eth.getBalance(reserve);
		console.log("Final Reserve Balance:", finalReserveBalance);

		assert.equal(
			contractBalance,
			0,
			"Contract balance should be zero after transferring penalty to reserve",
		);
		assert.isAbove(
			parseInt(finalReserveBalance),
			parseInt(initialReserveBalance),
			"Reserve balance should increase by the penalty amount",
		);

		// Check if the event was emitted
		const event = tx.logs.find((log) => log.event === "ContractFunded");
		assert.isNotNull(event, "ContractFunded event should be emitted");
	});

	it("should allow the employer to make a payment", async () => {
		await employmentContract.signContract(employee, { from: employer });
		await employmentContract.confirmEmployeeSignature({
			from: employee,
			value: penalty,
		});

		// Fund the contract
		await employmentContract.fundContract({
			from: employer,
			value: salary,
		});

		// Fast forward time
		await increaseTime(paymentInterval);

		await employmentContract.makePayment({ from: employer });

		const employeeBalance = await web3.eth.getBalance(employee);
		assert.isAbove(
			parseInt(employeeBalance),
			parseInt(web3.utils.toWei("100", "ether")),
			"Employee should receive the payment",
		);
	});

	it("should allow the contract to be terminated by the employer", async () => {
		await employmentContract.signContract(employee, { from: employer });
		await employmentContract.confirmEmployeeSignature({
			from: employee,
			value: penalty,
		});

		// Fund the contract
		await employmentContract.fundContract({
			from: employer,
			value: penalty,
		});

		await employmentContract.terminateContract({ from: employer });

		const isSigned = await employmentContract.isSigned();
		assert.isFalse(isSigned, "Contract should be terminated");
	});

	it("should allow the contract to be terminated by the employee", async () => {
		await employmentContract.signContract(employee, { from: employer });
		await employmentContract.confirmEmployeeSignature({
			from: employee,
			value: penalty,
		});

		// Fund the contract
		await employmentContract.fundContract({
			from: employer,
			value: penalty,
		});

		await employmentContract.terminateContract({ from: employee });

		const isSigned = await employmentContract.isSigned();
		assert.isFalse(isSigned, "Contract should be terminated");
	});

	async function increaseTime(duration) {
		const id = Date.now();

		return new Promise((resolve, reject) => {
			web3.currentProvider.send(
				{
					jsonrpc: "2.0",
					method: "evm_increaseTime",
					params: [duration],
					id: id,
				},
				(err1) => {
					if (err1) return reject(err1);

					web3.currentProvider.send(
						{
							jsonrpc: "2.0",
							method: "evm_mine",
							id: id + 1,
						},
						(err2, res) => {
							return err2 ? reject(err2) : resolve(res);
						},
					);
				},
			);
		});
	}
});
