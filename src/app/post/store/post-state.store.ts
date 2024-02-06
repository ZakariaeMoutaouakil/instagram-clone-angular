export type Comment = {
  authorPhoto: string
  authorUsername: string
  timeUntilNow: number
  comment: string
}

export type CommentMetadata = {
  pageNumber: number
  totalPages: number
}

export type PostInfo = {
  timeUntilNow: number
  likesCount: number
  description: string
  image: string
  photo: string
}

export type PostState = {
  postInfo: PostInfo
  comments: Comment[]
  commentMetadata: CommentMetadata
}
