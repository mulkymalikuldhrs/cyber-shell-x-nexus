# CyberShellX Nexus API Documentation

## Endpoints

### AI Status
**GET** `/api/ai/status`

Returns the current status of AI APIs including fallback configuration.

**Response:**
```json
{
  "total": 4,
  "current": "Primary Gemini API",
  "available": [
    "Primary Gemini API",
    "Secondary Gemini API", 
    "Backup API 1",
    "Backup API 2"
  ]
}
```

### Command Processing
**POST** `/api/cybershell/command`

Processes cybersecurity commands with AI enhancement.

**Request:**
```json
{
  "command": "nmap -sV target.com",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "type": "command_explanation",
  "content": "Enhanced response with AI analysis",
  "category": "network_scanning",
  "difficulty": "intermediate",
  "tools": ["nmap"],
  "legal_notice": true
}
```

## API Key Fallback System

The system supports multiple Gemini API keys with automatic fallback:

1. **GOOGLE_API_KEY** - Primary API
2. **GOOGLE_API_KEY_2** - Secondary API  
3. **Backup APIs** - Hardcoded fallback keys
4. **GEMINI_API_KEY** - Alternative environment variable

If one API fails, the system automatically switches to the next available API.

## Error Handling

All endpoints include proper error handling with meaningful status codes:

- **200** - Success
- **400** - Bad Request (missing parameters)
- **500** - Internal Server Error (API failures)

Errors return JSON format:
```json
{
  "error": "Description of the error"
}
```