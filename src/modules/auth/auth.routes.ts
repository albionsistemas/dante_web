import { Router } from 'express';
import { login, logout, showLoginForm } from '@/modules/auth/auth.controller';
import { redirectIfAuthenticated } from '@/middlewares/require-auth';

export const authRouter = Router();

authRouter.get('/login', redirectIfAuthenticated, showLoginForm);
authRouter.post('/login', redirectIfAuthenticated, login);
authRouter.post('/logout', logout);
