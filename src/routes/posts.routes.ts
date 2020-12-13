import { Router } from 'express'

import { PostsCtrl } from '../controllers'
import { auth } from '../middleware'

export const postsRoutes = Router()

postsRoutes.post('/', auth, PostsCtrl.createPost)
postsRoutes.get('/', PostsCtrl.getPosts)
postsRoutes.get('/:identifier/:slug', PostsCtrl.getPost)
postsRoutes.post('/:identifier/:slug/comments', auth, PostsCtrl.commentOnPost)
