import type { UserPost, Region } from "../types"

// Swedish landscapes for our regional explorer
export const landscapes: Region[] = [
  { id: 1, name: "Uppland", positivity: 0.91, articles: 98 },
  { id: 3, name: "Skåne", positivity: 0.79, articles: 156 },
  { id: 6, name: "Småland", positivity: 0.81, articles: 68 },
  { id: 7, name: "Halland", positivity: 0.84, articles: 65 },
  { id: 8, name: "Närke", positivity: 0.77, articles: 62 },
  { id: 9, name: "Dalarna", positivity: 0.75, articles: 58 },
  { id: 12, name: "Blekinge", positivity: 0.8, articles: 45 },
]

// Mock user posts
export const userPosts: UserPost[] = [
  {
    id: 1,
    username: "AnnaS",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "2025-03-14",
    title: "Fantastisk soluppgång vid Turning Torso",
    content: "Vaknade tidigt för att fånga denna magiska morgon i Malmö. Vilken start på dagen! 🌅",
    image: "/placeholder.svg?height=400&width=600",
    likes: 124,
    comments: 23,
    shares: 12,
  },
  {
    id: 2,
    username: "ErikL",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "2025-03-13",
    title: "Lokalt initiativ för renare stränder",
    content: "Idag samlade vi över 50 personer för att städa Ribersborgsstranden. Tillsammans gör vi skillnad! 💪🌊",
    image: "/placeholder.svg?height=400&width=600",
    video: "/placeholder.mp4",
    likes: 89,
    comments: 15,
    shares: 8,
  },
]

