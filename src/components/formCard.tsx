import { CardContent, Typography, Card } from '@mui/material'
import { FC, ReactNode } from 'react'

interface FormCardProps {
  title: string
  children?: ReactNode
}

const FormCard: FC<FormCardProps> = ({ title, children }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}

export default FormCard
