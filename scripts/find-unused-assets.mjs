#!/usr/bin/env node
/**
 * Finds images and documents in public/ that are not referenced anywhere
 * in public/data/*.json or src/ source files.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, relative } from 'path'

const ROOT = new URL('..', import.meta.url).pathname

function walk(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) results.push(...walk(full))
    else results.push(full)
  }
  return results
}

function readText(file) {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}

// 1. Collect all asset files on disk (relative public URL form: /images/... /documents/... /videos/...)
const imageDir = join(ROOT, 'public/images')
const docsDir = join(ROOT, 'public/documents')
const videosDir = join(ROOT, 'public/videos')

const assetFiles = new Set()
if (existsSync(imageDir)) {
  for (const f of walk(imageDir)) assetFiles.add('/' + relative(join(ROOT, 'public'), f))
}
if (existsSync(docsDir)) {
  for (const f of walk(docsDir)) assetFiles.add('/' + relative(join(ROOT, 'public'), f))
}
if (existsSync(videosDir)) {
  for (const f of walk(videosDir)) {
    if (!f.endsWith('.gitkeep')) assetFiles.add('/' + relative(join(ROOT, 'public'), f))
  }
}

// 2. Collect all referenced paths from JSON data files
const referencedPaths = new Set()
const dataDir = join(ROOT, 'public/data')
for (const f of walk(dataDir)) {
  if (!f.endsWith('.json')) continue
  const text = readText(f)
  // Match any "/images/...", "/documents/...", or "/videos/..." string value in JSON
  for (const m of text.matchAll(/"(\/(?:images|documents|videos)\/[^"]+)"/g)) {
    referencedPaths.add(m[1])
  }
}

// 3. Collect hardcoded paths from source files
const srcDir = join(ROOT, 'src')
const srcExts = ['.ts', '.tsx', '.js', '.jsx']
for (const f of walk(srcDir)) {
  if (!srcExts.some(e => f.endsWith(e))) continue
  const text = readText(f)
  // Match paths anywhere in source (covers srcSet, template literals, plain strings)
  for (const m of text.matchAll(/\/(images|documents|videos)\/[^\s"'`<>{}()]+/g)) {
    referencedPaths.add(m[0])
  }
}

// 4. Haushaltsreden PDFs are dynamically constructed as /documents/fraktion/haushaltsreden/${year}.pdf
//    Mark them all as referenced so they don't show as orphans.
for (const f of assetFiles) {
  if (f.match(/\/documents\/fraktion\/haushaltsreden\/\d{4}\.pdf$/)) {
    referencedPaths.add(f)
  }
}

// 5. Report
const unused = [...assetFiles].filter(f => !referencedPaths.has(f)).sort()

console.log(`\nAssets on disk:      ${assetFiles.size}`)
console.log(`Referenced paths:    ${referencedPaths.size}`)
console.log(`Unused assets:       ${unused.length}\n`)

if (unused.length === 0) {
  console.log('No unused assets found.')
} else {
  const images = unused.filter(f => f.startsWith('/images/'))
  const docs = unused.filter(f => f.startsWith('/documents/'))
  const videos = unused.filter(f => f.startsWith('/videos/'))
  if (images.length) {
    console.log('--- Unused images ---')
    images.forEach(f => console.log(' ', f))
  }
  if (docs.length) {
    console.log('\n--- Unused documents ---')
    docs.forEach(f => console.log(' ', f))
  }
  if (videos.length) {
    console.log('\n--- Unused videos ---')
    videos.forEach(f => console.log(' ', f))
  }
}
