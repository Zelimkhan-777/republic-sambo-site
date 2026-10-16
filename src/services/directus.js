import { createDirectus, readItems, readSingleton, rest } from '@directus/sdk'
import { fallback } from '../data/fallback.js'

const baseUrl = import.meta.env.VITE_DIRECTUS_URL?.replace(/\/$/, '')
const client = baseUrl ? createDirectus(baseUrl).with(rest()) : null

export function assetUrl(file, fallbackUrl = '') {
  if (!file) return fallbackUrl
  if (typeof file === 'string' && (file.startsWith('/') || file.startsWith('http'))) return file
  const id = typeof file === 'string' ? file : file.id
  return id && baseUrl ? `${baseUrl}/assets/${id}` : fallbackUrl
}

export async function loadHomePage() {
  if (!client) return fallback

  try {
    const [about, contacts, leadership, news, documents, gallery] = await Promise.all([
      client.request(readSingleton('about')),
      client.request(readSingleton('contacts')),
      client.request(readItems('leadership', { filter: { status: { _eq: 'published' } }, sort: ['sort', 'name'] })),
      client.request(readItems('news', { filter: { status: { _eq: 'published' } }, sort: ['-published_at'], limit: 3, fields: ['id', 'slug', 'category', 'title', 'published_at', 'cover'] })),
      client.request(readItems('documents', { filter: { status: { _eq: 'published' } }, sort: ['sort', '-date'], limit: 20, fields: ['id', 'title', 'description', 'category', 'file'] })),
      client.request(readItems('gallery', { filter: { status: { _eq: 'published' } }, sort: ['sort', '-date'], limit: 8, fields: ['id', 'image', 'alt'] })),
    ])

    return {
      about: about || fallback.about,
      contacts: contacts || fallback.contacts,
      leadership,
      news: news.length ? news : fallback.news,
      documents: documents.length ? documents : fallback.documents,
      gallery: gallery.length ? gallery : fallback.gallery,
    }
  } catch (error) {
    console.warn('Directus недоступен, показаны демонстрационные данные.', error)
    return fallback
  }
}

export async function loadNewsArticle(slug) {
  if (!client) return fallback.news.find((item) => item.slug === slug) || null
  const items = await client.request(readItems('news', { filter: { slug: { _eq: slug }, status: { _eq: 'published' } }, limit: 1 }))
  return items[0] || null
}

export async function loadNewsPage(page = 1, limit = 6) {
  const safePage = Math.max(1, Number(page) || 1)

  if (!baseUrl) {
    const start = (safePage - 1) * limit
    return { items: fallback.news.slice(start, start + limit), total: fallback.news.length }
  }

  try {
    const query = new URLSearchParams({
      'filter[status][_eq]': 'published',
      sort: '-published_at',
      limit: String(limit),
      page: String(safePage),
      meta: 'filter_count',
      fields: 'id,slug,category,title,published_at,cover',
    })
    const response = await fetch(`${baseUrl}/items/news?${query}`)
    if (!response.ok) throw new Error(`Directus: ${response.status}`)
    const result = await response.json()
    return { items: result.data || [], total: result.meta?.filter_count || 0 }
  } catch (error) {
    console.warn('Directus недоступен, показаны демонстрационные новости.', error)
    const start = (safePage - 1) * limit
    return { items: fallback.news.slice(start, start + limit), total: fallback.news.length }
  }
}

export async function loadGallery() {
  if (!client) return fallback.gallery

  try {
    const items = await client.request(readItems('gallery', {
      filter: { status: { _eq: 'published' } },
      sort: ['sort', '-date'],
      limit: 100,
      fields: ['id', 'image', 'alt'],
    }))
    return items.length ? items : fallback.gallery
  } catch (error) {
    console.warn('Directus недоступен, показана демонстрационная галерея.', error)
    return fallback.gallery
  }
}
