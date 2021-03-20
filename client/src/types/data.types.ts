export interface Post {
    identifier: string
    title: string
    body: string
    slug: string
    subName: string
    sub: Sub<undefined>
    createdAt: Date
    updatedAt: Date
    username: string

    // Virtual fields
    url: string
    voteScore?: number
    commentCount?: number
    userVote?: number
}

export interface User {
    username: string
    email: string
    createdAt: Date
    updatedAt: Date
}

export interface Sub<P = Post[]> {
    username: string
    email: string
    createdAt: Date
    updatedAt: Date
    name: string,
    title: string,
    description: string,
    imageUrn: string | null,
    bannerUrn: string | null,
    posts: P

    // Virtual fields
    imageUrl: string
    bannerUrl?: string
}

export interface TopSub {
    title: string
    name: string
    imageUrl: string
    postCount: string
}