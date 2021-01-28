import { Router } from 'express'

import { SubsCtrl } from '@controllers/subs.controller'
import { auth } from '@middleware/auth.middleware'

export const subsRoutes = Router()

subsRoutes.post('/', auth, SubsCtrl.createSub)
