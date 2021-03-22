import { Request, Response } from 'express'

import { User } from '@entities/User'
import { Post } from '@entities/Post'
import { Comment } from '@entities/Comment'


export class UsersController {
    async getUserSubmissions(req: Request, res: Response) {
        try {
            const user = await User.findOne({
                where: { username: req.params.username },
                select: ['username', 'createdAt'],
            })

            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    errors: {},
                    message: 'User not found',
                })
            }

            const posts = await Post.find({
                where: { user },
                relations: ['comments', 'votes', 'sub'],
            })

            const comments = await Comment.find({
                where: { user },
                relations: ['post'],
            })

            if (res.locals.user) {
                posts.forEach((post) => post.setUserVote(res.locals.user))
                comments.forEach((comment) => comment.setUserVote(res.locals.user))
            }

            let submissions: any[] = []
            posts.forEach((post) => submissions.push({ type: 'Post', ...post.toJSON() }))
            comments.forEach((comment) => submissions.push({ type: 'Comment', ...comment.toJSON() }))

            submissions.sort((a, b) => {
                if (b.createdAt > a.createdAt) return 1
                if (b.createdAt < a.createdAt) return -1
                return 0
            })

            return res.status(201).json({
                code: 201,
                status: 'success',
                data: {
                    user,
                    submissions,
                },
            })
        } catch (err) {
            return res.status(500).json({
                code: 500,
                status: 'error',
                errors: err,
                message: 'Something went wrong',
            })
        }
    }
}

export const UsersCtrl = new UsersController()
