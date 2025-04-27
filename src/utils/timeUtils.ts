export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHrs / 24)

  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHrs < 24) return `${diffHrs} hrs ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}
