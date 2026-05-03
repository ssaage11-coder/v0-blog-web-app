import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "v0-blog-web-app"
const basePath =
  process.env.PAGES_BASE_PATH ?? (process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "")
const withBasePath = (path: string) => `${basePath}${path}`

export const metadata: Metadata = {
  title: 'Dev Blog',
  description: 'Thoughts on web development, programming, and technology',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: withBasePath('/icon-light-32x32.png'),
        media: '(prefers-color-scheme: light)',
      },
      {
        url: withBasePath('/icon-dark-32x32.png'),
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: withBasePath('/icon.svg'),
        type: 'image/svg+xml',
      },
    ],
    apple: withBasePath('/apple-icon.png'),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
