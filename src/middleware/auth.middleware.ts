import { NextFunction, Request, Response } from 'express'

import { User } from '@entities/User'

export const auth = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user

    if (!user) {
      return res.status(401).json({
        code: 401,
        status: 'error',
        message: 'Unauthenticated',
      })
    }

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
