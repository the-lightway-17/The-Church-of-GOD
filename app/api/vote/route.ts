import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Question from "@/lib/models/question"
import Answer from "@/lib/models/answer"
import User from "@/lib/models/user"
import { awardPoints } from "@/lib/gamification"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { targetId, targetType, voteType } = body

    if (!targetId || !targetType || !voteType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!["question", "answer"].includes(targetType)) {
      return NextResponse.json(
        { error: "Invalid target type" },
        { status: 400 }
      )
    }

    if (!["up", "down"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type" },
        { status: 400 }
      )
    }

    const Model = targetType === "question" ? Question : Answer
    const target = await Model.findById(targetId)

    if (!target) {
      return NextResponse.json(
        { error: `${targetType} not found` },
        { status: 404 }
      )
    }

    // Check if user has already voted
    const existingUpvote = target.upvotes?.includes(session.user.id)
    const existingDownvote = target.downvotes?.includes(session.user.id)

    let voteChange = 0

    if (voteType === "up") {
      if (existingUpvote) {
        // Remove upvote
        target.upvotes = target.upvotes.filter(
          (id: string) => id.toString() !== session.user.id
        )
        voteChange = -1
      } else {
        // Add upvote, remove downvote if exists
        if (existingDownvote) {
          target.downvotes = target.downvotes.filter(
            (id: string) => id.toString() !== session.user.id
          )
          voteChange = 2 // +1 for removing downvote, +1 for adding upvote
        } else {
          voteChange = 1
        }
        target.upvotes.push(session.user.id)

        // Award points to the content author for receiving an upvote
        if (target.author.toString() !== session.user.id) {
          await awardPoints(target.author.toString(), "receiveUpvote")
        }
      }
    } else {
      if (existingDownvote) {
        // Remove downvote
        target.downvotes = target.downvotes.filter(
          (id: string) => id.toString() !== session.user.id
        )
        voteChange = 1
      } else {
        // Add downvote, remove upvote if exists
        if (existingUpvote) {
          target.upvotes = target.upvotes.filter(
            (id: string) => id.toString() !== session.user.id
          )
          voteChange = -2
        } else {
          voteChange = -1
        }
        target.downvotes.push(session.user.id)
      }
    }

    target.voteCount = (target.voteCount || 0) + voteChange
    await target.save()

    return NextResponse.json({
      voteCount: target.voteCount,
      userVote: target.upvotes?.includes(session.user.id)
        ? "up"
        : target.downvotes?.includes(session.user.id)
        ? "down"
        : null,
    })
  } catch (error) {
    console.error("Error voting:", error)
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  }
}
