'use client'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { Box, Stack, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import { Wishes } from '@/lib/types'
import { useUser } from '@/hooks/useUser'
import WishCard from '@/components/WishCard'
import TopNavigation from '@/components/TopNavigation'
import { useErrorBoundary } from 'react-error-boundary'

const Page = () => {
  const [wishes, setWishes] = useState<Wishes[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'>('date')
  const user = useUser()
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    const fetchWishes = async () => {
      if (!user?.id) return
      try {
        const res = await api.get(`/myWish/${user?.id as string}`)
        setWishes(res.data)
      } catch (error) {
        console.error('Error loading wishes:', error)
        showBoundary(error)
      }
    }
    fetchWishes()
  }, [showBoundary, user])

  const filteredWishes: Wishes[] = wishes
    .filter((wish) => wish.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Box sx={{ padding: 4, maxWidth: 700, mx: 'auto' }}>
      <Box>
        <TopNavigation />
      </Box>
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
            username={wish.users.name}
            title={wish.title}
            createdAt={wish.createdAt}
            deleteButton={true}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default Page
