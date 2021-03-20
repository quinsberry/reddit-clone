import { Router } from 'express'

import { auth } from '@middleware/auth.middleware'
import { user } from '@middleware/user.middleware'

import { MiscCtrl } from '@controllers/misc.controller'

export const miscRoutes = Router()

miscRoutes.post('/vote', user, auth, MiscCtrl.vote)
miscRoutes.get('/top-subs', MiscCtrl.topSubs)
