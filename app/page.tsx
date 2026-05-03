import { getAllPosts, getAllTags } from "@/lib/posts"
import { PostList } from "@/components/post-list"
import { Header } from "@/components/header"

export default async function HomePage() {
  const posts = await getAllPosts()
  const allTags = await getAllTags()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Thoughts on web development, programming, and technology.
          </p>
        </div>
        <PostList posts={posts} allTags={allTags} />
      </main>
    </div>
  )
}
