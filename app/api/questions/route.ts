import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Question from "@/lib/models/question"
import User from "@/lib/models/user"
import { awardPoints, checkAndAwardBadges } from "@/lib/gamification"
import { POINT_VALUES } from "@/lib/constants/points"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "recent"
    const tag = searchParams.get("tag")
    const book = searchParams.get("book")
    const status = searchParams.get("status")

    // Build query
    const query: Record<string, unknown> = {}
    if (tag) query.tags = tag
    if (book) query.bibleBook = book
    if (status === "answered") query.isAnswered = true
    if (status === "unanswered") query.isAnswered = false

    // Build sort
    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 }
    if (sort === "popular") sortQuery = { voteCount: -1, createdAt: -1 }
    if (sort === "trending") sortQuery = { viewCount: -1, createdAt: -1 }
    if (sort === "unanswered") {
      query.isAnswered = false
      sortQuery = { createdAt: -1 }
    }

    const skip = (page - 1) * limit

    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("author", "name image level")
        .lean(),
      Question.countDocuments(query),
    ])

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { title, content, tags, bibleReference, bibleBook, bibleChapter, bibleVerse } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Create question
    const question = await Question.create({
      title,
      content,
      author: session.user.id,
      tags: tags || [],
      bibleReference,
      bibleBook,
      bibleChapter,
      bibleVerse,
    })

    // Award points for asking a question
    await awardPoints(session.user.id, "askQuestion")

    // Increment user's question count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { questionCount: 1 },
    })

    // Check for badges
    await checkAndAwardBadges(session.user.id)

    return NextResponse.json({ question }, { status: 201 })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    )
  }
}
