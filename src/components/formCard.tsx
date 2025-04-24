import { CardContent, Typography, Card } from '@mui/material'
import { FC, ReactNode } from 'react'

interface FormCardProps {
  variant: string
  children?: ReactNode
}

const FormCard: FC<FormCardProps> = ({ variant, children }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          Create {variant}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}

export default FormCard
