export type info = {
  username: string
  firstname: string
  lastname: string
  bio: string
  validated: boolean
  photo: string
  follow: boolean
}

export type stats = {
  followers: number
  followings: number
  posts: number
}

export interface PersonState {
  info: info
  stats: stats
}
