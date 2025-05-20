'use client'
import FormCard from '@/components/formCard'
import { TextField, Grid, Box } from '@mui/material'
import Button from '@/components/button'
import { useLayoutEffect, useState, FormEvent } from 'react'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { PostWishes } from '@/lib/types'
import { useErrorBoundary } from 'react-error-boundary'
import { useUser } from '@/hooks/useUser'

interface PostResponseWishes extends PostWishes {
  wish: PostWishes & { wishCreator: string }
}

const Page = () => {
  //Constants
  const router = useRouter()
  const user = useUser()
  const { showBoundary } = useErrorBoundary()

  const [isClient, setIsClient] = useState(false)

  //Functions
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const wish = {
      wishCreator: user?.id as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
    }

    try {
      const res = await api.post<PostResponseWishes>('/wish', wish)
      if (res.status === 200) {
        router.push('/wish')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        showBoundary(error)
      }
      console.error(error)
    }
  }

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Box>Loading...</Box>
  }

  return (
    <Grid container minHeight='80vh' justifyContent='center' alignItems='center' margin='auto'>
      <Grid
        sx={{
          width: '50%',
          marginLeft: '10rem',
        }}
      >
        <FormCard title='Create Wish'>
          <Box component='form' onSubmit={handleSubmit}>
            <TextField
              label='Title'
              variant='outlined'
              margin='normal'
              name='title'
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
              <Button type='submit'>Create Wish</Button>
            </Box>
          </Box>
        </FormCard>
      </Grid>
    </Grid>
  )
}

export default Page
