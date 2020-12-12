import { Entity as TOEntity, Column, Index, BeforeInsert } from 'typeorm'
import { IsEmail, Length } from 'class-validator'
import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'

import { Entity } from './Entity'

@TOEntity('posts', { name: 'posts' })
export class Post extends Entity {
  constructor(post: Partial<Post>) {
    super()
    Object.assign(this, post)
  }

  @Index()
  @Column()
  identifier: string // 7 character id

  @Column()
  title: string

  @Index()
  @Column()
  slug: string

  @Column({ nullable: true, type: 'text' })
  body: string

  @Column()
  subName: string
}
