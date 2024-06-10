pragma solidity ^0.8.0;

/// @title Employment Contract
/// @notice This contract manages the employment relationship between an employer and an employee.
contract EmploymentContract {
    address public employer;       // Employer's address
    address public employee;       // Employee's address

    uint256 public salary;         // Monthly salary
    uint256 public bonus;          // Bonus
    uint256 public vacationPay;    // Vacation pay
    uint256 public sickLeavePay;   // Sick leave pay
    uint256 public penalty;        // Penalty for contract termination

    uint256 public startDate;       // Contract start date
    uint256 public endDate;         // Contract end date
    uint256 public lastPaymentDate; // Last payment date
    uint256 public paymentInterval; // Payment interval

    struct Details {
        address contractAddress;
        address employer;
        address employee;
        uint256 salary;
        uint256 bonus;
        uint256 penalty;
        uint256 vacationPay;
        uint256 sickLeavePay;
        uint256 startDate;
        uint256 endDate;
        uint256 lastPaymentDate;
        uint256 paymentInterval;
        bool isSigned;
        address reserve;
    }

    bool public isSigned = false;  // Contract signed status

    address public reserve;        // Reserve storage for penalty

    event ContractFunded(address indexed from, uint256 amount);

    /// @dev Modifier to check that the action is performed only by the employer
    modifier onlyEmployer() {
        require(msg.sender == employer, "Only employer can perform this action");
        _;
    }

    /// @dev Modifier to check that the action is performed only by the employee
    modifier onlyEmployee() {
        require(msg.sender == employee, "Only employee can perform this action");
        _;
    }

    /// @dev Modifier to check that the contract is signed
    modifier isContractSigned() {
        require(isSigned == true, "Contract is not signed by employee yet");
        _;
    }

    /// @notice Contract constructor
    /// @param _employer Employer's address
    /// @param _salary Monthly salary
    /// @param _bonus Bonus
    /// @param _vacationPay Vacation pay
    /// @param _sickLeavePay Sick leave pay
    /// @param _startDate Contract start date
    /// @param _endDate Contract end date
    /// @param _penalty Penalty for contract termination
    constructor(
        address _employer,
        uint256 _salary,
        uint256 _bonus,
        uint256 _vacationPay,
        uint256 _sickLeavePay,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _penalty,
        uint256 _paymentInterval,
        address _reserve
    ) {
        require(_startDate < _endDate, "Start date must be before end date");
        require(_employer != address(0), "Employer address cannot be zero");
        require(_reserve != address(0), "Reserve address cannot be zero");

        employer = _employer;
        salary = _salary;
        bonus = _bonus;
        vacationPay = _vacationPay;
        sickLeavePay = _sickLeavePay;
        startDate = _startDate;
        endDate = _endDate;
        penalty = _penalty;
        paymentInterval = _paymentInterval;
        reserve = _reserve;
        lastPaymentDate = block.timestamp; // Contract starts upon deployment
    }

    /// @notice Function for the employee to sign the contract
    /// @param _employee Employee's address
    function signContract(address _employee) public onlyEmployer {
        require(!isSigned, "Contract already signed");
        require(block.timestamp >= startDate, "Contract start date has not been reached");
        require(_employee != address(0), "Employee address cannot be zero");
        employee = _employee;
        isSigned = true;
    }

    /// @notice Function for the employee to confirm their signature
    function confirmEmployeeSignature() public payable onlyEmployee {
        require(isSigned, "Contract must be signed by employer first");
        require(msg.value == penalty, "Employee must send the penalty amount");

        payable(reserve).transfer(penalty);
    }

    /// @notice Function for weekly salary payment
    function makePayment() public onlyEmployer isContractSigned {
        require(block.timestamp >= lastPaymentDate + paymentInterval, "Payment interval has not passed");
        require(block.timestamp < endDate, "Contract has ended");

        uint256 paymentAmount = (salary * 12) / (365 days / paymentInterval);
        require(address(this).balance >= paymentAmount, "Insufficient contract balance");

        lastPaymentDate += paymentInterval;
        payable(employee).transfer(paymentAmount);
    }

    /// @notice Function to terminate the contract
    function terminateContract() public isContractSigned {
        require(block.timestamp < endDate, "Contract has already ended");

        if (msg.sender == employer) {
            require(address(this).balance >= penalty, "Insufficient contract balance");
            payable(employee).transfer(penalty);
        } else if (msg.sender == employee) {
            require(address(this).balance >= penalty, "Insufficient contract balance");
            payable(employer).transfer(penalty);
        } else {
            revert("Only employer or employee can terminate the contract");
        }

        isSigned = false;
    }

    // Function to return the contract's details
    function getDetails() public view returns (Details memory) {
        return Details({
            contractAddress: address(this),
            employer: employer,
            employee: employee,
            salary: salary,
            bonus: bonus,
            vacationPay: vacationPay,
            sickLeavePay: sickLeavePay,
            startDate: startDate,
            endDate: endDate,
            lastPaymentDate: lastPaymentDate,
            paymentInterval: paymentInterval,
            isSigned: isSigned,
            reserve: reserve,
            penalty: penalty
        });
    }

    /// @notice Function to fund the contract
    function fundContract() public payable onlyEmployer {
        // The employer can fund the contract by sending funds to the contract address.
        // These funds will be used for salary payments and other payments to the employee.
        require(msg.value > 0, "Must send some ether to fund the contract");

        // Log the contract funding
        emit ContractFunded(msg.sender, msg.value);
    }

    /// @notice Function to receive funds by the contract
    receive() external payable {
        // This function is called when the contract receives funds without data.
        // For example, when simply transferring ETH to the contract address.
        // The funds will be credited to the contract balance and can be used for payments.
    }

    /// @notice Function to handle incorrect calls
    fallback() external payable {
        // This function is called when the contract receives funds with data
        // or when a function that does not exist in the contract is called.
        // The funds will be credited to the contract balance and can be used for payments.
    }
}

