import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.buana.com.au'

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/delete-account`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}