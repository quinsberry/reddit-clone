/*
* -------------
*     Post
* -------------
* */

export interface Post {
    createdAt: Date
    updatedAt: Date
    identifier: string
    title: string
    slug: string
    body: string
    subName: string
    username: string

    // Virtual fields
    url: string
    voteScore?: number
    commentCount?: number
    userVote?: number
}

export interface PostWithSub extends Post {
    sub: Sub
}

/*
* -------------
*     User
* -------------
* */

export interface User {
    username: string
    email: string
    createdAt: Date
    updatedAt: Date
}

/*
* -------------
*     Sub
* -------------
* */

export interface Sub {
    username: string
    email: string
    createdAt: Date
    updatedAt: Date
    name: string,
    title: string,
    description: string,
    imageUrn: string | null,
    bannerUrn: string | null,

    // Virtual fields
    imageUrl: string
    bannerUrl?: string
}

export interface SubWithPosts extends Sub {
    posts: Post[]
}

export interface TopSub {
    title: string
    name: string
    imageUrl: string
    postCount: string
}

/*
* -------------
*    Comment
* -------------
* */

export interface Comment {
    createdAt: string,
    updatedAt: string,
    identifier: string,
    body: string,
    username: string,

    // Virtual fields
    userVote: number,
    voteScore?: number
}

export interface CommentWithPost extends Comment {
    post: Post
}

export interface SubmittedCommentResponse extends Comment {
    user: User
    post: Post
}

/*
* -----------------
*    Submissions
* -----------------
* */

interface PostSubmission extends PostWithSub {
    type: 'Post'
}

interface CommentSubmission extends CommentWithPost {
    type: 'Comment'
}

export type Submission = PostSubmission | CommentSubmission