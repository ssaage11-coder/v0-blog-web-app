---
title: "Building REST APIs with Next.js"
description: "Learn how to create robust REST APIs using Next.js Route Handlers with TypeScript."
date: "2026-04-25"
tags: ["Next.js", "API", "Backend", "TypeScript"]
related: ["getting-started-with-nextjs", "typescript-best-practices"]
---

# Building REST APIs with Next.js

Next.js provides a powerful way to build APIs right alongside your frontend code. Let's explore how to create robust REST APIs using Route Handlers.

## Route Handlers Basics

Create API routes in the `app/api` directory:

```typescript
// app/api/users/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]
  
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  // Validate and create user
  const newUser = {
    id: Date.now(),
    name: body.name,
  }
  
  return NextResponse.json(newUser, { status: 201 })
}
```

## Dynamic Routes

Handle dynamic parameters in your API:

```typescript
// app/api/users/[id]/route.ts
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Fetch user from database
  const user = await getUserById(id)
  
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }
  
  return NextResponse.json(user)
}
```

## Request Validation

Always validate incoming data:

```typescript
import { z } from "zod"

const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
})

export async function POST(request: Request) {
  const body = await request.json()
  
  const result = CreateUserSchema.safeParse(body)
  
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.issues },
      { status: 400 }
    )
  }
  
  // Use validated data
  const user = await createUser(result.data)
  return NextResponse.json(user, { status: 201 })
}
```

## Error Handling

Implement consistent error responses:

```typescript
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}

function handleError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    )
  }
  
  console.error("Unexpected error:", error)
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  )
}
```

## Best Practices

Here are some key practices for building APIs:

1. **Always validate input** - Use Zod or similar libraries
2. **Handle errors gracefully** - Return appropriate status codes
3. **Use proper HTTP methods** - GET, POST, PUT, DELETE, PATCH
4. **Add authentication** - Protect sensitive endpoints
5. **Document your API** - Consider OpenAPI/Swagger

> A well-designed API is predictable, consistent, and easy to use.

## Conclusion

Next.js makes it easy to build full-stack applications with integrated APIs. Combined with TypeScript, you get type safety across your entire stack.
