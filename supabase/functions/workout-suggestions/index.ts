import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { goals, recentWorkouts, timeAvailable } = await req.json()

    const prompt = `As a fitness coach, suggest 3 specific workouts based on:
    - Goals: ${goals || 'general fitness'}
    - Recent workouts: ${recentWorkouts?.length ? recentWorkouts.map(w => w.type).join(', ') : 'none'}
    - Time available: ${timeAvailable || 30} minutes

    Return only a JSON array of 3 workout objects with this structure:
    [
      {
        "name": "Workout Name",
        "type": "Cardio/Strength/Flexibility",
        "duration": 30,
        "exercises": ["Exercise 1", "Exercise 2", "Exercise 3"],
        "difficulty": "Beginner/Intermediate/Advanced"
      }
    ]`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a fitness coach that returns only valid JSON arrays.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`)
    }

    const result = await response.json()
    const suggestions = JSON.parse(result.choices[0].message.content)

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Workout suggestions error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})