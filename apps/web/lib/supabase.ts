import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * 获取Supabase客户端实例
 * 
 * @returns Supabase客户端
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL 或 SUPABASE_ANON_KEY 环境变量未设置')
  }

  return createClient(supabaseUrl, supabaseKey)
}

/**
 * 获取Supabase客户端实例（使用service_role密钥，具有更高权限）
 * 
 * @returns Supabase Admin客户端
 */
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL 或 SUPABASE_SERVICE_KEY 环境变量未设置')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// 延迟加载的单例实例
let supabaseClient: SupabaseClient | null = null

/**
 * 获取Supabase客户端的单例实例
 * 
 * @returns Supabase客户端
 */
export function getVectorStoreClient() {
  if (!supabaseClient) {
    // 显式声明变量类型以解决类型不匹配问题
    supabaseClient = getSupabaseClient() as ReturnType<typeof getSupabaseClient>
  }
  return supabaseClient
}