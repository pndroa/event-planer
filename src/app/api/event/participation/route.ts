import { createClientForServer } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/client'

export async function POST(req: NextRequest) {
  const { eventId } = await req.json()
  const supabase = await createClientForServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Ersteller-Schutz!
  const event = await prisma.events.findUnique({
    where: { eventId },
    include: { users: true },
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  if (event.users.userId === user.id) {
    return NextResponse.json({ error: 'Organizer cannot join own event' }, { status: 403 })
  }
  // Ersteller-Schutz!

  try {
    const existing = await prisma.eventParticipation.findFirst({
      where: {
        participantId: user.id,
        eventId,
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already joined' }, { status: 409 })
    }

    await prisma.eventParticipation.create({
      data: {
        participantId: user.id,
        eventId,
      },
    })

    return NextResponse.json({ joined: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')
  const supabase = await createClientForServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
  }

  try {
    const existing = await prisma.eventParticipation.findFirst({
      where: {
        participantId: user.id,
        eventId,
      },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Not joined yet' }, { status: 404 })
    }

    const questions = await prisma.surveyQuestions.findMany({
      where: {
        surveys: { eventId },
      },
      select: { questionId: true },
    })

    const questionIds = questions.map((q) => q.questionId)

    await prisma.surveyAnswers.deleteMany({
      where: {
        userId: user.id,
        questionId: { in: questionIds },
      },
    })

    await prisma.eventParticipation.delete({
      where: {
        // eslint-disable-next-line camelcase
        participantId_eventId: {
          participantId: user.id,
          eventId,
        },
      },
    })

    return NextResponse.json({ joined: false }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
