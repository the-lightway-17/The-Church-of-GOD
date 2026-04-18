import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { target_id, target_type, vote_type } = body

  if (!target_id || !target_type || !vote_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['question', 'answer'].includes(target_type)) {
    return NextResponse.json({ error: 'Invalid target type' }, { status: 400 })
  }

  if (!['up', 'down'].includes(vote_type)) {
    return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 })
  }

  const voteValue = vote_type === 'up' ? 1 : -1
  const targetColumn = target_type === 'question' ? 'question_id' : 'answer_id'

  // Check for existing vote
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('user_id', user.id)
    .eq(targetColumn, target_id)
    .single()

  let voteChange = 0
  let currentUserVote: 'up' | 'down' | null = null

  if (existingVote) {
    if (existingVote.vote_type === voteValue) {
      // Remove vote (toggle off)
      await supabase
        .from('votes')
        .delete()
        .eq('id', existingVote.id)
      
      voteChange = -voteValue
      currentUserVote = null
    } else {
      // Change vote direction
      await supabase
        .from('votes')
        .update({ vote_type: voteValue })
        .eq('id', existingVote.id)
      
      voteChange = voteValue * 2 // Going from -1 to +1 is a change of 2
      currentUserVote = vote_type as 'up' | 'down'
    }
  } else {
    // Create new vote
    await supabase
      .from('votes')
      .insert({
        user_id: user.id,
        [targetColumn]: target_id,
        vote_type: voteValue,
      })
    
    voteChange = voteValue
    currentUserVote = vote_type as 'up' | 'down'
  }

  // Update the target's vote count
  const targetTable = target_type === 'question' ? 'questions' : 'answers'
  
  // Get current vote count and update
  const { data: target } = await supabase
    .from(targetTable)
    .select('vote_count, user_id')
    .eq('id', target_id)
    .single()

  if (target) {
    const newVoteCount = (target.vote_count || 0) + voteChange
    
    await supabase
      .from(targetTable)
      .update({ vote_count: newVoteCount })
      .eq('id', target_id)

    // Award points to content author for upvotes
    if (voteChange > 0 && target.user_id !== user.id) {
      await supabase
        .from('profiles')
        .update({ points: supabase.sql`points + 2` })
        .eq('id', target.user_id)
    }

    return NextResponse.json({
      vote_count: newVoteCount,
      user_vote: currentUserVote,
    })
  }

  return NextResponse.json({ error: 'Target not found' }, { status: 404 })
}