/// @title Employment Contract Factory
/// @notice This contract allows the creation of EmploymentContract instances.
contract EmploymentContractFactory {

    EmploymentContract[] public employmentContracts; // Array of contracts

    /// @notice Event for contract creation
    /// @param contractAddress Address of the created contract
    /// @param employer Employer's address
    event ContractCreated(address contractAddress, address employer);

    /// @notice Function to create a new contract
    /// @param _salary Monthly salary
    /// @param _bonus Bonus
    /// @param _vacationPay Vacation pay
    /// @param _sickLeavePay Sick leave pay
    /// @param _startDate Contract start date
    /// @param _endDate Contract end date
    /// @param _penalty Penalty for contract termination
    function createEmploymentContract(
        uint256 _salary,
        uint256 _bonus,
        uint256 _vacationPay,
        uint256 _sickLeavePay,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _penalty,
        uint256 _paymentInterval,
        address _reserve
    ) public {
        EmploymentContract newContract = new EmploymentContract(
            msg.sender,
            _salary,
            _bonus,
            _vacationPay,
            _sickLeavePay,
            _startDate,
            _endDate,
            _penalty,
            _paymentInterval,
            _reserve
        );
        employmentContracts.push(newContract);
        emit ContractCreated(address(newContract), msg.sender);
    }

    /// @notice Function to get all created contracts
    /// @return Array of contracts
    function getContracts() public view returns (EmploymentContract[] memory) {
        return employmentContracts;
    }

    /// @notice Function to get details of a specific contract by address
    /// @param contractAddress Address of the contract
    /// @return Contract details
    function getContractDetailByAddress(address contractAddress) public view returns (EmploymentContract.Details memory) {
        for (uint256 i = 0; i < employmentContracts.length; i++) {
            if (address(employmentContracts[i]) == contractAddress) {
                return employmentContracts[i].getDetails();
            }
        }
        revert("Contract not found");
    }

    function getContractsDetails() public view returns (EmploymentContract.Details[] memory) {
        EmploymentContract.Details[] memory contractsDetails = new EmploymentContract.Details[](employmentContracts.length);

        for (uint256 i = 0; i < employmentContracts.length; i++) {
            contractsDetails[i] = employmentContracts[i].getDetails();
        }

        return contractsDetails;
    }
}
