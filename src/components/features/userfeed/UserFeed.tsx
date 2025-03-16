import { Users } from "lucide-react"
import type { UserPost } from "../../../types"
import UserPostItem from "./UserPostItem"

interface UserFeedProps {
  posts: UserPost[]
}

export default function UserFeed({ posts }: UserFeedProps) {
  return (
    <div>
      <div className="popover-header" style={{ marginBottom: "1.5rem" }}>
        <h2 className="page-title">Användarinlägg</h2>
        <div className="badge">Kommer snart</div>
      </div>

      <div className="sidebar" style={{ marginBottom: "1.5rem" }}>
        <div className="user-input-container">
          <div className="avatar-placeholder">
            <Users size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <input type="text" placeholder="Dela något positivt..." className="user-input" disabled />
          </div>
          <button className="post-button">Dela</button>
        </div>

        <div className="user-posts">
          {posts.map((post) => (
            <UserPostItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

