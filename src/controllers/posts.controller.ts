import { Request, Response } from 'express'
import { validate } from 'class-validator'

import { User } from '../entities/User'
import { Post } from '../entities/Post'
import { Sub } from '../entities/Sub'

export class PostsController {
  async createPost(req: Request, res: Response) {
    const { title, body, sub } = req.body

    const user = res.locals.user

    if (title.trim() === '') {
      return res.status(400).json({
        code: 400,
        status: 'error',
        errors: [],
        message: 'Title must not be empty',
      })
    }

    try {
      const subRecord = await Sub.findOneOrFail({ name: sub })

      const post = new Post({ title, body, user, sub: subRecord })
      await post.save()

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
        message: 'Internal error.',
      })
    }
  }
}
