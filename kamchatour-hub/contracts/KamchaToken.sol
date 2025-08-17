// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title KamchaEcoToken
 * @dev Эко-токен KAMCHA для мотивации экологического туризма на Камчатке
 * @author Kamchatour Hub Team
 */
contract KamchaEcoToken is ERC20, Ownable, Pausable, ReentrancyGuard {
    
    // Структуры данных
    struct EcoAction {
        string actionType;
        uint256 points;
        uint256 timestamp;
        string location;
        string proof;
        bool verified;
        address user;
    }
    
    struct UserEcoScore {
        uint256 totalScore;
        uint256 dailyScore;
        uint256 weeklyScore;
        uint256 monthlyScore;
        uint256 lastUpdate;
        uint256 tokensEarned;
        uint256 tokensStaked;
        uint256 stakingStartTime;
        uint256 level;
    }
    
    struct StakingPool {
        uint256 totalStaked;
        uint256 rewardRate;
        uint256 lastUpdateTime;
        uint256 rewardPerTokenStored;
    }
    
    // Константы
    uint256 public constant ECO_SCORE_MULTIPLIER = 10; // 1 эко-балл = 10 KAMCHA
    uint256 public constant MAX_DAILY_ECO_SCORE = 100;
    uint256 public constant STAKING_REWARD_RATE = 5; // 5% годовых
    uint256 public constant BURN_RATE = 200; // 2% (200 базисных пунктов)
    uint256 public constant BURN_RATE_DENOMINATOR = 10000;
    
    // Переменные состояния
    mapping(address => UserEcoScore) public userEcoScores;
    mapping(address => EcoAction[]) public userEcoActions;
    mapping(address => uint256) public userStakingRewards;
    mapping(address => uint256) public userStakingBalance;
    
    StakingPool public stakingPool;
    
    uint256 public totalEcoScore;
    uint256 public totalBurnedTokens;
    uint256 public totalStakedTokens;
    
    // События
    event EcoScoreUpdated(address indexed user, uint256 newScore, uint256 tokensEarned);
    event EcoActionAdded(address indexed user, string actionType, uint256 points, string location);
    event EcoActionVerified(address indexed user, uint256 actionIndex, bool verified);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TokensBurned(address indexed user, uint256 amount);
    event LevelUp(address indexed user, uint256 newLevel);
    
    // Модификаторы
    modifier onlyVerifiedUser() {
        require(userEcoScores[msg.sender].totalScore > 0, "User must have eco score");
        _;
    }
    
    modifier validEcoAction(string memory actionType) {
        require(bytes(actionType).length > 0, "Invalid action type");
        _;
    }
    
    // Конструктор
    constructor() ERC20("Kamcha Eco Token", "KAMCHA") {
        _mint(msg.sender, 1000000 * 10**decimals()); // 1,000,000 KAMCHA
        stakingPool.rewardRate = STAKING_REWARD_RATE;
        stakingPool.lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Добавить эко-баллы пользователю
     * @param user Адрес пользователя
     * @param actionType Тип эко-действия
     * @param points Количество баллов
     * @param location Местоположение
     * @param proof Доказательство действия
     */
    function addEcoAction(
        address user,
        string memory actionType,
        uint256 points,
        string memory location,
        string memory proof
    ) external onlyOwner validEcoAction(actionType) {
        require(user != address(0), "Invalid user address");
        require(points > 0, "Points must be greater than 0");
        
        // Проверяем дневной лимит
        UserEcoScore storage userScore = userEcoScores[user];
        uint256 currentDay = block.timestamp / 1 days;
        uint256 lastUpdateDay = userScore.lastUpdate / 1 days;
        
        if (currentDay > lastUpdateDay) {
            userScore.dailyScore = 0;
            userScore.weeklyScore = 0;
            userScore.monthlyScore = 0;
        }
        
        require(userScore.dailyScore + points <= MAX_DAILY_ECO_SCORE, "Daily limit exceeded");
        
        // Создаем эко-действие
        EcoAction memory newAction = EcoAction({
            actionType: actionType,
            points: points,
            timestamp: block.timestamp,
            location: location,
            proof: proof,
            verified: false,
            user: user
        });
        
        userEcoActions[user].push(newAction);
        
        // Обновляем эко-счет
        userScore.totalScore += points;
        userScore.dailyScore += points;
        userScore.weeklyScore += points;
        userScore.monthlyScore += points;
        userScore.lastUpdate = block.timestamp;
        
        totalEcoScore += points;
        
        // Рассчитываем токены для начисления
        uint256 tokensToMint = points * ECO_SCORE_MULTIPLIER;
        _mint(user, tokensToMint);
        
        userScore.tokensEarned += tokensToMint;
        
        // Проверяем повышение уровня
        uint256 newLevel = _calculateLevel(userScore.totalScore);
        if (newLevel > userScore.level) {
            userScore.level = newLevel;
            emit LevelUp(user, newLevel);
        }
        
        emit EcoActionAdded(user, actionType, points, location);
        emit EcoScoreUpdated(user, userScore.totalScore, tokensToMint);
    }
    
    /**
     * @dev Верифицировать эко-действие
     * @param user Адрес пользователя
     * @param actionIndex Индекс действия
     * @param verified Статус верификации
     */
    function verifyEcoAction(
        address user,
        uint256 actionIndex,
        bool verified
    ) external onlyOwner {
        require(userEcoActions[user].length > actionIndex, "Invalid action index");
        
        userEcoActions[user][actionIndex].verified = verified;
        
        emit EcoActionVerified(user, actionIndex, verified);
    }
    
    /**
     * @dev Застейкать токены
     * @param amount Количество токенов для стейкинга
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _updateStakingRewards(msg.sender);
        
        _transfer(msg.sender, address(this), amount);
        
        userStakingBalance[msg.sender] += amount;
        totalStakedTokens += amount;
        stakingPool.totalStaked += amount;
        
        emit TokensStaked(msg.sender, amount);
    }
    
    /**
     * @dev Отменить стейкинг токенов
     * @param amount Количество токенов для отмены стейкинга
     */
    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(userStakingBalance[msg.sender] >= amount, "Insufficient staked balance");
        
        _updateStakingRewards(msg.sender);
        
        userStakingBalance[msg.sender] -= amount;
        totalStakedTokens -= amount;
        stakingPool.totalStaked -= amount;
        
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount);
    }
    
    /**
     * @dev Получить награды за стейкинг
     */
    function claimRewards() external nonReentrant whenNotPaused {
        _updateStakingRewards(msg.sender);
        
        uint256 rewards = userStakingRewards[msg.sender];
        require(rewards > 0, "No rewards to claim");
        
        userStakingRewards[msg.sender] = 0;
        
        _mint(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    /**
     * @dev Перевести токены с автоматическим сжиганием
     * @param to Адрес получателя
     * @param amount Количество токенов
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        uint256 burnAmount = (amount * BURN_RATE) / BURN_RATE_DENOMINATOR;
        uint256 transferAmount = amount - burnAmount;
        
        if (burnAmount > 0) {
            _burn(msg.sender, burnAmount);
            totalBurnedTokens += burnAmount;
            emit TokensBurned(msg.sender, burnAmount);
        }
        
        return super.transfer(to, transferAmount);
    }
    
    /**
     * @dev Перевести токены от имени с автоматическим сжиганием
     * @param from Адрес отправителя
     * @param to Адрес получателя
     * @param amount Количество токенов
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        uint256 burnAmount = (amount * BURN_RATE) / BURN_RATE_DENOMINATOR;
        uint256 transferAmount = amount - burnAmount;
        
        if (burnAmount > 0) {
            _burn(from, burnAmount);
            totalBurnedTokens += burnAmount;
            emit TokensBurned(from, burnAmount);
        }
        
        return super.transferFrom(from, to, transferAmount);
    }
    
    /**
     * @dev Получить эко-счет пользователя
     * @param user Адрес пользователя
     */
    function getEcoScore(address user) external view returns (UserEcoScore memory) {
        return userEcoScores[user];
    }
    
    /**
     * @dev Получить эко-действия пользователя
     * @param user Адрес пользователя
     */
    function getEcoActions(address user) external view returns (EcoAction[] memory) {
        return userEcoActions[user];
    }
    
    /**
     * @dev Получить информацию о стейкинге пользователя
     * @param user Адрес пользователя
     */
    function getStakingInfo(address user) external view returns (
        uint256 stakedBalance,
        uint256 pendingRewards,
        uint256 stakingStartTime
    ) {
        stakedBalance = userStakingBalance[user];
        pendingRewards = _calculatePendingRewards(user);
        stakingStartTime = userEcoScores[user].stakingStartTime;
    }
    
    /**
     * @dev Получить статистику токена
     */
    function getTokenStats() external view returns (
        uint256 _totalSupply,
        uint256 _totalEcoScore,
        uint256 _totalBurnedTokens,
        uint256 _totalStakedTokens,
        uint256 _activeUsers
    ) {
        _totalSupply = totalSupply();
        _totalEcoScore = totalEcoScore;
        _totalBurnedTokens = totalBurnedTokens;
        _totalStakedTokens = totalStakedTokens;
        _activeUsers = _getActiveUsersCount();
    }
    
    /**
     * @dev Рассчитать уровень пользователя
     * @param ecoScore Эко-счет пользователя
     */
    function _calculateLevel(uint256 ecoScore) internal pure returns (uint256) {
        if (ecoScore < 100) return 1;
        if (ecoScore < 500) return 2;
        if (ecoScore < 1000) return 3;
        if (ecoScore < 2500) return 4;
        if (ecoScore < 5000) return 5;
        if (ecoScore < 10000) return 6;
        if (ecoScore < 25000) return 7;
        if (ecoScore < 50000) return 8;
        if (ecoScore < 100000) return 9;
        return 10; // Легендарный уровень
    }
    
    /**
     * @dev Обновить награды за стейкинг
     * @param user Адрес пользователя
     */
    function _updateStakingRewards(address user) internal {
        if (stakingPool.totalStaked > 0) {
            stakingPool.rewardPerTokenStored = _rewardPerToken();
            stakingPool.lastUpdateTime = block.timestamp;
        }
        
        if (userStakingBalance[user] > 0) {
            userStakingRewards[user] = _calculatePendingRewards(user);
        }
    }
    
    /**
     * @dev Рассчитать награды за токен
     */
    function _rewardPerToken() internal view returns (uint256) {
        if (stakingPool.totalStaked == 0) {
            return stakingPool.rewardPerTokenStored;
        }
        
        return stakingPool.rewardPerTokenStored + (
            (block.timestamp - stakingPool.lastUpdateTime) * 
            stakingPool.rewardRate * 
            1e18 / 
            (365 days * stakingPool.totalStaked)
        );
    }
    
    /**
     * @dev Рассчитать ожидающие награды пользователя
     * @param user Адрес пользователя
     */
    function _calculatePendingRewards(address user) internal view returns (uint256) {
        if (userStakingBalance[user] == 0) {
            return userStakingRewards[user];
        }
        
        return userStakingRewards[user] + (
            userStakingBalance[user] * 
            (_rewardPerToken() - stakingPool.rewardPerTokenStored) / 
            1e18
        );
    }
    
    /**
     * @dev Получить количество активных пользователей
     */
    function _getActiveUsersCount() internal view returns (uint256) {
        // В реальной реализации здесь будет подсчет активных пользователей
        // Пока возвращаем 0
        return 0;
    }
    
    /**
     * @dev Приостановить контракт (только владелец)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Возобновить контракт (только владелец)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Изменить ставку наград за стейкинг (только владелец)
     * @param newRate Новая ставка
     */
    function setStakingRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 20, "Rate too high"); // Максимум 20%
        stakingPool.rewardRate = newRate;
    }
    
    /**
     * @dev Изменить дневной лимит эко-баллов (только владелец)
     * @param newLimit Новый лимит
     */
    function setMaxDailyEcoScore(uint256 newLimit) external onlyOwner {
        require(newLimit <= 500, "Limit too high"); // Максимум 500
        // В реальной реализации здесь будет обновление константы
    }
    
    /**
     * @dev Получить информацию о токене
     */
    function getTokenInfo() external view returns (
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) {
        _name = name();
        _symbol = symbol();
        _decimals = decimals();
        _totalSupply = totalSupply();
    }
}