import { Router } from 'express'

import { auth } from '@middleware/auth.middleware'
import { user } from '@middleware/user.middleware'
import { uploadImage } from '@middleware/multer.middleware'
import { ownSub } from '@middleware/ownSub.middleware'

import { SubsCtrl } from '@controllers/subs.controller'

export const subsRoutes = Router()

subsRoutes.post('/', user, auth, SubsCtrl.createSub)
subsRoutes.get('/:name', user, SubsCtrl.getSub)
subsRoutes.post('/:name/image', user, auth, ownSub, uploadImage.single('file'), SubsCtrl.uploadSubImage)
