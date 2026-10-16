const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://republic-school.sambo-chr.ru').replace(/\/$/, '')
const siteName = 'ГБУ ДО «Республиканская школа самбо»'
const defaultImage = '/assets/fsk-shali-building.jpg'

function absoluteUrl(value = '/') {
  if (/^https?:\/\//i.test(value)) return value
  return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`
}

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', url)
}

function setJsonLd(data) {
  let element = document.head.querySelector('#page-jsonld')
  if (!data) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('script')
    element.id = 'page-jsonld'
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'SportsOrganization'],
    name: siteName,
    alternateName: ['Республиканская школа самбо', 'Школа самбо в Шали'],
    url: `${siteUrl}/`,
    email: 'mailto:fskshali@mail.ru',
    telephone: '+7-963-703-75-50',
    areaServed: 'Чеченская Республика',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Шали',
      addressRegion: 'Чеченская Республика',
      addressCountry: 'RU',
    },
    location: {
      '@type': 'Place',
      name: 'ФСК Шали',
    },
  }
}

export function applySeo({
  title,
  description,
  path = '/',
  image = defaultImage,
  type = 'website',
  robots = 'index, follow, max-image-preview:large',
  jsonLd = null,
} = {}) {
  const canonical = absoluteUrl(path)
  const shareImage = absoluteUrl(image || defaultImage)

  document.title = title || siteName
  setMeta('meta[name="description"]', { name: 'description', content: description || '' })
  setMeta('meta[name="robots"]', { name: 'robots', content: robots })
  setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'ru_RU' })
  setMeta('meta[property="og:type"]', { property: 'og:type', content: type })
  setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName })
  setMeta('meta[property="og:title"]', { property: 'og:title', content: title || siteName })
  setMeta('meta[property="og:description"]', { property: 'og:description', content: description || '' })
  setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  setMeta('meta[property="og:image"]', { property: 'og:image', content: shareImage })
  setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  setCanonical(canonical)
  setJsonLd(jsonLd)
}

export function seoFromRoute(route) {
  const seo = route.meta?.seo || {}
  applySeo({
    ...seo,
    path: route.path,
    jsonLd: seo.schema === 'organization' ? organizationSchema() : null,
  })
}

export function plainText(html = '') {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html
  return (wrapper.textContent || '').replace(/\s+/g, ' ').trim()
}

export function conciseDescription(value, fallback, maxLength = 155) {
  const text = plainText(value) || fallback
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd().replace(/[.,;:!?-]+$/, '')}…`
}

export { absoluteUrl, siteName, siteUrl }
