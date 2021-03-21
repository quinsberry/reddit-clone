import { Router } from 'express'

import { auth } from '@middleware/auth.middleware'
import { user } from '@middleware/user.middleware'

import { PostsCtrl } from '@controllers/posts.controller'


export const postsRoutes = Router()

postsRoutes.post('/', user, auth, PostsCtrl.createPost)
postsRoutes.get('/', user, PostsCtrl.getPosts)
postsRoutes.get('/:identifier/:slug', user, PostsCtrl.getPost)
postsRoutes.post('/:identifier/:slug/comments', user, auth, PostsCtrl.commentOnPost)
postsRoutes.get('/:identifier/:slug/comments', user, PostsCtrl.getPostComments)
