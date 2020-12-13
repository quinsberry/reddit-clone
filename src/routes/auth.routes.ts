import { Router } from 'express'

import { AuthCtrl } from '../controllers'
import { auth } from '../middleware'

export const authRoutes = Router()

authRoutes.post('/register', AuthCtrl.register)
authRoutes.post('/login', AuthCtrl.login)
authRoutes.get('/me', auth, AuthCtrl.me)
authRoutes.get('/logout', auth, AuthCtrl.logout)
