pragma solidity ^0.8.0;

contract EmploymentContract {
    address public employer;
    address public employee;

    uint256 public monthlySalary;
    uint256 public bonus;
    uint256 public vacationPay;
    uint256 public sickLeavePay;
    uint256 public penalty;

    uint256 public startDate;
    uint256 public endDate;
    uint256 public lastPaymentDate;

    bool public isSigned = false;

    modifier onlyEmployer() {
        require(msg.sender == employer, "Only employer can perform this action");
        _;
    }

    modifier onlyEmployee() {
        require(msg.sender == employee, "Only employee can perform this action");
        _;
    }

    modifier isContractSigned() {
        require(isSigned == true, "Contract is not signed by employee yet");
        _;
    }

    constructor(
        address _employer,
        uint256 _monthlySalary,
        uint256 _bonus,
        uint256 _vacationPay,
        uint256 _sickLeavePay,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _penalty
    ) {
        require(_startDate < _endDate, "Start date must be before end date");
        employer = _employer;
        monthlySalary = _monthlySalary;
        bonus = _bonus;
        vacationPay = _vacationPay;
        sickLeavePay = _sickLeavePay;
        startDate = _startDate;
        endDate = _endDate;
        penalty = _penalty;
        lastPaymentDate = block.timestamp; // Contract starts when deployed
    }

    function signContract(address _employee) public onlyEmployer {
        require(!isSigned, "Contract already signed");
        require(block.timestamp >= startDate, "Contract start date has not been reached");
        employee = _employee;
        isSigned = true;
    }

    function makeWeeklyPayment() public onlyEmployer isContractSigned {
        require(block.timestamp >= lastPaymentDate + 1 weeks, "Weekly payment interval has not passed");
        require(block.timestamp < endDate, "Contract has ended");

        uint256 weeklySalary = (monthlySalary * 12) / 52;
        require(address(this).balance >= weeklySalary, "Insufficient contract balance");

        lastPaymentDate += 1 weeks;
        payable(employee).transfer(weeklySalary);
    }

    function terminateContract() public onlyEmployer isContractSigned {
        require(block.timestamp < endDate, "Contract has already ended");
        require(address(this).balance >= penalty, "Insufficient contract balance");

        payable(employee).transfer(penalty);
        isSigned = false;
    }

    function fundContract() public payable onlyEmployer {
        // Function to fund the contract
    }

    receive() external payable {}

    fallback() external payable {}
}

contract EmploymentContractFactory {

    EmploymentContract[] public employmentContracts;

    event ContractCreated(address contractAddress, address employer);

    function createEmploymentContract(
        uint256 _monthlySalary,
        uint256 _bonus,
        uint256 _vacationPay,
        uint256 _sickLeavePay,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _penalty
    ) public {
        EmploymentContract newContract = new EmploymentContract(
            msg.sender,
            _monthlySalary,
            _bonus,
            _vacationPay,
            _sickLeavePay,
            _startDate,
            _endDate,
            _penalty
        );
        employmentContracts.push(newContract);
        emit ContractCreated(address(newContract), msg.sender);
    }

    function getContracts() public view returns (EmploymentContract[] memory) {
        return employmentContracts;
    }
}
