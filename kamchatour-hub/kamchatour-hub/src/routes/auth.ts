import { Router, Request, Response } from 'express';
import { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactorCode
} from '../../auth';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Регистрация пользователя
router.post('/register', async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    // Валидация данных
    if (!userData.email || !userData.password || !userData.first_name || !userData.last_name) {
      return res.status(400).json({
        error: 'Неполные данные',
        message: 'Необходимо указать email, password, first_name и last_name'
      });
    }

    const user = await registerUser(userData);
    
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    
    if (error.message.includes('уже существует')) {
      return res.status(409).json({
        error: 'Пользователь уже существует',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Ошибка регистрации',
      message: 'Не удалось зарегистрировать пользователя'
    });
  }
});

// Вход пользователя
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Неполные данные',
        message: 'Необходимо указать email и password'
      });
    }

    const tokenPair = await loginUser({ email, password });
    
    res.json({
      message: 'Вход выполнен успешно',
      tokens: tokenPair
    });
  } catch (error: any) {
    console.error('Ошибка входа:', error);
    
    if (error.message.includes('Неверный')) {
      return res.status(401).json({
        error: 'Ошибка аутентификации',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Ошибка входа',
      message: 'Не удалось выполнить вход'
    });
  }
});

// Обновление токена
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken: refreshTokenFromBody } = req.body;
    
    if (!refreshTokenFromBody) {
      return res.status(400).json({
        error: 'Отсутствует refresh токен',
        message: 'Необходимо указать refresh токен'
      });
    }

    const newTokenPair = await refreshToken(refreshTokenFromBody);
    
    res.json({
      message: 'Токен обновлен успешно',
      tokens: newTokenPair
    });
  } catch (error: any) {
    console.error('Ошибка обновления токена:', error);
    
    res.status(401).json({
      error: 'Ошибка обновления токена',
      message: 'Недействительный или истекший refresh токен'
    });
  }
});

// Выход пользователя
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { refreshToken: refreshTokenFromBody } = req.body;
    
    if (req.user) {
      await logoutUser(req.user.id, refreshTokenFromBody);
    }
    
    res.json({
      message: 'Выход выполнен успешно'
    });
  } catch (error) {
    console.error('Ошибка выхода:', error);
    
    res.status(500).json({
      error: 'Ошибка выхода',
      message: 'Не удалось выполнить выход'
    });
  }
});

// Настройка 2FA
router.post('/2fa/setup', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Пользователь не аутентифицирован'
      });
    }

    const twoFactorData = await setupTwoFactor(req.user.id);
    
    res.json({
      message: '2FA настроен успешно',
      data: twoFactorData
    });
  } catch (error) {
    console.error('Ошибка настройки 2FA:', error);
    
    res.status(500).json({
      error: 'Ошибка настройки 2FA',
      message: 'Не удалось настроить двухфакторную аутентификацию'
    });
  }
});

// Включение 2FA
router.post('/2fa/enable', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Пользователь не аутентифицирован'
      });
    }

    await enableTwoFactor(req.user.id);
    
    res.json({
      message: '2FA включен успешно'
    });
  } catch (error) {
    console.error('Ошибка включения 2FA:', error);
    
    res.status(500).json({
      error: 'Ошибка включения 2FA',
      message: 'Не удалось включить двухфакторную аутентификацию'
    });
  }
});

// Отключение 2FA
router.post('/2fa/disable', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Пользователь не аутентифицирован'
      });
    }

    await disableTwoFactor(req.user.id);
    
    res.json({
      message: '2FA отключен успешно'
    });
  } catch (error) {
    console.error('Ошибка отключения 2FA:', error);
    
    res.status(500).json({
      error: 'Ошибка отключения 2FA',
      message: 'Не удалось отключить двухфакторную аутентификацию'
    });
  }
});

// Проверка 2FA кода
router.post('/2fa/verify', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Пользователь не аутентифицирован'
      });
    }

    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        error: 'Отсутствует код',
        message: 'Необходимо указать код 2FA'
      });
    }

    const isValid = await verifyTwoFactorCode(req.user.id, code);
    
    if (isValid) {
      res.json({
        message: 'Код 2FA подтвержден',
        verified: true
      });
    } else {
      res.status(400).json({
        error: 'Неверный код',
        message: 'Код 2FA неверен или истек',
        verified: false
      });
    }
  } catch (error) {
    console.error('Ошибка проверки 2FA:', error);
    
    res.status(500).json({
      error: 'Ошибка проверки 2FA',
      message: 'Не удалось проверить код двухфакторной аутентификации'
    });
  }
});

// Проверка статуса аутентификации
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Пользователь не аутентифицирован'
      });
    }

    res.json({
      message: 'Пользователь аутентифицирован',
      user: req.user
    });
  } catch (error) {
    console.error('Ошибка проверки статуса:', error);
    
    res.status(500).json({
      error: 'Ошибка проверки статуса',
      message: 'Не удалось проверить статус аутентификации'
    });
  }
});

export default router;