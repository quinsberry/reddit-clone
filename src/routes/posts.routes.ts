import { Router } from 'express'

import { PostsCtrl } from '../controllers'
import { auth } from '../middleware'

export const postsRoutes = Router()

postsRoutes.post('/', auth, PostsCtrl.createPost)
// postsRoutes.post('/login', PostsCtrl.login)
// postsRoutes.get('/me', auth, PostsCtrl.me)
// postsRoutes.get('/logout', auth, PostsCtrl.logout)
