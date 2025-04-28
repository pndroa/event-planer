'use client'
import FormCard from '@/components/formCard'
import { Grid } from '@mui/material'
import { useParams } from 'next/navigation'

const Page = () => {
  const { id } = useParams()

  return (
    <Grid
      container
      width={1000}
      minHeight='80vh'
      justifyContent='center'
      alignItems='center'
      margin='auto'
    >
      <Grid>
        <FormCard title={`Create Survey for Event ${id}`}></FormCard>
      </Grid>
    </Grid>
  )
}

export default Page
