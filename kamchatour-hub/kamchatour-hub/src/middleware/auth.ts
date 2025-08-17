import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../../auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Токен доступа не предоставлен',
        message: 'Необходима авторизация для доступа к этому ресурсу'
      });
      return;
    }

    const userId = await validateToken(token);
    
    // В реальной системе здесь нужно получить данные пользователя из БД
    req.user = {
      id: userId,
      email: 'user@example.com', // Временно
      first_name: 'User', // Временно
      last_name: 'Example' // Временно
    };

    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(403).json({
      error: 'Недействительный токен',
      message: 'Токен доступа истек или недействителен'
    });
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Пользователь не аутентифицирован'
      });
      return;
    }

    // В реальной системе здесь нужно проверить роли пользователя
    // Пока что пропускаем всех аутентифицированных пользователей
    next();
  };
}

export function requireVerified(): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Пользователь не аутентифицирован'
      });
      return;
    }

    // В реальной системе здесь нужно проверить верификацию пользователя
    // Пока что пропускаем всех аутентифицированных пользователей
    next();
  };
}