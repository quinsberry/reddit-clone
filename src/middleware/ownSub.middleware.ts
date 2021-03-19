import { NextFunction, Request, Response } from 'express'

import { User } from '@entities/User'
import { Sub } from '@entities/Sub'

export const ownSub = async (req: Request, res: Response, next: NextFunction) => {
    const user: User = res.locals.user

    try {
        const sub = await Sub.findOneOrFail({
            where: {
                name: req.params.name
            }
        })

        if (sub.username !== user.username) {
            return res.status(403).json({
                code: 403,
                status: 'error',
                errors: {},
                message: 'You dont own this sub',
            })
        }

        res.locals.sub = sub
        return next()
    } catch (err) {
        return res.status(404).json({
            code: 404,
            status: 'error',
            errors: err,
            message: 'Sub not found',
        })
    }
}
