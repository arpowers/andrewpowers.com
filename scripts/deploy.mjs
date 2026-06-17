import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const profileSource = readFileSync(join(process.cwd(), 'src', 'data', 'profile.ts'), 'utf8')
const configuredProject = profileSource.match(/cloudflareProject:\s*['"]([^'"]+)['"]/)?.[1]
const configuredBranch = profileSource.match(/branch:\s*['"]([^'"]+)['"]/)?.[1]
const project = process.env.CF_PAGES_PROJECT || configuredProject
const branch = process.env.CF_PAGES_BRANCH || configuredBranch || 'main'

if (!project) {
  console.error('Missing Cloudflare Pages project. Set profile.deployment.cloudflareProject or CF_PAGES_PROJECT.')
  process.exit(1)
}

const result = spawnSync('wrangler', [
  'pages',
  'deploy',
  'dist',
  '--project-name',
  project,
  '--branch',
  branch,
], {
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
