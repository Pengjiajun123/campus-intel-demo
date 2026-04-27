import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/campus-intel-demo";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGitHubPages ? githubPagesBasePath : undefined,
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;
