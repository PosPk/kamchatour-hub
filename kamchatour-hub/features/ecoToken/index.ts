import { ethers } from 'ethers';

// ABI для смарт-контракта KAMCHA токена
export const KAMCHA_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function ecoScore(address user) view returns (uint256)",
  "function addEcoScore(address user, uint256 points)",
  "function getEcoRewards(address user) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event EcoScoreUpdated(address indexed user, uint256 newScore, uint256 tokensEarned)"
];

// Конфигурация токена
export const KAMCHA_TOKEN_CONFIG = {
  name: "KAMCHA Eco Token",
  symbol: "KAMCHA",
  decimals: 18,
  initialSupply: ethers.utils.parseEther("1000000"), // 1,000,000 KAMCHA
  ecoScoreMultiplier: 10, // 1 эко-балл = 10 KAMCHA
  maxEcoScorePerDay: 100, // Максимум эко-баллов в день
  stakingRewards: 0.05, // 5% годовых за стейкинг
  burnRate: 0.02, // 2% токенов сжигается при каждой транзакции
  ecoActions: {
    VOLCANO_CLEANUP: 50,      // Уборка вулкана
    BEACH_CLEANUP: 30,        // Уборка пляжа
    TREE_PLANTING: 40,        // Посадка деревьев
    WASTE_COLLECTION: 20,     // Сбор мусора
    ECO_EDUCATION: 25,        // Экологическое просвещение
    SUSTAINABLE_TRAVEL: 35,   // Устойчивые путешествия
    CARBON_OFFSET: 60,        // Компенсация углерода
    WILDLIFE_PROTECTION: 45,  // Защита дикой природы
    WATER_CONSERVATION: 30,   // Сохранение воды
    RENEWABLE_ENERGY: 50      // Использование возобновляемой энергии
  }
};

// Интерфейсы
export interface EcoAction {
  id: string;
  type: keyof typeof KAMCHA_TOKEN_CONFIG.ecoActions;
  name: string;
  description: string;
  points: number;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  timestamp: number;
  proof: string; // IPFS hash или фото
  verified: boolean;
}

export interface EcoScore {
  userId: string;
  totalScore: number;
  dailyScore: number;
  weeklyScore: number;
  monthlyScore: number;
  tokensEarned: number;
  tokensStaked: number;
  stakingRewards: number;
  level: number;
  achievements: string[];
}

export interface TokenTransaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  type: 'mint' | 'transfer' | 'burn' | 'stake' | 'unstake' | 'reward';
  timestamp: number;
  ecoActionId?: string;
}

// Основной класс для управления эко-токенами
export class KamchaEcoToken {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private contract: ethers.Contract;
  private contractAddress: string;

  constructor(contractAddress: string, provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.contractAddress = contractAddress;
    this.contract = new ethers.Contract(
      contractAddress,
      KAMCHA_TOKEN_ABI,
      this.signer
    );
  }

