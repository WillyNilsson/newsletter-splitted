// Define all shared types here
export interface Topic {
  id: number
  name: string
}

export interface Source {
  id: number
  name: string
}

export interface Article {
  id: number
  title: string
  summary: string
  source: Source
  published_date: string
  positivity_score: number
  topics: Topic[]
  region: string
  image_url: string
  url: string
}

export interface ArticlesData {
  articles: Article[]
}

export interface Region {
  id: number
  name: string
  positivity: number
  articles: number
}

export interface UserPost {
  id: number
  username: string
  avatar: string
  date: string
  title: string
  content: string
  image?: string
  video?: string
  likes: number
  comments: number
  shares: number
}

export interface FilterState {
  region: string
  topics: string[]
  sources: string[]
  minScore: number
}

