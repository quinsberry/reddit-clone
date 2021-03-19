import { Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

import { Entity } from './Entity'
import { Post } from './Post'
import { User } from './User'

@TOEntity('subs', { name: 'subs' })
export class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super()
    Object.assign(this, sub)
  }

  @Index()
  @Column({ unique: true })
  name: string

  @Index()
  @Column()
  title: string

  @Index()
  @Column({ type: 'text', nullable: true })
  description: string

  @Index()
  @Column({ nullable: true })
  imageUrn: string

  @Index()
  @Column({ nullable: true })
  bannerUrn: string

  @Column()
  username: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[]
}
