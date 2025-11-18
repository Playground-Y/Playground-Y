# Parser Rewrite Testing Checklist

## Overview
This document outlines the testing steps to verify the parser rewrite using `@apidevtools/swagger-parser` works correctly.

## Prerequisites
- Node.js installed (for dereference-spec.js)
- Python 3.7+ installed
- `@apidevtools/swagger-parser` installed in the generated playground

## Test 1: Basic Generation & Dereferencing ✅
**Goal**: Verify the generator successfully dereferences specs

**Steps**:
1. Run generator on existing spec:
   ```bash
   python generate.py examples/coingecko-spec.json test-output
   ```

2. Check output for dereferencing message:
   - Should see: `✓ Spec dereferenced using @apidevtools/swagger-parser`

3. Verify generated `openapi.json`:
   - Open `test-output/openapi.json`
   - Search for `$ref` - should find **ZERO** occurrences
   - All schema references should be inlined

**Expected Result**: Spec is fully dereferenced, no `$ref` keywords remain

---

## Test 2: Form Generation ✅
**Goal**: Verify forms still generate correctly with dereferenced specs

**Steps**:
1. Start the generated playground:
   ```bash
   cd test-output
   pnpm install
   pnpm dev
   ```

2. Navigate to an endpoint with form fields

3. Verify:
   - Form fields appear correctly
   - Field types are correct (string, number, boolean, etc.)
   - Required fields are marked
   - Enums show as dropdowns
   - Nested objects render correctly
   - Arrays render correctly

**Expected Result**: Forms work identically to before the rewrite

---

## Test 3: Code Sample Generation ✅
**Goal**: Verify code samples generate correctly

**Steps**:
1. In the playground, view code samples for an endpoint

2. Verify:
   - Python code samples are correct
   - JavaScript/TypeScript code samples are correct
   - cURL commands are correct
   - Request bodies are properly formatted
   - Headers are included correctly

**Expected Result**: Code samples match expected format

---

## Test 4: Complex Schema Features ✅
**Goal**: Test edge cases that the parser should handle

### 4a. allOf Merging
**Test**: Spec with `allOf` should have schemas merged
- Check that properties from all `allOf` items are present
- No `allOf` keyword should remain in dereferenced spec

### 4b. anyOf/oneOf Variants
**Test**: Spec with `anyOf` or `oneOf` should pick a representative variant
- Form should show fields from one variant
- Should not crash or show errors

### 4c. Discriminators
**Test**: Spec with discriminator-based `anyOf` should preserve discriminator info
- Check that `_discriminator` and `_allVariants` are preserved in normalized schema

### 4d. Nested $refs
**Test**: Spec with deeply nested `$ref` chains
- All nested refs should be resolved
- No circular reference errors

---

## Test 5: External $ref Files
**Goal**: Verify external file references are resolved

**Steps**:
1. Create a test spec with external `$ref`:
   ```yaml
   components:
     schemas:
       User:
         $ref: './schemas/user.yaml'
   ```

2. Run generator

3. Verify:
   - External file is loaded
   - Content is inlined in generated `openapi.json`
   - No file path references remain

**Expected Result**: External refs are resolved and inlined

---

## Test 6: Circular References
**Goal**: Verify circular refs are handled gracefully

**Steps**:
1. Create a spec with circular references (if possible)

2. Run generator

3. Verify:
   - Generator doesn't crash
   - Circular refs are handled by swagger-parser (it should inline with circular markers)

**Expected Result**: No infinite loops or crashes

---

## Test 7: Runtime Parser Usage
**Goal**: Verify the runtime parser (openapi-parser.tsx) works with dereferenced specs

**Steps**:
1. In the playground, navigate between endpoints

2. Check browser console for errors

3. Verify:
   - No errors about unresolved `$ref`
   - Forms load correctly
   - No schema resolution errors

**Expected Result**: Runtime parser works smoothly with dereferenced specs

---

## Test 8: Regeneration
**Goal**: Verify regenerating doesn't break existing playgrounds

**Steps**:
1. Generate a playground
2. Make changes to source spec
3. Regenerate:
   ```bash
   python generate.py examples/coingecko-spec.json test-output
   ```

4. Verify:
   - Existing playground still works
   - New changes are reflected
   - No broken references

**Expected Result**: Regeneration works smoothly

---

## Test 9: Package Dependencies
**Goal**: Verify `@apidevtools/swagger-parser` is included

**Steps**:
1. Check generated `package.json`:
   ```bash
   cat test-output/package.json | grep swagger-parser
   ```

2. Verify dependency is present:
   ```json
   "@apidevtools/swagger-parser": "^10.1.0"
   ```

**Expected Result**: Dependency is included in generated package.json

---

## Test 10: Error Handling
**Goal**: Verify graceful error handling

**Steps**:
1. Test with invalid spec (missing required fields)

2. Test with Node.js not installed (should show warning)

3. Test with malformed JSON

**Expected Result**: 
- Errors are caught and logged
- Generator continues or fails gracefully
- User sees helpful error messages

---

## Quick Verification Script

Run this to quickly verify the rewrite:

```bash
#!/bin/bash

echo "🧪 Testing Parser Rewrite..."

# Test 1: Generate playground
echo "1. Generating playground..."
python generate.py examples/coingecko-spec.json test-output

# Test 2: Check for $ref in generated spec
echo "2. Checking for unresolved \$ref..."
REF_COUNT=$(grep -c "\$ref" test-output/openapi.json || echo "0")
if [ "$REF_COUNT" -eq "0" ]; then
  echo "   ✅ No \$ref found - spec is dereferenced"
else
  echo "   ❌ Found $REF_COUNT \$ref - spec may not be fully dereferenced"
fi

# Test 3: Check package.json for dependency
echo "3. Checking package.json..."
if grep -q "@apidevtools/swagger-parser" test-output/package.json; then
  echo "   ✅ swagger-parser dependency found"
else
  echo "   ❌ swagger-parser dependency missing"
fi

# Test 4: Check for dereferencing message in output
echo "4. Checking generator output..."
if python generate.py examples/coingecko-spec.json test-output 2>&1 | grep -q "Spec dereferenced"; then
  echo "   ✅ Dereferencing message found"
else
  echo "   ⚠️  Dereferencing message not found (may still work)"
fi

echo ""
echo "✅ Basic tests complete!"
echo "Next: Start the playground and test manually:"
echo "  cd test-output && pnpm install && pnpm dev"
```

---

## Manual Testing Checklist

After running the generator, manually test:

- [ ] Playground starts without errors
- [ ] All endpoints load correctly
- [ ] Forms render with correct fields
- [ ] Form validation works
- [ ] Code samples generate correctly
- [ ] API calls work end-to-end
- [ ] Navigation between endpoints works
- [ ] No console errors in browser
- [ ] No TypeScript errors in terminal

---

## Known Issues to Watch For

1. **Schema normalization**: Some complex schemas might need additional normalization
2. **Discriminator handling**: Ensure discriminator info is preserved
3. **Performance**: Large specs might take longer to dereference
4. **Memory**: Very large specs might use more memory during dereferencing

---

## Success Criteria

✅ All tests pass
✅ No `$ref` in generated `openapi.json`
✅ Forms work correctly
✅ Code samples generate correctly
✅ No runtime errors
✅ Regeneration works


