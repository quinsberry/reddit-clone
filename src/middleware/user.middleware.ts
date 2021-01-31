import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { User } from '@entities/User'

export const user = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token
    if (!token) return next()

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET || 'secret_key')

    const user = await User.findOne({ username })

    res.locals.user = user

    return next()
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: 'error',
      errors: err,
      message: 'Server authentication problem',
    })
  }
}
