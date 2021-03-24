import { Request, Response } from 'express'

import { Post } from '@entities/Post'
import { Sub } from '@entities/Sub'
import { Comment } from '@entities/Comment'


export class PostsController {
    async createPost(req: Request, res: Response) {
        const { title, body, sub } = req.body

        const user = res.locals.user

        if (title.trim() === '') {
            return res.status(400).json({
                code: 400,
                status: 'error',
                message: 'Title must not be empty',
            })
        }

        try {
            const subRecord = await Sub.findOne({ name: sub })
            if (!subRecord) {
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    message: 'Sub not found.',
                })
            }

            const post = new Post({ title, body, user, sub: subRecord })
            await post.save()

            return res.status(200).json({
                code: 200,
                status: 'success',
                data: post,
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

    async getPosts(req: Request, res: Response) {
        const page: number = (req.query.page || 1) as number
        const limit: number = (req.query.limit || 0) as number

        try {
            const posts = await Post.find({
                order: { createdAt: 'DESC' },
                relations: ['comments', 'votes', 'sub'],
                skip: (page - 1) * limit,
                take: limit,
            })

            if (res.locals.user) {
                posts.forEach((p) => p.setUserVote(res.locals.user))
            }

            return res.status(200).json({
                code: 200,
                status: 'success',
                data: posts,
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

    async getPost(req: Request, res: Response) {
        const { identifier, slug } = req.params

        try {
            const post = await Post.findOne({ identifier, slug }, { relations: ['sub', 'votes'] })
            if (!post) {
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    message: 'Post not found.',
                })
            }

            if (res.locals.user) {
                post.setUserVote(res.locals.user)
            }

            return res.status(200).json({
                code: 200,
                status: 'success',
                data: post,
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

    async getPostComments(req: Request, res: Response) {
        const { identifier, slug } = req.params

        try {
            const post = await Post.findOne({ identifier, slug })
            if (!post) {
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    message: 'Post not found.',
                })
            }

            const comments = await Comment.find({
                where: { post },
                order: { createdAt: 'DESC' },
                relations: ['votes']
            })

            if (res.locals.user) {
                comments.forEach(c => c.setUserVote(res.locals.user))
            }

            return res.status(200).json({
                code: 200,
                status: 'success',
                data: comments,
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

    async commentOnPost(req: Request, res: Response) {
        const { identifier, slug } = req.params
        const body = req.body.body

        try {
            const post = await Post.findOne({ identifier, slug })
            if (!post) {
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    message: 'Post has not found.',
                })
            }

            const comment = new Comment({ body, user: res.locals.user, post })
            await comment.save()

            return res.status(201).json({
                code: 201,
                status: 'success',
                data: comment,
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

export const PostsCtrl = new PostsController()
