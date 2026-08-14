import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizSessions } from '@/lib/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const age = Number(body.age)
    if (!Number.isInteger(age) || age < 1 || age > 120) {
      return NextResponse.json({ error: 'Tuổi không hợp lệ.' }, { status: 400 })
    }

    const [session] = await db.insert(quizSessions).values({
      age,
      answers: body.answers ?? {},
      primaryResult: String(body.primaryResult ?? ''),
      secondaryResult: body.secondaryResult ? String(body.secondaryResult) : null,
    }).returning({ id: quizSessions.id })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error('[v0] quiz session save failed', error)
    return NextResponse.json({ error: 'Không thể lưu kết quả lúc này.' }, { status: 500 })
  }
}
