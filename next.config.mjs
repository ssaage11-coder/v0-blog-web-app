/** @type {import('next').NextConfig} */
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "v0-blog-web-app"
const pagesBasePath =
  process.env.PAGES_BASE_PATH ?? (process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "")

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath ? `${pagesBasePath}/` : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
