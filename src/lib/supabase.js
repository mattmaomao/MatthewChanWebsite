import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Add them to .env.local')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function createProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()

  if (error) throw error
  return data
}

export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', Number(id))
    .select()

  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', Number(id))

  if (error) throw error
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
 
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}
 
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
 
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}