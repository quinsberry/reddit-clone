import { Router } from 'express'

import { auth } from '@middleware/auth.middleware'
import { user } from '@middleware/user.middleware'

import { SubsCtrl } from '@controllers/subs.controller'

export const subsRoutes = Router()

subsRoutes.post('/', user, auth, SubsCtrl.createSub)
