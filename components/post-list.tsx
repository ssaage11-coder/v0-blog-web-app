"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/posts"

interface PostListProps {
  posts: Post[]
  allTags: string[]
}

export function PostList({ posts, allTags }: PostListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by search query
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        post.frontmatter.title.toLowerCase().includes(searchLower) ||
        post.frontmatter.description.toLowerCase().includes(searchLower) ||
        post.frontmatter.tags.some((tag) => tag.toLowerCase().includes(searchLower))

      // Filter by selected tags
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => post.frontmatter.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [posts, searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
  }

  const hasActiveFilters = searchQuery !== "" || selectedTags.length > 0

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {filteredPosts.length} of {posts.length} posts
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No posts found matching your criteria.</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-2 text-primary hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
