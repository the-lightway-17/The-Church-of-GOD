import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Question from "@/lib/models/question"
import Answer from "@/lib/models/answer"
import User from "@/lib/models/user"
import { awardPoints, checkAndAwardBadges } from "@/lib/gamification"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const searchParams = request.nextUrl.searchParams
    const sort = searchParams.get("sort") || "votes"

    let sortQuery: Record<string, 1 | -1> = { voteCount: -1, createdAt: -1 }
    if (sort === "recent") sortQuery = { createdAt: -1 }
    if (sort === "oldest") sortQuery = { createdAt: 1 }

    const answers = await Answer.find({ question: id })
      .sort(sortQuery)
      .populate("author", "name image level points")
      .lean()

    return NextResponse.json({ answers })
  } catch (error) {
    console.error("Error fetching answers:", error)
    return NextResponse.json(
      { error: "Failed to fetch answers" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params

    const body = await request.json()
    const { content, bibleReferences } = body

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Check if question exists
    const question = await Question.findById(id)
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      )
    }

    // Create answer
    const answer = await Answer.create({
      content,
      question: id,
      author: session.user.id,
      bibleReferences: bibleReferences || [],
    })

    // Update question answer count
    await Question.findByIdAndUpdate(id, {
      $inc: { answerCount: 1 },
      isAnswered: true,
    })

    // Award points for answering
    await awardPoints(session.user.id, "answerQuestion")

    // Increment user's answer count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { answerCount: 1 },
    })

    // Check for badges
    await checkAndAwardBadges(session.user.id)

    // Populate author for response
    await answer.populate("author", "name image level")

    return NextResponse.json({ answer }, { status: 201 })
  } catch (error) {
    console.error("Error creating answer:", error)
    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    )
  }
}
