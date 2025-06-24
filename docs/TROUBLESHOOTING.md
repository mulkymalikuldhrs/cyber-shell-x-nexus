# Troubleshooting Guide

## Common Issues

### API Errors
**Problem**: "All Gemini APIs failed"
**Solution**: 
1. Check API key configuration in environment variables
2. Verify internet connectivity
3. Run health check: `node scripts/health-check.js`

### Database Connection Errors
**Problem**: "DATABASE_URL environment variable is required"
**Solution**:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL environment variable
3. Run: `npm run db:push` to initialize schema

### Port Already in Use
**Problem**: "EADDRINUSE: address already in use"
**Solution**:
1. Kill existing processes: `pkill -f tsx`
2. Restart the workflow
3. Use different port in development

### CLI Interface Not Working
**Problem**: Commands not responding in CLI
**Solution**:
1. Ensure `cli-interface.js` exists
2. Check Node.js installation
3. Run: `node --version` to verify

### Android Build Errors
**Problem**: APK build fails
**Solution**:
1. Check Android development environment
2. Verify `android-assistant` directory exists
3. Ensure proper permissions on build scripts

## System Health Check

Run the health check script to identify issues:
```bash
node scripts/health-check.js
```

This will verify:
- Essential files presence
- Dependencies status
- Database configuration
- API key setup

## Termux-Specific Issues

### PostgreSQL Won't Start
```bash
# Initialize if first time
pg_ctl -D $PREFIX/var/lib/postgresql initdb

# Start service
pg_ctl -D $PREFIX/var/lib/postgresql start

# Check status
pg_ctl -D $PREFIX/var/lib/postgresql status
```

### Permission Denied Errors
```bash
# Grant storage permissions
termux-setup-storage

# Fix script permissions
chmod +x run.sh
chmod +x cli-interface.js
```

### Node.js Version Issues
```bash
# Update packages
pkg update && pkg upgrade

# Reinstall Node.js
pkg install nodejs
```

## Getting Help

1. Check the health status first
2. Review logs for specific error messages
3. Ensure all prerequisites are installed
4. Try restarting the entire system

For persistent issues:
- GitHub Issues: https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/issues
- Review documentation in `/docs` folder