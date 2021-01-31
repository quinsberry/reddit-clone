import { Request, Response } from 'express'
import { isEmpty } from 'class-validator'
import { getRepository } from 'typeorm'

import { User } from '@entities/User'
import { Sub } from '@entities/Sub'

export class SubsController {
  async createSub(req: Request, res: Response) {
    const { title, name, description } = req.body

    const user: User = res.locals.user

    try {
      let errors: any = {}
      if (isEmpty(name)) errors.name = 'Name must not be empty.'
      if (isEmpty(title)) errors.title = 'Title must not be empty.'

      const sub = await getRepository(Sub)
        .createQueryBuilder('sub')
        .where('lower(sub.name) = :name', { name: name.toLowerCase() })
        .getOne()

      if (sub) errors.name = 'Sub exists already.'

      if (Object.keys(errors).length) {
        return res.status(422).json({
          code: 422,
          status: 'error',
          errors,
          message: 'Validation error.',
        })
      }

      const newSub = new Sub({ name, description, title, user })
      await newSub.save()

      return res.status(201).json({
        code: 201,
        status: 'success',
        data: newSub,
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
}

export const SubsCtrl = new SubsController()
