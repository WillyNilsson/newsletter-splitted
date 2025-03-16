import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-form">
            <iframe
              src="https://gladstart.curated.co/embed?color1=f5efe7&color2=4a3520&color_bg_button=e67e22&color_border=f39c12&color_button=ffffff&color_links=6f4e37&color_terms=967259&title=Join+GladStart+%F0%9F%98%8A+"
              width="100%"
              height="310"
              frameBorder="0"
              style={{ maxWidth: "100%" }}
              title="GladStart Newsletter"
            ></iframe>
          </div>
          <div className="social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61574156665429"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com/TheGladStart" target="_blank" rel="noopener noreferrer" className="social-link">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://www.instagram.com/thegladstart/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://www.linkedin.com/company/106882021/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

