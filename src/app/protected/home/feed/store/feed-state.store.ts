export type FeedPost = {
  image: string
  uploaderPhoto: string
  timeUntilNow: number
  uploaderUsername: string
  id: number
  description: string
  likesCount: number
  commentCounts: number
  uploaderValidated: boolean
  like: boolean
}

export type FeedState = {
  posts: FeedPost[]
  number: number
  last: boolean
}
