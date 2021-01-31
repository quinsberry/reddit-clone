import { Router } from 'express'

import { auth } from '@middleware/auth.middleware'
import { user } from '@middleware/user.middleware'

import { AuthCtrl } from '@controllers/auth.controller'

export const authRoutes = Router()

authRoutes.post('/register', AuthCtrl.register)
authRoutes.post('/login', AuthCtrl.login)
authRoutes.get('/me', user, auth, AuthCtrl.me)
authRoutes.get('/logout', user, auth, AuthCtrl.logout)
