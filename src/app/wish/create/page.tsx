'use client'
import FormCard from '@/components/formCard'
import { TextField, Grid, Box } from '@mui/material'
import Button from '@/components/button'
import React, { useLayoutEffect, useState, FormEvent } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { PostWishes } from '@/lib/types'
import { useUser } from '@/hooks/useUser'

interface PostResponseWishes extends PostWishes {
  wish: PostWishes & { wishCreator: string }
}

const Page = () => {
  //Constants
  const router = useRouter()
  const user = useUser()
  const [isClient, setIsClient] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState(true)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null

    const wish = {
      wishCreator: user?.id as string,
      title,
      description,
    }

    try {
      const res = await api.post<PostResponseWishes>('/wish', wish)
      if (res.status === 200) {
        router.push('/wish')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Box>Loading...</Box>
  }

  const checkInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)

    if (event.target.value.trim() === '') {
      setError(true)
      setDisabled(true)
    } else {
      setError(false)
      setDisabled(false)
    }
  }

  return (
    <Grid
      container
      minHeight='80vh'
      justifyContent='center'
      alignItems='center'
      px={{ xs: 2, sm: 4 }}
    >
      <Grid
        sx={{
          width: {
            xs: '90%',
            sm: '70%',
            md: '50%',
          },
          mx: 'auto',
        }}
      >
        <FormCard title='Create Wish'>
          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              label='Title'
              variant='outlined'
              margin='normal'
              name='title'
              onChange={checkInput}
              value={title}
              error={error}
              required
              fullWidth
            />
            <TextField
              label='Description'
              variant='outlined'
              margin='normal'
              name='description'
              fullWidth
              multiline
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type='submit' disabled={disabled}>
                Create Wish
              </Button>
            </Box>
          </Box>
        </FormCard>
      </Grid>
    </Grid>
  )
}

export default Page
