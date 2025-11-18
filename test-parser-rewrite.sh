#!/bin/bash

echo "🧪 Testing Parser Rewrite..."
echo ""

# Detect Python command
if command -v python3 &> /dev/null; then
  PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
  PYTHON_CMD="python"
else
  echo "❌ Error: Python not found. Please install Python 3.7+"
  exit 1
fi

echo "Using Python: $PYTHON_CMD"
echo ""

# Test 1: Generate playground
echo "1. Generating playground..."
$PYTHON_CMD generate.py examples/coingecko-spec.json test-parser-output --no-interactive 2>&1 | tee /tmp/generate-output.log

# Test 2: Check for $ref in generated spec
echo ""
echo "2. Checking for unresolved \$ref in generated openapi.json..."
if [ -f "test-parser-output/openapi.json" ]; then
  REF_COUNT=$(grep -c "\$ref" test-parser-output/openapi.json 2>/dev/null)
  # Handle case where grep returns nothing (exit code 1 when no matches)
  if [ -z "$REF_COUNT" ]; then
    REF_COUNT=0
  fi
  # Remove any whitespace/newlines from count
  REF_COUNT=$(echo "$REF_COUNT" | tr -d '[:space:]')
  if [ "$REF_COUNT" = "0" ]; then
    echo "   ✅ No \$ref found - spec is fully dereferenced"
  else
    echo "   ❌ Found $REF_COUNT \$ref - spec may not be fully dereferenced"
    echo "   First few \$ref occurrences:"
    grep -n "\$ref" test-parser-output/openapi.json | head -5
  fi
else
  echo "   ❌ Generated openapi.json not found"
fi

# Test 3: Check package.json for dependency
echo ""
echo "3. Checking package.json for @apidevtools/swagger-parser..."
if [ -f "test-parser-output/package.json" ]; then
  if grep -q "@apidevtools/swagger-parser" test-parser-output/package.json; then
    echo "   ✅ swagger-parser dependency found"
    grep "@apidevtools/swagger-parser" test-parser-output/package.json
  else
    echo "   ❌ swagger-parser dependency missing"
  fi
else
  echo "   ❌ Generated package.json not found"
fi

# Test 4: Check for dereferencing message in output
echo ""
echo "4. Checking generator output for dereferencing message..."
if grep -q "Spec dereferenced" /tmp/generate-output.log; then
  echo "   ✅ Dereferencing message found"
else
  echo "   ⚠️  Dereferencing message not found"
  echo "   Checking for warnings..."
  grep -i "dereference\|swagger-parser" /tmp/generate-output.log || echo "   No dereferencing-related messages found"
fi

# Test 5: Check if Node.js script exists
echo ""
echo "5. Checking dereference-spec.js script..."
if [ -f "dereference-spec.js" ]; then
  echo "   ✅ dereference-spec.js found"
  if [ -x "dereference-spec.js" ]; then
    echo "   ✅ Script is executable"
  else
    echo "   ⚠️  Script is not executable (run: chmod +x dereference-spec.js)"
  fi
else
  echo "   ❌ dereference-spec.js not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Basic tests complete!"
echo ""
echo "Next steps:"
echo "  1. Review the output above"
echo "  2. If all checks pass, start the playground:"
echo "     cd test-parser-output && pnpm install && pnpm dev"
echo "  3. Manually test forms, code samples, and API calls"
echo ""
echo "To clean up test output:"
echo "  rm -rf test-parser-output"

