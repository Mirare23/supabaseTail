// ts Ignore
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient(event)
})