  // Получить информацию о токене
  async getTokenInfo() {
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
        this.contract.totalSupply()
      ]);

      return {
        name,
        symbol,
        decimals: decimals.toString(),
        totalSupply: ethers.utils.formatEther(totalSupply)
      };
    } catch (error) {
      console.error('Ошибка получения информации о токене:', error);
      throw error;
    }
  }

  // Получить баланс пользователя
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.contract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
      throw error;
    }
  }

  // Получить эко-счет пользователя
  async getEcoScore(address: string): Promise<number> {
    try {
      const score = await this.contract.ecoScore(address);
      return score.toNumber();
    } catch (error) {
      console.error('Ошибка получения эко-счета:', error);
      throw error;
    }
  }

  // Добавить эко-баллы и начислить токены
  async addEcoScore(userAddress: string, action: EcoAction): Promise<boolean> {
    try {
      // Проверяем, что действие не превышает дневной лимит
      const currentDailyScore = await this.getDailyEcoScore(userAddress);
      if (currentDailyScore + action.points > KAMCHA_TOKEN_CONFIG.maxEcoScorePerDay) {
        throw new Error('Превышен дневной лимит эко-баллов');
      }

      // Добавляем эко-баллы
      const tx = await this.contract.addEcoScore(userAddress, action.points);
      await tx.wait();

      // Рассчитываем токены для начисления
      const tokensToMint = action.points * KAMCHA_TOKEN_CONFIG.ecoScoreMultiplier;
      
      // Минтим токены пользователю
      const mintTx = await this.contract.mint(userAddress, tokensToMint);
      await mintTx.wait();

      console.log(`Начислено ${tokensToMint} KAMCHA за эко-действие`);
      return true;
    } catch (error) {
      console.error('Ошибка добавления эко-баллов:', error);
      throw error;
    }
  }

  // Получить дневной эко-счет
  async getDailyEcoScore(address: string): Promise<number> {
    // В реальной реализации здесь будет логика получения дневного счета
    // Пока возвращаем 0
    return 0;
  }

  // Перевести токены
  async transfer(to: string, amount: number): Promise<boolean> {
    try {
      const amountWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contract.transfer(to, amountWei);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Ошибка перевода токенов:', error);
      throw error;
    }
  }

  // Сжечь токены (для дефляции)
  async burn(amount: number): Promise<boolean> {
    try {
      const amountWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contract.burn(amountWei);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Ошибка сжигания токенов:', error);
      throw error;
    }
  }

  // Стейкинг токенов
  async stake(amount: number): Promise<boolean> {
    try {
      // В реальной реализации здесь будет логика стейкинга
      // Пока просто возвращаем true
      console.log(`Застейкано ${amount} KAMCHA`);
      return true;
    } catch (error) {
      console.error('Ошибка стейкинга:', error);
      throw error;
    }
  }

  // Получить награды за стейкинг
  async getStakingRewards(address: string): Promise<number> {
    try {
      // В реальной реализации здесь будет логика расчета наград
      // Пока возвращаем 0
      return 0;
    } catch (error) {
      console.error('Ошибка получения наград за стейкинг:', error);
      throw error;
    }
  }

  // Получить историю транзакций
  async getTransactionHistory(address: string): Promise<TokenTransaction[]> {
    try {
      // В реальной реализации здесь будет логика получения истории
      // Пока возвращаем пустой массив
      return [];
    } catch (error) {
      console.error('Ошибка получения истории транзакций:', error);
      throw error;
    }
  }

  // Рассчитать уровень пользователя на основе эко-счета
  calculateUserLevel(ecoScore: number): number {
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

  // Получить достижения пользователя
  getAchievements(ecoScore: number, level: number): string[] {
    const achievements: string[] = [];
    
    if (ecoScore >= 100) achievements.push('🌱 Эко-новичок');
    if (ecoScore >= 500) achievements.push('🌿 Защитник природы');
    if (ecoScore >= 1000) achievements.push('🌳 Хранитель леса');
    if (ecoScore >= 2500) achievements.push('🏔️ Защитник вулканов');
    if (ecoScore >= 5000) achievements.push('🐻 Друг медведей');
    if (ecoScore >= 10000) achievements.push('🌊 Хранитель океана');
    if (ecoScore >= 25000) achievements.push('🌍 Эко-легенда');
    if (ecoScore >= 50000) achievements.push('⚡ Квантовый эколог');
    if (ecoScore >= 100000) achievements.push('👑 Король Камчатки');
    
    if (level >= 5) achievements.push('⭐ Звездный уровень');
    if (level >= 8) achievements.push('💎 Алмазный уровень');
    if (level >= 10) achievements.push('🏆 Легендарный уровень');
    
    return achievements;
  }

  // Создать эко-действие
  createEcoAction(
    type: keyof typeof KAMCHA_TOKEN_CONFIG.ecoActions,
    location: { latitude: number; longitude: number; name: string },
    proof: string
  ): EcoAction {
    const action: EcoAction = {
      id: `eco_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: this.getEcoActionName(type),
      description: this.getEcoActionDescription(type),
      points: KAMCHA_TOKEN_CONFIG.ecoActions[type],
      location,
      timestamp: Date.now(),
      proof,
      verified: false
    };

    return action;
  }

  // Получить название эко-действия
  private getEcoActionName(type: keyof typeof KAMCHA_TOKEN_CONFIG.ecoActions): string {
    const names = {
      VOLCANO_CLEANUP: 'Уборка вулкана',
      BEACH_CLEANUP: 'Уборка пляжа',
      TREE_PLANTING: 'Посадка деревьев',
      WASTE_COLLECTION: 'Сбор мусора',
      ECO_EDUCATION: 'Экологическое просвещение',
      SUSTAINABLE_TRAVEL: 'Устойчивые путешествия',
      CARBON_OFFSET: 'Компенсация углерода',
      WILDLIFE_PROTECTION: 'Защита дикой природы',
      WATER_CONSERVATION: 'Сохранение воды',
      RENEWABLE_ENERGY: 'Возобновляемая энергия'
    };
    return names[type];
  }

  // Получить описание эко-действия
  private getEcoActionDescription(type: keyof typeof KAMCHA_TOKEN_CONFIG.ecoActions): string {
    const descriptions = {
      VOLCANO_CLEANUP: 'Уборка мусора на склонах вулканов',
      BEACH_CLEANUP: 'Очистка пляжей от пластика и мусора',
      TREE_PLANTING: 'Посадка саженцев для восстановления лесов',
      WASTE_COLLECTION: 'Сбор и правильная утилизация отходов',
      ECO_EDUCATION: 'Обучение других экологическим практикам',
      SUSTAINABLE_TRAVEL: 'Путешествия с минимальным углеродным следом',
      CARBON_OFFSET: 'Компенсация выбросов CO2',
      WILDLIFE_PROTECTION: 'Защита диких животных и их среды обитания',
      WATER_CONSERVATION: 'Экономия и защита водных ресурсов',
      RENEWABLE_ENERGY: 'Использование солнечной и ветровой энергии'
    };
    return descriptions[type];
  }

  // Верифицировать эко-действие
  async verifyEcoAction(actionId: string, verifierAddress: string): Promise<boolean> {
    try {
      // В реальной реализации здесь будет логика верификации
      // Пока просто возвращаем true
      console.log(`Эко-действие ${actionId} верифицировано пользователем ${verifierAddress}`);
      return true;
    } catch (error) {
      console.error('Ошибка верификации эко-действия:', error);
      throw error;
    }
  }

  // Получить статистику токена
  async getTokenStats(): Promise<{
    totalSupply: string;
    circulatingSupply: string;
    burnedTokens: string;
    stakedTokens: string;
    totalEcoScore: number;
    activeUsers: number;
  }> {
    try {
      const totalSupply = await this.contract.totalSupply();
      
      return {
        totalSupply: ethers.utils.formatEther(totalSupply),
        circulatingSupply: ethers.utils.formatEther(totalSupply), // Упрощенно
        burnedTokens: '0', // В реальной реализации будет расчет
        stakedTokens: '0', // В реальной реализации будет расчет
        totalEcoScore: 0, // В реальной реализации будет расчет
        activeUsers: 0 // В реальной реализации будет расчет
      };
    } catch (error) {
      console.error('Ошибка получения статистики токена:', error);
      throw error;
    }
  }
}

// Утилиты для работы с токенами
export class KamchaTokenUtils {
  // Форматировать количество токенов
  static formatTokens(amount: number, decimals: number = 18): string {
    return ethers.utils.formatUnits(amount, decimals);
  }

  // Конвертировать в wei
  static parseTokens(amount: string, decimals: number = 18): ethers.BigNumber {
    return ethers.utils.parseUnits(amount, decimals);
  }

  // Рассчитать комиссию за транзакцию
  static calculateTransactionFee(gasPrice: ethers.BigNumber, gasLimit: number): string {
    const fee = gasPrice.mul(gasLimit);
    return ethers.utils.formatEther(fee);
  }

  // Проверить валидность адреса
  static isValidAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }

  // Сократить адрес для отображения
  static shortenAddress(address: string, chars: number = 4): string {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
  }

  // Рассчитать APY для стейкинга
  static calculateStakingAPY(
    stakedAmount: number,
    rewardRate: number,
    timePeriod: number
  ): number {
    return (rewardRate / stakedAmount) * (365 * 24 * 60 * 60 / timePeriod) * 100;
  }
}

// Экспорт по умолчанию
export default KamchaEcoToken;