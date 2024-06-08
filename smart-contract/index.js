const Web3 = require("web3");
const contract = require("@truffle/contract");
const fs = require("fs");
const path = require("path");

const web3 = new Web3("http://localhost:7545");

const EmploymentContractFactoryJSON = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "build/contracts/EmploymentContractFactory.json"),
		"utf8",
	),
);

const EmploymentContractJSON = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "build/contracts/EmploymentContract.json"),
		"utf8",
	),
);

const EmploymentContractFactory = contract(EmploymentContractFactoryJSON);
EmploymentContractFactory.setProvider(web3.currentProvider);

const EmploymentContract = contract(EmploymentContractJSON);
EmploymentContract.setProvider(web3.currentProvider);

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
	const accounts = await web3.eth.getAccounts();

	const employerAddress = accounts[5];
	const reserveAddress = accounts[6];
	const employeeAddress = accounts[4];

	console.log("RESERVE", reserveAddress);
	console.log("EMPLOYER", employerAddress);
	console.log("EMPLOYEE", employeeAddress);

	const factory = await EmploymentContractFactory.deployed();

	const salary = 1000000; // ETH per month (big salary due to the fact that the interval is very small)
	const paymentInterval = 10; // seconds

	await factory.createEmploymentContract(
		web3.utils.toWei(String(salary), "ether"), // salary
		web3.utils.toWei("0.1", "ether"), // bonus
		web3.utils.toWei("0.05", "ether"), // vacationPay
		web3.utils.toWei("0.02", "ether"), // sickLeavePay
		Math.floor(Date.now() / 1000), // startDate
		Math.floor(Date.now() / 1000) + 4 * 60, // endDate
		web3.utils.toWei("0.5", "ether"), // penalty
		paymentInterval, // paymentInterval
		reserveAddress, // reserve address
		{ from: employerAddress }, // employer
	);

	const paymentAmount =
		(salary * 12) / ((365 * 24 * 60 * 60) / paymentInterval);
	console.log("Payment amount", paymentAmount);

	const contracts = await factory.getContracts();
	const employmentContractAddress = contracts.at(-1);
	console.log("Employment Contract Address:", employmentContractAddress);

	const contractDetails = await factory.getContractsDetails();
	console.log("contract details", contractDetails);

	const employmentContract = await EmploymentContract.at(
		employmentContractAddress,
	);
	await employmentContract.signContract(employeeAddress, {
		from: employerAddress,
	});

	await employmentContract.confirmEmployeeSignature({
		from: employeeAddress,
		value: web3.utils.toWei("0.5", "ether"),
	});

	console.log("Waiting...");
	await sleep(paymentInterval * 1000 + 100);

	await employmentContract.fundContract({
		from: employerAddress,
		value: web3.utils.toWei("5", "ether"),
	});
	await employmentContract.makePayment({ from: employerAddress });

	console.log("Payment made successfully");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
