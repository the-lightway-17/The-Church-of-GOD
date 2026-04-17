import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Poll from "@/lib/models/poll"
import { awardPoints } from "@/lib/gamification"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"

    // Build query
    const query: Record<string, unknown> = {}
    const now = new Date()
    if (status === "active") query.endsAt = { $gt: now }
    if (status === "ended") query.endsAt = { $lte: now }

    const skip = (page - 1) * limit

    const [polls, total] = await Promise.all([
      Poll.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name image")
        .lean(),
      Poll.countDocuments(query),
    ])

    // Calculate if polls are active
    const pollsWithStatus = polls.map((poll) => ({
      ...poll,
      isActive: new Date(poll.endsAt) > now,
    }))

    return NextResponse.json({
      polls: pollsWithStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching polls:", error)
    return NextResponse.json(
      { error: "Failed to fetch polls" },
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
    const { question, description, category, options, duration } = body

    if (!question || !category || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Question, category, and at least 2 options are required" },
        { status: 400 }
      )
    }

    // Calculate end date
    const durationDays = parseInt(duration) || 7
    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + durationDays)

    // Create poll
    const poll = await Poll.create({
      question,
      description: description || "",
      category,
      author: session.user.id,
      options: options.map((text: string) => ({
        text,
        votes: 0,
        voters: [],
      })),
      endsAt,
    })

    // Award points for creating a poll
    await awardPoints(session.user.id, "createPoll")

    return NextResponse.json({ poll }, { status: 201 })
  } catch (error) {
    console.error("Error creating poll:", error)
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    )
  }
}
