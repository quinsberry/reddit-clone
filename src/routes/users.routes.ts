import { Router } from 'express'

import { user } from '@middleware/user.middleware'
import { UsersCtrl } from '@controllers/users.controller'

export const usersRoutes = Router()

usersRoutes.get('/:username', user, UsersCtrl.getUserSubmissions)
