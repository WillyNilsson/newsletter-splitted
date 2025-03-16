/**
 * Utility functions for handling paths in GitHub Pages environment
 */

// Get the base path for assets based on the current environment
export function getBasePath() {
  // Check if we're running on GitHub Pages
  const isGitHubPages =
    window.location.hostname.includes("github.io") || window.location.pathname.includes("/gladstart")

  return isGitHubPages ? "/gladstart" : ""
}

// Get the correct path for an asset
export function getAssetPath(path) {
  const basePath = getBasePath()

  // If the path already starts with the base path or is an absolute URL, return it as is
  if (path.startsWith(basePath) || path.startsWith("http") || path.startsWith("//")) {
    return path
  }

  // Otherwise, prepend the base path
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`
}

