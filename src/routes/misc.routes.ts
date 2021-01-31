import { Router } from 'express'

import { MiscCtrl } from '@controllers/misc.controller'
import { auth } from '@middleware/auth.middleware'

export const miscRoutes = Router()

miscRoutes.post('/vote', auth, MiscCtrl.vote)
