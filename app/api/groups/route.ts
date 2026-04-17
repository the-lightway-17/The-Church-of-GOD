import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Group from "@/lib/models/group"
import User from "@/lib/models/user"
import { awardPoints, checkAndAwardBadges } from "@/lib/gamification"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "popular"

    // Build query
    const query: Record<string, unknown> = { isPrivate: false }
    if (category && category !== "all") query.category = category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort
    let sortQuery: Record<string, 1 | -1> = { memberCount: -1 }
    if (sort === "recent") sortQuery = { createdAt: -1 }
    if (sort === "active") sortQuery = { lastActivity: -1 }

    const skip = (page - 1) * limit

    const [groups, total] = await Promise.all([
      Group.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name image")
        .lean(),
      Group.countDocuments(query),
    ])

    return NextResponse.json({
      groups,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json(
      { error: "Failed to fetch groups" },
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
    const { name, description, category, isPrivate, tags, guidelines } = body

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: "Name, description, and category are required" },
        { status: 400 }
      )
    }

    // Create group
    const group = await Group.create({
      name,
      description,
      category,
      isPrivate: isPrivate || false,
      tags: tags || [],
      guidelines: guidelines || [],
      createdBy: session.user.id,
      admins: [session.user.id],
      members: [session.user.id],
      memberCount: 1,
    })

    // Award points for creating a group
    await awardPoints(session.user.id, "createGroup")

    // Check for badges
    await checkAndAwardBadges(session.user.id)

    return NextResponse.json({ group }, { status: 201 })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    )
  }
}
