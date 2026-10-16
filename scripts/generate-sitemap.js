import { writeFile } from 'node:fs/promises'

const siteUrl = (process.env.VITE_SITE_URL || 'https://republic-school.sambo-chr.ru').replace(/\/$/, '')
const directusUrl = process.env.VITE_DIRECTUS_URL?.replace(/\/$/, '')

const routes = new Map([
  ['/', { changefreq: 'weekly', priority: '1.0' }],
  ['/news', { changefreq: 'daily', priority: '0.9' }],
  ['/documents', { changefreq: 'weekly', priority: '0.8' }],
  ['/gallery', { changefreq: 'weekly', priority: '0.7' }],
  ['/contacts', { changefreq: 'monthly', priority: '0.7' }],
  ['/about/osnovnye-svedeniya', { changefreq: 'monthly', priority: '0.8' }],
  ['/about/rukovodstvo', { changefreq: 'monthly', priority: '0.8' }],
])

const fallbackNews = [
  'training-camp-shali',
  'student-championship',
  'north-caucasus-championship',
]

for (const slug of fallbackNews) {
  routes.set(`/news/${slug}`, { changefreq: 'monthly', priority: '0.7' })
}

async function loadPublished(collection, fields) {
  if (!directusUrl) return []
  const params = new URLSearchParams({
    'filter[status][_eq]': 'published',
    limit: '-1',
    fields,
  })
  const response = await fetch(`${directusUrl}/items/${collection}?${params}`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`${collection}: HTTP ${response.status}`)
  return (await response.json()).data || []
}

if (directusUrl) {
  const [pagesResult, newsResult] = await Promise.allSettled([
    loadPublished('pages', 'slug,date_updated'),
    loadPublished('news', 'slug,date_updated,published_at'),
  ])

  if (pagesResult.status === 'fulfilled') {
    for (const page of pagesResult.value) {
      routes.set(`/about/${page.slug}`, {
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: page.date_updated,
      })
    }
  }

  if (newsResult.status === 'fulfilled') {
    for (const article of newsResult.value) {
      routes.set(`/news/${article.slug}`, {
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: article.date_updated || article.published_at,
      })
    }
  }
}

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const entries = Array.from(routes, ([path, options]) => {
  const lastmod = options.lastmod ? `\n    <lastmod>${escapeXml(String(options.lastmod).slice(0, 10))}</lastmod>` : ''
  return `  <url>\n    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>${lastmod}\n    <changefreq>${options.changefreq}</changefreq>\n    <priority>${options.priority}</priority>\n  </url>`
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

await writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap, 'utf8')
console.log(`Sitemap generated: ${routes.size} URLs`)
