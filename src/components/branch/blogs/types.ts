export const BLOGS_PAGE_SIZE = 12

export type BlogCardData = {
  id: number
  title: string
  link: string
  media: {
    src: string
    alt: string
  }
  location: string
  date?: string | null
  publishedDate?: string | null
}
