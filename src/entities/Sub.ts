import { Column, Entity as TOEntity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { Entity } from './Entity'
import { Post } from './Post'
import { User } from './User'
import { Expose } from 'class-transformer'


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

    @Expose()
    get imageUrl(): string {
        return this.imageUrn
            ? `${process.env.APP_URL}/images/${this.imageUrn}`
            : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    }

    @Expose()
    get bannerUrl(): string | undefined {
        return this.bannerUrn
            ? `${process.env.APP_URL}/images/${this.bannerUrn}`
            : undefined
    }
}
