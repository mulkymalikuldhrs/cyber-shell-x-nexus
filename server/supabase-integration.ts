import { createClient } from '@supabase/supabase-js'

// Supabase client for server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for server operations
)

// Data types for Supabase integration
export interface CommandHistory {
  id?: string
  user_id: string
  command: string
  output: string
  timestamp: string
  execution_time: number
  success: boolean
  tools_used: string[]
  context: {
    location?: string
    device?: string
    network?: string
  }
}

export interface UserProfile {
  id: string
  username: string
  preferences: {
    ui_theme: 'dark' | 'light' | 'cyberpunk'
    voice_settings: {
      wake_word: string
      voice_speed: number
      language: string
    }
    security_level: 'paranoid' | 'high' | 'medium' | 'low'
    auto_sync: boolean
    preferred_tools: string[]
    custom_aliases: Record<string, string>
  }
  ai_learning_data: {
    patterns: {
      frequent_commands: string[]
      success_patterns: object
      failure_patterns: object
      user_preferences: object
    }
    performance: {
      avg_response_time: number
      success_rate: number
      user_satisfaction: number
    }
  }
  created_at?: string
  updated_at?: string
}

// Command history operations
export class SupabaseCommandService {
  async storeCommand(command: CommandHistory): Promise<CommandHistory> {
    const { data, error } = await supabase
      .from('command_history')
      .insert(command)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async getCommandHistory(userId: string, limit = 100): Promise<CommandHistory[]> {
    const { data, error } = await supabase
      .from('command_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  }
  
  async getCommandAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('command_history')
      .select('command, success, execution_time')
      .eq('user_id', userId)
    
    if (error) throw error
    
    // Calculate analytics
    const totalCommands = data.length
    const successRate = data.filter(cmd => cmd.success).length / totalCommands
    const avgExecutionTime = data.reduce((sum: number, cmd: any) => sum + cmd.execution_time, 0) / totalCommands
    const mostUsedCommands = this.calculateCommandFrequency(data.map((cmd: any) => cmd.command))
    
    return {
      totalCommands,
      successRate,
      avgExecutionTime,
      mostUsedCommands
    }
  }
  
  private calculateCommandFrequency(commands: string[]) {
    const frequency: Record<string, number> = {}
    commands.forEach((cmd: string) => {
      const baseCommand = cmd.split(' ')[0]
      frequency[baseCommand] = (frequency[baseCommand] || 0) + 1
    })
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([command, count]) => ({ command, count }))
  }
}

// User profile operations
export class SupabaseUserService {
  async createUserProfile(profile: UserProfile): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // No rows found
      throw error
    }
    
    return data
  }
  
  async updateUserPreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ preferences })
      .eq('id', userId)
    
    if (error) throw error
  }
  
  async updateAILearningData(userId: string, learningData: Partial<UserProfile['ai_learning_data']>): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ ai_learning_data: learningData })
      .eq('id', userId)
    
    if (error) throw error
  }
}

// Real-time subscriptions
export class SupabaseRealtimeService {
  subscribeToCommandHistory(userId: string, callback: (command: CommandHistory) => void) {
    return supabase
      .channel('command_history_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'command_history',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => callback(payload.new as CommandHistory)
      )
      .subscribe()
  }
  
  subscribeToUserProfile(userId: string, callback: (profile: UserProfile) => void) {
    return supabase
      .channel('user_profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`
        },
        (payload: any) => callback(payload.new as UserProfile)
      )
      .subscribe()
  }
}

// Data synchronization utilities
export class SupabaseSyncService {
  async syncLocalToCloud(localData: CommandHistory[]): Promise<void> {
    const { error } = await supabase
      .from('command_history')
      .upsert(localData, { onConflict: 'id' })
    
    if (error) throw error
  }
  
  async getCloudChanges(userId: string, lastSyncTimestamp: string): Promise<CommandHistory[]> {
    const { data, error } = await supabase
      .from('command_history')
      .select('*')
      .eq('user_id', userId)
      .gt('timestamp', lastSyncTimestamp)
      .order('timestamp', { ascending: true })
    
    if (error) throw error
    return data || []
  }
  
  async markSyncComplete(userId: string): Promise<void> {
    const { error } = await supabase
      .from('sync_status')
      .upsert({
        user_id: userId,
        last_sync: new Date().toISOString()
      })
    
    if (error) throw error
  }
}

// Initialize services
export const commandService = new SupabaseCommandService()
export const userService = new SupabaseUserService()
export const realtimeService = new SupabaseRealtimeService()
export const syncService = new SupabaseSyncService()

// Database schema setup SQL
export const SUPABASE_SCHEMA = `
-- Command history table
CREATE TABLE IF NOT EXISTS command_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  output TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  execution_time INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT FALSE,
  tools_used TEXT[] DEFAULT '{}',
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  preferences JSONB DEFAULT '{}',
  ai_learning_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync status table
CREATE TABLE IF NOT EXISTS sync_status (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  last_sync TIMESTAMPTZ DEFAULT NOW(),
  sync_version INTEGER DEFAULT 1
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_command_history_user_id ON command_history(user_id);
CREATE INDEX IF NOT EXISTS idx_command_history_timestamp ON command_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Row Level Security
ALTER TABLE command_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own command history" 
ON command_history FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own profile" 
ON user_profiles FOR ALL 
USING (auth.uid() = id);

CREATE POLICY "Users can only access their own sync status" 
ON sync_status FOR ALL 
USING (auth.uid() = user_id);
`;
