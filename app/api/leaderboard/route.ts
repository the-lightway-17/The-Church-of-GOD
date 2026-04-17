import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/user"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "all-time"
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")

    // For simplicity, we'll use total points
    // In production, you'd want to track weekly/monthly points separately
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find({})
        .select("name image points level streak badges questionCount answerCount")
        .sort({ points: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({}),
    ])

    // Add rank to users
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
    }))

    return NextResponse.json({
      users: rankedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
