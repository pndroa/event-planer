import prisma from '@/lib/client'
import { NextResponse } from 'next/server'
import { getServerAuth } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log(
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPPPPPPPPPPPPPPPPPPPPPPPIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII'
  )
  const { errorResponse } = await getServerAuth()
  if (errorResponse) return errorResponse

  const { id } = params

  if (!id) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })

  try {
    console.log(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx id xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    )
    console.log(id)
    const user = await prisma.users.findUnique({
      where: {
        userId: id,
      },
      select: {
        userId: true,
        name: true,
      },
    })

    console.log('user')
    console.log(user)

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
