import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Question from "@/lib/models/question"
import User from "@/lib/models/user"
import Group from "@/lib/models/group"
import Discussion from "@/lib/models/discussion"
import Poll from "@/lib/models/poll"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all"
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    const searchRegex = { $regex: query, $options: "i" }
    const results: Record<string, unknown[]> = {}

    // Search questions
    if (type === "all" || type === "questions") {
      const questions = await Question.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex },
        ],
      })
        .select("title content tags author voteCount answerCount createdAt")
        .populate("author", "name image")
        .sort({ voteCount: -1 })
        .limit(limit)
        .lean()
      results.questions = questions
    }

    // Search users
    if (type === "all" || type === "users") {
      const users = await User.find({
        $or: [{ name: searchRegex }, { bio: searchRegex }],
      })
        .select("name image bio points level badges")
        .sort({ points: -1 })
        .limit(limit)
        .lean()
      results.users = users
    }

    // Search groups
    if (type === "all" || type === "groups") {
      const groups = await Group.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
        ],
        isPrivate: false,
      })
        .select("name description memberCount category tags")
        .sort({ memberCount: -1 })
        .limit(limit)
        .lean()
      results.groups = groups
    }

    // Search discussions
    if (type === "all" || type === "discussions") {
      const discussions = await Discussion.find({
        $or: [{ title: searchRegex }, { content: searchRegex }],
      })
        .select("title content group replyCount createdAt")
        .populate("group", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
      results.discussions = discussions
    }

    // Search polls
    if (type === "all" || type === "polls") {
      const polls = await Poll.find({
        question: searchRegex,
      })
        .select("question category totalVotes endsAt")
        .sort({ totalVotes: -1 })
        .limit(limit)
        .lean()

      // Add isActive status
      const now = new Date()
      results.polls = polls.map((poll) => ({
        ...poll,
        isActive: new Date(poll.endsAt) > now,
      }))
    }

    return NextResponse.json({ results, query })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
