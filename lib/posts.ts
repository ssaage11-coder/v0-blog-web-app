import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"

function getPostsDirectory(): string {
  return path.join(process.cwd(), "content", "posts")
}

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
  related?: string[]
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
  excerpt: string
  readingTime: string
}

export interface PostWithHtml extends Post {
  htmlContent: string
}

function extractExcerpt(content: string, description?: string): string {
  if (description) return description

  // Remove markdown syntax and extract plain text
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // Replace links with text
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/[*_~]{1,2}([^*_~]+)[*_~]{1,2}/g, "$1") // Remove bold/italic/strikethrough
    .replace(/>\s/g, "") // Remove blockquotes
    .replace(/[-*+]\s/g, "") // Remove list markers
    .replace(/\d+\.\s/g, "") // Remove numbered list markers
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim()

  return plainText.slice(0, 200) + (plainText.length > 200 ? "..." : "")
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = getPostsDirectory()

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      const frontmatter = data as PostFrontmatter
      const stats = readingTime(content)

      return {
        slug,
        frontmatter,
        content,
        excerpt: extractExcerpt(content, frontmatter.description),
        readingTime: stats.text,
      }
    })

  // Sort by date descending (newest first)
  return allPosts.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}

export async function getPostBySlug(slug: string): Promise<PostWithHtml | null> {
  const postsDirectory = getPostsDirectory()
  const mdPath = path.join(postsDirectory, `${slug}.md`)
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`)

  let fullPath: string
  if (fs.existsSync(mdPath)) {
    fullPath = mdPath
  } else if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath
  } else {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  const frontmatter = data as PostFrontmatter
  const stats = readingTime(content)

  // Process markdown to HTML
  const processedContent = await remark().use(remarkGfm).use(remarkHtml).process(content)
  const htmlContent = processedContent.toString()

  return {
    slug,
    frontmatter,
    content,
    htmlContent,
    excerpt: extractExcerpt(content, frontmatter.description),
    readingTime: stats.text,
  }
}

export async function getRelatedPosts(currentSlug: string, related?: string[], tags?: string[]): Promise<Post[]> {
  const allPosts = await getAllPosts()

  // First, try to get posts from the related array
  if (related && related.length > 0) {
    const relatedPosts = allPosts.filter((post) => related.includes(post.slug) && post.slug !== currentSlug)
    if (relatedPosts.length > 0) {
      return relatedPosts.slice(0, 3)
    }
  }

  // Fallback: find posts with matching tags
  if (tags && tags.length > 0) {
    const postsWithMatchingTags = allPosts
      .filter((post) => post.slug !== currentSlug && post.frontmatter.tags.some((tag) => tags.includes(tag)))
      .slice(0, 3)
    return postsWithMatchingTags
  }

  return []
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagSet = new Set<string>()

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => tagSet.add(tag))
  })

  return Array.from(tagSet).sort()
}
