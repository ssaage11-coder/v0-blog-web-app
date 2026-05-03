---
title: "Modern React State Management"
description: "Exploring different approaches to managing state in React applications, from hooks to external libraries."
date: "2026-04-20"
tags: ["React", "State Management", "JavaScript"]
related: ["getting-started-with-nextjs"]
---

# Modern React State Management

State management is one of the most discussed topics in the React ecosystem. Let's explore the modern approaches available in 2026.

## Built-in Solutions

### useState for Local State

For simple component state, `useState` is still the go-to solution:

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

### useReducer for Complex State

When state logic becomes complex, reach for `useReducer`:

```tsx
type State = { count: number; step: number }
type Action = 
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "setStep"; step: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step }
    case "decrement":
      return { ...state, count: state.count - state.step }
    case "setStep":
      return { ...state, step: action.step }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  )
}
```

## Context for Sharing State

Share state across components without prop drilling:

```tsx
const ThemeContext = createContext<{
  theme: "light" | "dark"
  toggle: () => void
} | null>(null)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  
  const toggle = () => setTheme(t => t === "light" ? "dark" : "light")
  
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## When to Use External Libraries

Consider external libraries when you need:

- **Global state** across many components
- **Persistence** (localStorage, IndexedDB)
- **DevTools** for debugging
- **Middleware** for side effects

Popular choices include:

| Library | Best For |
|---------|----------|
| Zustand | Simple global state |
| Jotai | Atomic state management |
| TanStack Query | Server state & caching |
| Redux Toolkit | Complex applications |

## Server State vs Client State

> It's important to distinguish between server state (data from APIs) and client state (UI state).

For server state, use TanStack Query or SWR:

```tsx
import useSWR from "swr"

function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/users/${userId}`,
    fetcher
  )
  
  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />
  
  return <Profile user={data} />
}
```

## Conclusion

Choose your state management solution based on your needs:

1. Start with `useState` and `useReducer`
2. Use Context for shared state
3. Add external libraries when complexity grows
4. Treat server state differently from client state

The best state management is the simplest one that meets your requirements.
