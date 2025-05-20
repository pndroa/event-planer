'use client'
import { useEffect, useState } from 'react'
import {
  Box,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { api } from '@/lib/api'
import WishCard from '@/components/WishCard'
import SearchBar from '@/components/SearchBar'
import { Wishes } from '@/lib/types'
import Link from 'next/link'
import { fetchUser } from '@/lib/user'
import { useRouter } from 'next/navigation'

export default function WishFeed() {
  const [wishes, setWishes] = useState<Wishes[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'likes'>('date')
  const [onlyMine, setOnlyMine] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const fetchWishes = async () => {
    try {
      const user = await fetchUser()
      setUserId(user?.id ?? null)

      const res = await api.get<Wishes[]>('/wish')
      setWishes(res.data)
    } catch (error) {
      console.log(error)
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

  const filteredWishes = wishes
    .filter((wish) => wish.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortBy === 'likes'
        ? b.currentUpvotes - a.currentUpvotes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .filter((w) => {
      if (!onlyMine) return true
      if (!userId) return false
      return w.users.userId === userId
    })

  return (
    <Box>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
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
              <MenuItem value='date'>Latest</MenuItem>
              <MenuItem value='likes'>Most liked</MenuItem>
            </Select>
          </FormControl>
          <Link href='/wish/create' passHref>
            <Button variant='contained' size='small' sx={{ height: 40 }}>
              + CREATE WISH
            </Button>
          </Link>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />}
          label='Show my created wishes'
          sx={{ marginLeft: 0, marginRight: 0 }}
        />

        {/* Feed */}
        <Stack spacing={2}>
          {filteredWishes.map((wish) => (
            <WishCard
              key={wish.wishId}
              username={wish.users.name}
              title={wish.title}
              createdAt={wish.createdAt}
              isUpvoted={!!wish.isUpvotedByMe}
              onUpvote={() => handleUpvote(wish.wishId)}
              currentUpvotes={wish.currentUpvotes}
              onClick={() => router.push(`/wish/${wish.wishId}`)} //Nur noch routing zur [wishId] page
            />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
