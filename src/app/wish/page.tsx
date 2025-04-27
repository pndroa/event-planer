// app/wish/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Box, Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { api } from '@/lib/api'
import WishCard from '@/components/WishCard'
import SearchBar from '@/components/SearchBar'
import { Wishes } from '@/lib/types'
import Link from 'next/link'

export default function WishFeed() {
  const [wishes, setWishes] = useState<Wishes[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'likes'>('date')

  // Daten holen
  const fetchWishes = async () => {
    setLoading(true)
    try {
      const res = await api.get<Wishes[]>('/wish')
      setWishes(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async (wishId: string) => {
    try {
      const res = await api.post<{ upvoted: boolean; count: number }>(`/wish/${wishId}/upvote`)
      setWishes((prev) =>
        prev.map((w) =>
          w.wishId === wishId
            ? {
                ...w,
                currentUpvotes: res.data.count,
                isUpvotedByMe: res.data.upvoted,
              }
            : w
        )
      )
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    fetchWishes()
  }, [])

  const filteredWishes = wishes // filteredWishes ist ein Array von Wish-Objekten
    .filter((wish) => wish.title.toLowerCase().includes(searchTerm.toLowerCase())) // behalte nur Elemente, bei denen Funktion (wish) => ... true zurückgibt.
    .sort((a, b) =>
      sortBy === 'likes'
        ? b.currentUpvotes - a.currentUpvotes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) // .filter() und .sort(): fertige Array-Methoden => erst filtern, dann sortieren!

  if (loading) return <p>Loading wishes...</p>

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Box display='flex' gap={1.5} flexWrap='wrap' mb={3}>
        <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <FormControl size='small' sx={{ minWidth: 140 }}>
          <InputLabel id='sort-label'>Sort by</InputLabel>
          <Select
            labelId='sort-label'
            value={sortBy}
            label='Sort by'
            onChange={(e) => setSortBy(e.target.value as 'date' | 'likes')}
          >
            <MenuItem value='date'>Newest</MenuItem>
            <MenuItem value='likes'>Most liked</MenuItem>
          </Select>
        </FormControl>
        <Link href='/wish/create' passHref>
          <Button variant='contained' size='small' sx={{ height: 40 }}>
            + CREATE WISH
          </Button>
        </Link>
      </Box>

      {/* Feed */}
      <Stack spacing={2}>
        {filteredWishes.map((wish) => (
          <WishCard
            key={wish.wishId}
            wishId={wish.wishId}
            username={wish.users.name}
            title={wish.title}
            createdAt={wish.createdAt}
            isUpvoted={!!wish.isUpvotedByMe}
            onUpvote={() => handleUpvote(wish.wishId)}
            currentUpvotes={wish.currentUpvotes}
          />
        ))}
      </Stack>
    </Box>
  )
}
