import { Entity as TOEntity, Column, Index, BeforeInsert, OneToMany } from 'typeorm'
import { IsEmail, Length } from 'class-validator'
import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'

import { Entity } from './Entity'
import { Post } from './Post'

@TOEntity('users', { name: 'users' })
export class User extends Entity {
  constructor(user: Partial<User>) {
    super()
    Object.assign(this, user)
  }

  @Index()
  @IsEmail(undefined, { message: 'Invalid email.' })
  @Column({ unique: true })
  email: string

  @Index()
  @Length(3, 255, { message: 'Username must be at least 3 characters long.' })
  @Column({ unique: true })
  username: string

  @Exclude()
  @Column()
  @Length(6, 255, { message: 'Password must be at least 6 characters long.' })
  password: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6)
  }
}
