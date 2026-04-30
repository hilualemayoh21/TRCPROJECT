import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'

export interface Resource {
  id: number
  title: string
  description: string
  category: string
  authors: string[]
  keywords: string[]
  date: string
  rating: number
  reviews: number
  verified: boolean
  image: string
}

// Global state for prototyping (persists across page navigations in current session)
const resources = ref<Resource[]>([
  { 
    id: 1, 
    title: 'The Chronicles of Axumite Kings', 
    description: 'A complete historical archive of the Axumite dynasty, translated from Ge\'ez scripts with forensic layer analysis.', 
    category: 'History', 
    authors: ['Dr. Ephrem Amare', 'Prof. Sarah Yohannes'],
    keywords: ['Axum', 'Ge\'ez', 'Monarchy', 'Heritage'],
    date: 'Jan 2023',
    rating: 5, 
    reviews: 128, 
    verified: true,
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: 'Preserving Tigrinya Linguistics', 
    description: 'Modern approaches to digitizing and preserving regional dialects and generative semantic rules for the future.', 
    category: 'Linguistics', 
    authors: ['Mulugeta Tesfay'],
    keywords: ['Language', 'Dialect', 'Digital Preservation'],
    date: 'Nov 2023',
    rating: 4.8, 
    reviews: 84, 
    verified: true,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 3, 
    title: 'Agricultural Growth Patterns', 
    description: 'Comprehensive study on multi-decade climate impact on crop yields in Tigray\'s Northern Highlands.', 
    category: 'Science', 
    authors: ['Dr. Alula Tesfay', 'Berhane Gebre'],
    keywords: ['Agriculture', 'Climate', 'Highlands'],
    date: 'Mar 2024',
    rating: 4.2, 
    reviews: 215, 
    verified: false,
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 4, 
    title: 'Irrigation Mapping 2024', 
    description: 'Institutional data providing satellite-verified water distribution maps across regional agricultural hubs.', 
    category: 'Science', 
    authors: ['Water Resources Dept'],
    keywords: ['Irrigation', 'Mapping', 'Satellite Data'],
    date: 'May 2024',
    rating: 4.5, 
    reviews: 42, 
    verified: true,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
  },
])

const downloadingId = ref<number | null>(null)

export function useResources() {
  const handleRead = (res: Resource) => {
    message.info(`Opening secure viewer for: ${res.title}`)
  }

  const handleDownload = async (res: Resource) => {
    if (downloadingId.value) return
    
    downloadingId.value = res.id
    message.loading({ content: `Securing archive for ${res.title}...`, key: 'dl', duration: 0 })
    
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const blobContent = `
        TIGRAY RESOURCES CENTER - DIGITAL ARCHIVE
        ==========================================
        RESOURCE ID: ${res.id}
        TITLE: ${res.title}
        CATEGORY: ${res.category}
        DATE: ${res.date}
        AUTHORS: ${res.authors.join(', ')}
        ==========================================
        Secure verification hash: 0x${Math.random().toString(16).slice(2, 10)}...
      `
      const blob = new Blob([blobContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${res.title.replace(/\s+/g, '_')}_Archive.txt`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      message.success({ content: 'Digital archive secured and downloaded.', key: 'dl' })
    } catch (err) {
      message.error({ content: 'Download initialization failed.', key: 'dl' })
    } finally {
      downloadingId.value = null
    }
  }

  const handleRate = (res: Resource, rating: number) => {
    const resource = resources.value.find(r => r.id === res.id)
    if (resource) {
      const totalPoints = resource.rating * resource.reviews
      resource.reviews += 1
      resource.rating = (totalPoints + rating) / resource.reviews
      message.success(`Rating of ${rating} stars saved for "${resource.title}"`)
    }
  }

  const getFilteredResources = (query: string) => {
    if (!query) return resources.value
    const q = query.toLowerCase()
    return resources.value.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q) || 
      r.category.toLowerCase().includes(q) ||
      r.date.toLowerCase().includes(q) ||
      r.authors.some(a => a.toLowerCase().includes(q)) ||
      r.keywords.some(k => k.toLowerCase().includes(q))
    )
  }

  return {
    resources,
    downloadingId,
    handleRead,
    handleDownload,
    handleRate,
    getFilteredResources
  }
}
