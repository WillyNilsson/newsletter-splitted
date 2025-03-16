// Update the fetch URL in the component to use the path utility
import { getAssetPath } from "../utils/path-utils"

// In the fetchArticles function, update the fetch for mock data:
const localResponse = await fetch(getAssetPath("/mock-articles.json"))

