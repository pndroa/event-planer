'use client'

import { useEffect, useState } from 'react'
import { Box, Stack, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { api } from '@/lib/api'
import WishCard from '@/components/WishCard'
import SearchBar from '@/components/SearchBar'
import { Wishes } from '@/lib/types'
import Link from 'next/link'

export default function WishFeed() {
  const [wishes, setWishes] = useState<Wishes[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'>('date')

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await api.get('/wish')
        setWishes(res.data)
      } catch (error) {
        console.error('Error loading wishes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishes()
  }, [])

  const filteredWishes: Wishes[] = wishes // array of wish-objects
    .filter((wish) => wish.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (loading) return <p>Loading wishes...</p>

  return (
    <Box sx={{ padding: 4, maxWidth: 700, mx: 'auto' }}>
      {/* Top Controls */}
      <Box
        display='flex'
        flexWrap='wrap'
        alignItems='center'
        justifyContent='space-between'
        gap={1.5}
        mb={3}
      >
        <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <FormControl size='small' sx={{ minWidth: 140 }}>
          <InputLabel id='sort-label'>Sort by</InputLabel>
          <Select
            labelId='sort-label'
            value={sortBy}
            label='Sort by'
            onChange={(e) => setSortBy(e.target.value as 'date')}
          >
            <MenuItem value='date'>Newest</MenuItem>
          </Select>
        </FormControl>
        <Link href='/wish/create' style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button variant='contained' size='small' sx={{ height: '40px' }}>
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
          />
        ))}
      </Stack>
    </Box>
  )
}