import type { UserPost } from "../../../types"
import { formatDate } from "../../../services/articleService"

interface UserPostItemProps {
  post: UserPost
}

export default function UserPostItem({ post }: UserPostItemProps) {
  return (
    <div className="user-post">
      <div className="post-header">
        <img
          src={post.avatar || "/placeholder.svg"}
          alt={post.username}
          width={40}
          height={40}
          style={{ borderRadius: "9999px" }}
        />
        <div className="post-content">
          <div className="post-meta">
            <h4 className="post-author">{post.username}</h4>
            <span className="post-date">{formatDate(post.date, "long")}</span>
          </div>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-text">{post.content}</p>

          {post.image && (
            <div className="post-image">
              <img src={post.image || "/placeholder.svg"} alt={post.title} />
            </div>
          )}

          {post.video && (
            <div
              className="post-image"
              style={{
                aspectRatio: "16/9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
              }}
            >
              <div style={{ color: "#6b7280" }}>Video kommer snart</div>
            </div>
          )}

          <div className="post-actions">
            <div className="action-buttons">
              <button className="action-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{post.likes}</span>
              </button>
              <button className="action-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{post.comments}</span>
              </button>
              <button className="action-button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>Dela</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

