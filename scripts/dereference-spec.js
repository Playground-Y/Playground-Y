#!/usr/bin/env node

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * This script uses @apidevtools/swagger-parser which is licensed under Apache 2.0
 */

const SwaggerParser = require('@apidevtools/swagger-parser')
const fs = require('fs')
const path = require('path')

async function dereferenceSpec(inputPath, outputPath) {
  try {
    console.log(`Dereferencing OpenAPI spec: ${inputPath}`)
    const dereferenced = await SwaggerParser.dereference(inputPath)
    
    // Write dereferenced spec to output
    fs.writeFileSync(outputPath, JSON.stringify(dereferenced, null, 2), 'utf-8')
    console.log(`✓ Dereferenced spec written to: ${outputPath}`)
    process.exit(0)
  } catch (error) {
    console.error(`Error dereferencing spec: ${error.message}`)
    process.exit(1)
  }
}

// Get input and output paths from command line
const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.error('Usage: node dereference-spec.js <input-spec> <output-spec>')
  process.exit(1)
}

dereferenceSpec(inputPath, outputPath)

