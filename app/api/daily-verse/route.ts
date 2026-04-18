import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Fallback verses if database is empty
const fallbackVerses = [
  {
    reference: 'Philippians 4:13',
    verse_text: 'I can do all this through him who gives me strength.',
    reflection: 'How has God given you strength in a challenging situation recently?',
  },
  {
    reference: 'Psalm 23:1',
    verse_text: 'The Lord is my shepherd, I lack nothing.',
    reflection: 'In what ways has the Lord been your shepherd this week?',
  },
  {
    reference: 'Proverbs 3:5-6',
    verse_text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    reflection: 'Is there an area of your life where you need to trust God more fully?',
  },
  {
    reference: 'Romans 8:28',
    verse_text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    reflection: 'Can you see how God has worked something difficult for good in your life?',
  },
  {
    reference: 'Joshua 1:9',
    verse_text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    reflection: 'What situation requires you to be strong and courageous today?',
  },
  {
    reference: 'Isaiah 40:31',
    verse_text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    reflection: 'How do you renew your strength in the Lord?',
  },
  {
    reference: 'Jeremiah 29:11',
    verse_text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    reflection: 'How does knowing God has plans for you affect how you face uncertainty?',
  },
]

export async function GET() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  // Try to get today's verse from database
  const { data: verse } = await supabase
    .from('daily_verses')
    .select('*')
    .eq('date', today)
    .single()

  if (verse) {
    return NextResponse.json({ verse })
  }

  // If no verse for today, use a fallback based on day of year
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const fallbackVerse = {
    ...fallbackVerses[dayOfYear % fallbackVerses.length],
    date: today,
    id: `fallback-${dayOfYear}`,
  }

  return NextResponse.json({ verse: fallbackVerse })
}
