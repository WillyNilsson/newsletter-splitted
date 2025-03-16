"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import "../app/styles.css"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

export default function LazyImage({ src, alt, className = "", style = {} }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const containerStyle: React.CSSProperties = {
    position: "relative",
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    ...style,
  }

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.3s",
    opacity: isLoaded ? 1 : 0,
  }

  const loaderStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const spinnerStyle: React.CSSProperties = {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    border: "4px solid #fdba74",
    borderTopColor: "#ea580c",
    animation: "spin 1s linear infinite",
  }

  return (
    <div ref={imgRef} className={className} style={containerStyle}>
      {isInView && <img src={src || "/placeholder.svg"} alt={alt} style={imgStyle} onLoad={() => setIsLoaded(true)} />}
      {(!isInView || !isLoaded) && (
        <div style={loaderStyle}>
          <div style={spinnerStyle}></div>
        </div>
      )}
    </div>
  )
}

