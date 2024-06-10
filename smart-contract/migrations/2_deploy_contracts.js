const EmploymentContractFactory = artifacts.require(
	"EmploymentContractFactory",
);

module.exports = function (deployer) {
	deployer.deploy(EmploymentContractFactory);
};
