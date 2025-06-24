# CyberShellX Data Storage & Cloud Integration

## Overview
CyberShellX supports multiple data storage backends for persistent data, user sessions, command history, and AI learning capabilities.

## Current Storage Backend
- **Primary**: PostgreSQL (Replit built-in)
- **ORM**: Drizzle with type-safe queries
- **Schema**: User authentication, command logs, session data

## Supabase Integration Options

### 1. Real-time Database Sync
```typescript
// Example: Sync command history to Supabase
import { supabase } from '@/lib/supabase'

export async function syncCommandHistory(commands: CommandHistory[]) {
  const { data, error } = await supabase
    .from('command_history')
    .insert(commands)
    
  if (error) throw error
  return data
}
```

### 2. User Profiles & Preferences
```sql
-- Supabase table for user preferences
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  preferences JSONB,
  ai_learning_data JSONB,
  custom_commands JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Command Analytics & Learning
```typescript
// Store AI learning data
export async function storeAILearning(sessionId: string, data: AILearningData) {
  const { error } = await supabase
    .from('ai_learning')
    .insert({
      session_id: sessionId,
      command_patterns: data.patterns,
      success_rate: data.successRate,
      user_feedback: data.feedback,
      improvement_suggestions: data.suggestions
    })
}
```

## Storage Architecture

### Local Storage (Termux/Android)
```
~/.cybershellx/
├── config.json          # User configuration
├── history.db           # Command history SQLite
├── cache/               # Temporary files
└── logs/               # Application logs
```

### Cloud Storage (Supabase)
```
Tables:
├── users                # Authentication
├── user_profiles        # Extended user data
├── command_history      # All executed commands
├── ai_learning_data     # Machine learning insights
├── custom_tools         # User-created tools
├── session_logs         # Detailed session data
└── sync_status         # Data synchronization state
```

## Data Types Stored

### 1. Command History
```typescript
interface CommandHistory {
  id: string
  userId: string
  command: string
  output: string
  timestamp: Date
  executionTime: number
  success: boolean
  tools_used: string[]
  context: {
    location: string
    device: string
    network: string
  }
}
```

### 2. AI Learning Data
```typescript
interface AILearningData {
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
  improvements: {
    suggested_optimizations: string[]
    new_tool_recommendations: string[]
  }
}
```

### 3. User Preferences
```typescript
interface UserPreferences {
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
```

## Sync Capabilities

### Real-time Synchronization
- Command history across devices
- User preferences and settings
- Custom tool configurations
- AI learning progress

### Offline-First Design
- Local SQLite for offline operations
- Background sync when connection available
- Conflict resolution for simultaneous edits
- Delta sync for efficiency

## Privacy & Security

### Data Encryption
```typescript
// Encrypt sensitive data before Supabase storage
export function encryptSensitiveData(data: any, userKey: string) {
  return encrypt(JSON.stringify(data), userKey)
}

// Store encrypted command outputs
const encryptedOutput = encryptSensitiveData(commandOutput, user.encryptionKey)
```

### Data Anonymization
```typescript
// Anonymize data for AI learning
export function anonymizeForLearning(commandHistory: CommandHistory[]) {
  return commandHistory.map(cmd => ({
    ...cmd,
    userId: hash(cmd.userId),
    output: sanitizeOutput(cmd.output),
    context: anonymizeContext(cmd.context)
  }))
}
```

## Implementation Examples

### Setup Supabase Storage
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Add to environment variables
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Server-side Supabase Integration
```typescript
// server/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Server-side key
)

export async function storeCommand(command: CommandHistory) {
  const { data, error } = await supabase
    .from('command_history')
    .insert(command)
    .select()
  
  if (error) throw error
  return data[0]
}
```

### Android App Storage
```kotlin
// Store data locally and sync to cloud
class DataManager {
    private val localDb = Room.databaseBuilder(context, AppDatabase::class.java)
    private val supabase = createSupabaseClient()
    
    suspend fun storeCommand(command: Command) {
        // Store locally first
        localDb.commandDao().insert(command)
        
        // Sync to cloud when online
        if (isOnline()) {
            supabase.from("command_history").insert(command)
        }
    }
}
```

## Migration Path

### From Local to Cloud
1. Export existing data
2. Set up Supabase project
3. Create required tables
4. Import data with user consent
5. Enable sync features

### Hybrid Approach
- Critical data: Local storage
- Learning data: Cloud storage
- User preferences: Synced
- Command history: Configurable

## Benefits of Cloud Storage

### For Users
- Cross-device synchronization
- Data backup and recovery
- Collaborative features
- AI improvements from anonymized data

### For Development
- Usage analytics
- Performance monitoring
- Feature usage statistics
- Bug reporting data

## Data Retention Policies

### User Control
```typescript
interface DataRetentionSettings {
  command_history_days: number // Default: 90
  ai_learning_data: boolean    // Default: true (anonymized)
  performance_data: boolean    // Default: true
  crash_reports: boolean       // Default: true
  auto_delete_old: boolean     // Default: true
}
```

### Compliance
- GDPR-compliant data handling
- User data export capabilities
- Right to deletion
- Transparent data usage