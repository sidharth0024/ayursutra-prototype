 import { createClient } from '@supabase/supabase-js'
 const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
 const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 export const supabase = createClient(supabaseUrl, supabaseAnonKey)
 // Auth helpers
 export const signUp = async (email: string, password: string) =&gt; {
 const { data, error } = await supabase.auth.signUp({
 email,
 password,
 })
 return { data, error }
 }
 export const signIn = async (email: string, password: string) =&gt; {
 const { data, error } = await supabase.auth.signInWithPassword({
 email,
 password,
 })
 return { data, error }
 }
 export const signOut = async () =&gt; {
 const { error } = await supabase.auth.signOut()
 return { error }
 }
 export const getCurrentUser = async () =&gt; {
 const { data: { user } } = await supabase.auth.getUser()
 return user
 }
 export const onAuthStateChange = (callback: (user: any) =&gt; void) =&gt; {
 return supabase.auth.onAuthStateChange((event, session) =&gt; {
 callback(session?.user || null)
 })
 }
