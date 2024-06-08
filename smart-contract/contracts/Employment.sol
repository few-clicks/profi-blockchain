pragma solidity ^0.8.0;

/// @title Employment Contract
/// @notice This contract manages the employment relationship between an employer and an employee.
contract EmploymentContract {
    address public employer;       // Адрес работодателя
    address public employee;       // Адрес сотрудника

    uint256 public salary;         // Месячная зарплата
    uint256 public bonus;          // Бонус
    uint256 public vacationPay;    // Оплата отпуска
    uint256 public sickLeavePay;   // Оплата больничного
    uint256 public penalty;        // Штраф за расторжение контракта

    uint256 public startDate;       // Дата начала контракта
    uint256 public endDate;         // Дата окончания контракта
    uint256 public lastPaymentDate; // Дата последней выплаты
    uint256 public paymentInterval; // Интервал платежей

    bool public isSigned = false;  // Статус подписания контракта

    address public reserve;        // Резервное хранилище для штрафа

    /// @dev Модификатор для проверки, что действие выполняет только работодатель
    modifier onlyEmployer() {
        require(msg.sender == employer, "Only employer can perform this action");
        _;
    }

    /// @dev Модификатор для проверки, что действие выполняет только сотрудник
    modifier onlyEmployee() {
        require(msg.sender == employee, "Only employee can perform this action");
        _;
    }

    /// @dev Модификатор для проверки, что контракт подписан
    modifier isContractSigned() {
        require(isSigned == true, "Contract is not signed by employee yet");
        _;
    }

    /// @notice Конструктор контракта
    /// @param _employer Адрес работодателя
    /// @param _salary Месячная зарплата
    /// @param _bonus Бонус
    /// @param _vacationPay Оплата отпуска
    /// @param _sickLeavePay Оплата больничного
    /// @param _startDate Дата начала контракта
    /// @param _endDate Дата окончания контракта
    /// @param _penalty Штраф за расторжение контракта
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
        lastPaymentDate = block.timestamp; // Контракт начинается при развертывании
    }

    /// @notice Функция для подписания контракта сотрудником
    /// @param _employee Адрес сотрудника
    function signContract(address _employee) public onlyEmployer {
        require(!isSigned, "Contract already signed");
        require(block.timestamp >= startDate, "Contract start date has not been reached");
        employee = _employee;
        isSigned = true;
        payable(reserve).transfer(penalty);
    }

    /// @notice Функция для еженедельной выплаты зарплаты
    function makePayment() public onlyEmployer isContractSigned {
        require(block.timestamp >= lastPaymentDate + paymentInterval, "Payment interval has not passed");
        require(block.timestamp < endDate, "Contract has ended");

        uint256 paymentAmount = (salary * 12) / (365 days / paymentInterval);
        require(address(this).balance >= paymentAmount, "Insufficient contract balance");

        lastPaymentDate += paymentInterval;
        payable(employee).transfer(paymentAmount);
    }

    /// @notice Функция для расторжения контракта
    function terminateContract() public isContractSigned {
        require(block.timestamp < endDate, "Contract has already ended");
        require(address(this).balance >= penalty, "Insufficient contract balance");

        payable(employee).transfer(penalty);
        isSigned = false;
    }

    /// @notice Функция для пополнения контракта
    function fundContract() public payable onlyEmployer {
        // Функция для пополнения контракта
    }

    /// @notice Функция для получения средств контрактом
    receive() external payable {}

    /// @notice Функция для обработки некорректных вызовов
    fallback() external payable {}
}

/// @title Employment Contract Factory
/// @notice This contract allows the creation of EmploymentContract instances.
contract EmploymentContractFactory {

    EmploymentContract[] public employmentContracts; // Массив контрактов

    /// @notice Событие создания контракта
    /// @param contractAddress Адрес созданного контракта
    /// @param employer Адрес работодателя
    event ContractCreated(address contractAddress, address employer);

    /// @notice Функция для создания нового контракта
    /// @param _salary Месячная зарплата
    /// @param _bonus Бонус
    /// @param _vacationPay Оплата отпуска
    /// @param _sickLeavePay Оплата больничного
    /// @param _startDate Дата начала контракта
    /// @param _endDate Дата окончания контракта
    /// @param _penalty Штраф за расторжение контракта
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

    /// @notice Функция для получения всех созданных контрактов
    /// @return Массив контрактов
    function getContracts() public view returns (EmploymentContract[] memory) {
        return employmentContracts;
    }
}
