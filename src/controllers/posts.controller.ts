import { Request, Response } from 'express'

import { Post } from '../entities/Post'
import { Sub } from '../entities/Sub'
import { Comment } from '../entities/Comment'

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
      const subRecord = await Sub.findOne({ name: sub })
      if (!subRecord) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          errors: [],
          message: 'Sub has not found.',
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
      console.log(` >>> ${err}`)

      return res.status(500).json({
        code: 500,
        status: 'error',
        errors: err,
        message: 'Internal error.',
      })
    }
  }

  async getPosts(_: Request, res: Response) {
    try {
      const posts = await Post.find({ order: { createdAt: 'DESC' } })

      return res.status(200).json({
        code: 200,
        status: 'success',
        data: posts,
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
  async getPost(req: Request, res: Response) {
    const { identifier, slug } = req.params

    try {
      const post = await Post.findOne({ identifier, slug }, { relations: ['sub'] })
      if (!post) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          errors: [],
          message: 'Post has not found.',
        })
      }

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

  async commentOnPost(req: Request, res: Response) {
    const { identifier, slug } = req.params
    const body = req.body.body

    try {
      const post = await Post.findOne({ identifier, slug })
      if (!post) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          errors: [],
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
