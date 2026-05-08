#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const TARGET_DIR = path.join(process.cwd(), '.agents', 'skills', 'flowz')
const SKILL_DIR = path.join(__dirname, '..')

const FILES_TO_COPY = [
  'SKILL.md',
  'README.md',
]

const EXAMPLE_FILES = [
  'examples/discovery.md',
  'examples/full-stack.md',
]

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

function main() {
  const projectName = path.basename(process.cwd())

  console.log('\n  🔧 Flowz skill installer\n')
  console.log(`  Project: ${projectName}`)
  console.log(`  Target:  .agents/skills/flowz/\n`)

  ensureDir(TARGET_DIR)

  for (const file of FILES_TO_COPY) {
    const src = path.join(SKILL_DIR, file)
    const dest = path.join(TARGET_DIR, file)
    if (fs.existsSync(src)) {
      copyFile(src, dest)
      console.log(`  ✓ ${file}`)
    }
  }

  ensureDir(path.join(TARGET_DIR, 'examples'))
  for (const file of EXAMPLE_FILES) {
    const src = path.join(SKILL_DIR, file)
    const dest = path.join(TARGET_DIR, file)
    if (fs.existsSync(src)) {
      copyFile(src, dest)
      console.log(`  ✓ ${file}`)
    }
  }

  console.log(`
  ✅ Skill installed!

  Invoke in Claude Code:
    /flowz

  Claude will guide you through building workflow.md for this project.

  Format spec:
    .agents/skills/flowz/README.md
    https://flowz.app/workflow_md
`)
}

main()
