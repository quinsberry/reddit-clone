import { Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm'
import { makeId } from '../utils/helpers'

import { Entity } from './Entity'
import { Post } from './Post'
import { User } from './User'

@TOEntity('comments', { name: 'comments' })
export class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super()
    Object.assign(this, comment)
  }

  @Index()
  @Column({ unique: true })
  identifier: string

  @Column()
  body: string

  @Column({ type: 'text', nullable: true })
  username: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8)
  }
}
