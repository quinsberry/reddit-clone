import { Request, Response } from 'express'
import { getConnection } from 'typeorm'

import { Post } from '@entities/Post'
import { User } from '@entities/User'
import { Comment } from '@entities/Comment'
import { Vote } from '@entities/Vote'
import { Sub } from '@entities/Sub'


class MiscController {

    async vote(req: Request, res: Response) {

        const { identifier, slug, commentIdentifier, value } = req.body

        if (![-1, 0, 1].includes(value)) {

            return res.status(400).json({
                code: 400,
                status: 'error',
                message: 'Value must be -1, 0 or 1',
            })
        }

        try {

            const user: User = res.locals.user

            let post: Post | undefined
            let vote: Vote | undefined
            let comment: Comment | undefined

            try {
                post = await Post.findOneOrFail({ identifier, slug })
            } catch (err) {
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    message: 'Post not found',
                })
            }

            if (commentIdentifier) {
                // If there is a comment identifier find vote by comment
                comment = await Comment.findOneOrFail({ identifier: commentIdentifier })
                vote = await Vote.findOne({ user, comment })
            } else {
                // Else find vote by post
                vote = await Vote.findOne({ user, post })
            }

            if (!vote && value === 0) {
                // If no vote and value = 0 return error
                return res.status(404).json({
                    code: 404,
                    status: 'error',
                    message: 'Vote not found',
                })
            } else if (!vote) {
                // If no vote - create it
                vote = new Vote({ user, value })

                if (comment) vote.comment = comment
                else vote.post = post

                await vote.save()
            } else if (value === 0) {
                // If vote exists and value = 0 - remove vote from DB
                await vote.remove()
            } else if (vote.value !== value) {
                // If vote and value has changed - update vote
                vote.value = value
                await vote.save()
            }

            post = await Post.findOne({
                identifier,
                slug,
            }, { relations: ['comments', 'comments.votes', 'sub', 'votes'] })
            post.setUserVote(user)
            post.comments.forEach((c) => c.setUserVote(user))

            return res.status(200).json({
                code: 200,
                status: 'success',
                data: post,
            })
        } catch (err) {
            console.log(` >>> ${err}`)

            return res.status(500).json({
                code: 500,
                status: 'error',
                errors: err,
                message: 'Something went wrong',
            })
        }
    }

    async topSubs(_: Request, res: Response) {

        const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`

        try {

            const subs = await getConnection()
                .createQueryBuilder()
                .select(
                    `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
                )
                .from(Sub, 's')
                .leftJoin(Post, 'p', `s.name = p."subName"`)
                .groupBy('s.title, s.name, "imageUrl"')
                .orderBy(`"postCount"`, 'DESC')
                .limit(5)
                .execute()

            return res.status(200).json({
                code: 200,
                status: 'success',
                data: subs,
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

export const MiscCtrl = new MiscController()
