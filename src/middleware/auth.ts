import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { User } from '../entities/User'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({
        code: 401,
        status: 'error',
        errors: [],
        message: 'Unauthenticated.',
      })
    }

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET || 'secret_key')

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({
        code: 401,
        status: 'error',
        errors: [],
        message: 'Unauthenticated.',
      })
    }

    res.locals.user = user

    return next()
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: 'error',
      errors: err,
      message: 'Server authentication problem.',
    })
  }
}
