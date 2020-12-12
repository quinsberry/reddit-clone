import { Request, Response } from 'express'
import { isEmpty, validate } from 'class-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import { User } from '../entities/User'

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, username, password } = req.body

    try {
      let errors: any = {}
      const emailUser = await User.findOne({ email })
      const usernameUser = await User.findOne({ username })

      if (emailUser) errors.email = 'Email is already taken.'
      if (usernameUser) errors.username = 'Username is already taken.'

      if (Object.keys(errors).length) {
        return res.status(400).json({
          code: 400,
          status: 'error',
          errors,
          message: 'Some fields are already taken.',
        })
      }

      const user = new User({ email, username, password })

      errors = await validate(user)
      if (errors.length) {
        return res.status(400).json({
          code: 400,
          status: 'error',
          errors,
          message: 'Validation error.',
        })
      }

      await user.save()

      return res.status(201).json({
        code: 201,
        status: 'success',
        data: user,
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

  async login(req: Request, res: Response) {
    const { username, password } = req.body

    try {
      let errors: any = {}
      if (isEmpty(username)) errors.username = 'Username must not be empty.'
      if (isEmpty(password)) errors.password = 'Password must not be empty.'
      if (Object.keys(errors).length) {
        return res.status(400).json({
          code: 400,
          status: 'error',
          errors,
          message: 'Empty fields.',
        })
      }

      const user = await User.findOne({ username })

      if (!user) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          errors: [],
          message: 'User not found.',
        })
      }

      const passwordMatches = await bcrypt.compare(password, user.password)

      if (!passwordMatches) {
        return res.status(403).json({
          code: 403,
          status: 'error',
          errors: [],
          message: 'Authentication failed.',
        })
      }

      const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret_key')

      res.set(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600,
          path: '/',
        }),
      )

      return res.status(200).json({
        code: 200,
        status: 'success',
        data: user,
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

  me(_: Request, res: Response) {
    return res.status(200).json({
      code: 200,
      status: 'success',
      data: res.locals.user,
    })
  }

  async logout(_: Request, res: Response) {
    try {
      res.set(
        'Set-Cookie',
        cookie.serialize('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: new Date(0),
          path: '/',
        }),
      )

      return res.status(200).json({
        code: 200,
        status: 'success',
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
