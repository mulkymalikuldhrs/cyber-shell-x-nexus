#!/bin/bash

echo "Starting integration test..."

# Start the server in the background
echo "Starting server..."
npx tsx server/index.ts > server.log 2>&1 &
SERVER_PID=$!

# Give the server a moment to start
sleep 8

# Check if the server process is still running
if ! ps -p $SERVER_PID > /dev/null; then
  echo "🔴 Server failed to start. Check server.log for details."
  cat server.log
  exit 1
fi

echo "Server started with PID: $SERVER_PID"
echo "-------------------------------------"

# Run tests
FAILED=0

# Test 1: Check status
echo "Running Test 1: System Status"
node cli/index.js status
if [ $? -ne 0 ]; then
  echo "🔴 Test 1 Failed: Status command returned non-zero exit code."
  FAILED=$((FAILED + 1))
else
  echo "🟢 Test 1 Passed"
fi
echo "-------------------------------------"

# Test 2: Run a simple command (help)
echo "Running Test 2: Help Command"
echo "help" | node cli/index.js
if [ $? -ne 0 ]; then
  echo "🔴 Test 2 Failed: Help command returned non-zero exit code."
  FAILED=$((FAILED + 1))
else
  echo "🟢 Test 2 Passed"
fi
echo "-------------------------------------"


# Cleanup: Stop the server
echo "Stopping server..."
kill $SERVER_PID
sleep 2

# Final report
if [ $FAILED -ne 0 ]; then
  echo "🔴 Integration test failed. See errors above."
  exit 1
else
  echo "🟢 All tests passed successfully!"
  exit 0
fi
