// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title FlareSafe X - Self-defending smart wallet (Option A - Stable Version)
/// @notice Security freeze triggers apply ONLY during transfers to avoid blocking configuration.
contract FlareSafeWallet {
    address public owner;
    address public guardian;

    bool public isFrozen;
    uint256 public lastFreezeTime;
    uint256 public timeLockPeriod = 1 hours;

    uint256 public highValueThreshold;
    uint256 public rapidTxWindow = 60;
    uint256 public rapidTxLimit = 5;

    uint256 public windowStart;
    uint256 public txCountInWindow;

    mapping(address => bool) public riskyAddress;
    mapping(address => bool) public trustedAddress;

    bool public safeModeEnabled;

    event Deposited(address indexed from, uint256 amount);
    event Transferred(address indexed to, uint256 amount);
    event Frozen(string reason, address indexed triggeredBy, uint256 timestamp);
    event Unfrozen(address indexed by, uint256 timestamp);
    event GuardianSet(address indexed guardian);
    event HighValueThresholdSet(uint256 amount);
    event RiskyAddressSet(address indexed addr, bool isRisky);
    event TrustedAddressSet(address indexed addr, bool isTrusted);
    event SafeModeToggled(bool enabled);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyGuardian() {
        require(msg.sender == guardian, "Not guardian");
        _;
    }

    modifier notFrozen() {
        require(!isFrozen, "Wallet is frozen");
        _;
    }

    constructor(uint256 _highValueThreshold) payable {
        owner = msg.sender;
        highValueThreshold = _highValueThreshold;
        windowStart = block.timestamp;
    }

    // --------- INTERNAL SECURITY (ONLY DURING TRANSFERS) ---------

    function _autoFreeze(string memory reason) internal {
        if (!isFrozen) {
            isFrozen = true;
            lastFreezeTime = block.timestamp;
            emit Frozen(reason, msg.sender, block.timestamp);
        }
    }

    function _checkRapidActivity() internal {
        if (block.timestamp > windowStart + rapidTxWindow) {
            windowStart = block.timestamp;
            txCountInWindow = 0;
        }

        txCountInWindow += 1;

        if (txCountInWindow > rapidTxLimit) {
            _autoFreeze("Rapid transaction pattern");
        }
    }

    function _beforeTransferChecks(address to, uint256 amount) internal {

        // High-value transaction rule
        if (highValueThreshold > 0 && amount >= highValueThreshold) {
            _autoFreeze("High-value transfer attempt");
        }

        // Risky address rule
        if (riskyAddress[to]) {
            _autoFreeze("Transfer to risky address");
        }

        // Safe mode rule
        if (safeModeEnabled && !trustedAddress[to]) {
            _autoFreeze("Non-trusted address in safe mode");
        }

        // Rapid transfer rule
        _checkRapidActivity();

        require(!isFrozen, "Transfer blocked (security triggered)");
    }

    // --------- PUBLIC FUNCTIONS ---------

    function deposit() external payable {
        require(msg.value > 0, "No value");
        emit Deposited(msg.sender, msg.value);
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function transfer(address payable to, uint256 amount)
        external
        // onlyOwner
        notFrozen
    {
        require(address(this).balance >= amount, "Insufficient balance");

        _beforeTransferChecks(to, amount);

        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Transfer failed");

        emit Transferred(to, amount);
    }

    // --------- FREEZE / UNFREEZE ---------

    function manualFreeze() external onlyOwner {
        _autoFreeze("Manual freeze");
    }

    function guardianFreeze() external onlyGuardian {
        _autoFreeze("Guardian freeze");
    }

    function unfreeze() external onlyOwner {
        require(isFrozen, "Not frozen");
        require(
            block.timestamp >= lastFreezeTime + timeLockPeriod,
            "Time lock active"
        );

        isFrozen = false;
        emit Unfrozen(msg.sender, block.timestamp);

        windowStart = block.timestamp;
        txCountInWindow = 0;
    }

    // --------- CONFIGURATION (ALWAYS ALLOWED) ---------

    function setGuardian(address _guardian) external  {
        guardian = _guardian;
        emit GuardianSet(_guardian);
    }

    function setHighValueThreshold(uint256 _amountWei) external onlyOwner {
        highValueThreshold = _amountWei;
        emit HighValueThresholdSet(_amountWei);
    }

    function setRiskyAddress(address _addr, bool _isRisky) external onlyOwner {
        riskyAddress[_addr] = _isRisky;
        emit RiskyAddressSet(_addr, _isRisky);
    }

    function setTrustedAddress(address _addr, bool _isTrusted) external onlyOwner {
        trustedAddress[_addr] = _isTrusted;
        emit TrustedAddressSet(_addr, _isTrusted);
    }

    function toggleSafeMode(bool enabled) external onlyOwner {
        safeModeEnabled = enabled;
        emit SafeModeToggled(enabled);
    }

    function setTimeLockPeriod(uint256 seconds_) external onlyOwner {
        timeLockPeriod = seconds_;
    }

    function setRapidTxConfig(uint256 windowSeconds, uint256 limit)
        external
        onlyOwner
    {
        rapidTxWindow = windowSeconds;
        rapidTxLimit = limit;
    }

    // --------- VIEW FUNCTIONS ---------

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getStatus()
        external
        view
        returns (
            bool frozen,
            uint256 balance,
            uint256 lastFreeze,
            bool safeMode,
            address _owner,
            address _guardian
        )
    {
        return (
            isFrozen,
            address(this).balance,
            lastFreezeTime,
            safeModeEnabled,
            owner,
            guardian
        );
    }
}
