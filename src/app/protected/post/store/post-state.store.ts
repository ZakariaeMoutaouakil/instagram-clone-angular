export type Comment = {
  authorPhoto: string
  authorUsername: string
  comment: string
  id: number
  timeUntilNow: number
}

export type CommentMetadata = {
  pageNumber: number
  totalPages: number
}

export type PostInfo = {
  description: string
  hashtags: string[]
  image: string
  like: boolean
  likesCount: number
  photo: string
  timeUntilNow: number
}

export type PostState = {
  commentMetadata: CommentMetadata
  comments: Comment[]
  postInfo: PostInfo
}
