import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import DailyVerse from "@/lib/models/daily-verse"

// Fallback verses if database is empty
const fallbackVerses = [
  {
    reference: "Philippians 4:13",
    text: "I can do all this through him who gives me strength.",
    translation: "NIV",
    theme: "Strength",
    reflectionPrompt: "How has God given you strength in a challenging situation recently?",
    relatedVerses: ["Isaiah 40:31", "Psalm 28:7", "2 Corinthians 12:9"],
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
    translation: "NIV",
    theme: "Provision",
    reflectionPrompt: "In what ways has the Lord been your shepherd this week?",
    relatedVerses: ["Psalm 23:2-3", "John 10:11", "Isaiah 40:11"],
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    translation: "NIV",
    theme: "Trust",
    reflectionPrompt: "Is there an area of your life where you need to trust God more fully?",
    relatedVerses: ["Psalm 37:5", "Isaiah 26:3", "Jeremiah 29:11"],
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    translation: "NIV",
    theme: "Purpose",
    reflectionPrompt: "Can you see how God has worked something difficult for good in your life?",
    relatedVerses: ["Romans 8:29-30", "Genesis 50:20", "Jeremiah 29:11"],
  },
  {
    reference: "Joshua 1:9",
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    translation: "NIV",
    theme: "Courage",
    reflectionPrompt: "What situation requires you to be strong and courageous today?",
    relatedVerses: ["Deuteronomy 31:6", "Isaiah 41:10", "2 Timothy 1:7"],
  },
  {
    reference: "Isaiah 40:31",
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    translation: "NIV",
    theme: "Hope",
    reflectionPrompt: "How do you renew your strength in the Lord?",
    relatedVerses: ["Psalm 27:14", "Philippians 4:13", "2 Corinthians 4:16"],
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    translation: "NIV",
    theme: "Future",
    reflectionPrompt: "How does knowing God has plans for you affect how you face uncertainty?",
    relatedVerses: ["Proverbs 3:5-6", "Romans 8:28", "Psalm 37:4"],
  },
]

export async function GET() {
  try {
    await dbConnect()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Try to get today's verse from database
    let verse = await DailyVerse.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).lean()

    // If no verse for today, use a fallback based on day of year
    if (!verse) {
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      const fallbackVerse = fallbackVerses[dayOfYear % fallbackVerses.length]
      verse = {
        ...fallbackVerse,
        date: today,
        _id: `fallback-${dayOfYear}`,
      }
    }

    return NextResponse.json({ verse })
  } catch (error) {
    console.error("Error fetching daily verse:", error)
    
    // Return a fallback verse even on error
    const fallbackVerse = fallbackVerses[new Date().getDay()]
    return NextResponse.json({ verse: fallbackVerse })
  }
}
