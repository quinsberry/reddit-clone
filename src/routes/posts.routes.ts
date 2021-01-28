import { Router } from 'express'

import { PostsCtrl } from '@controllers/posts.controller'
import { auth } from '@middleware/auth.middleware'

export const postsRoutes = Router()

postsRoutes.post('/', auth, PostsCtrl.createPost)
postsRoutes.get('/', PostsCtrl.getPosts)
postsRoutes.get('/:identifier/:slug', PostsCtrl.getPost)
postsRoutes.post('/:identifier/:slug/comments', auth, PostsCtrl.commentOnPost)
