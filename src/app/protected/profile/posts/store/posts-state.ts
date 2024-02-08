export type Post = {
  id: number
  image: string
  likesCount: number
  commentCounts: number
}

export type PostsMetadata = {
  pageNumber: number
  totalPages: number
}

export interface PostsState {
  posts: Post[]
  metadata: PostsMetadata
}
