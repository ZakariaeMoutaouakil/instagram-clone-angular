export type Post = {
  image: string
  likesCount: number
  commentCounts: number
}

export interface PostsState {
  posts: Post[]
}
