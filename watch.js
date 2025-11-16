#!/usr/bin/env node

/**
 * Watch script that automatically regenerates the playground when files change
 * Usage: node watch.js <openapi-file> <output-dir> [--api-key KEY] [--workspace-image URL|FILE] [--no-interactive]
 * 
 * Note: Interactive prompts only show on first run. Regenerations are silent.
 */

const { spawn } = require('child_process');
const { watch } = require('fs');
const path = require('path');

const openapiFile = process.argv[2] || 'example-spec.yaml';
const outputDir = process.argv[3] || 'example';
const pythonScript = path.join(__dirname, 'generate.py');

// Parse --api-key argument if provided
let apiKey = null;
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--api-key' && i + 1 < process.argv.length) {
    apiKey = process.argv[i + 1];
    break;
  }
}

// Parse --workspace-image argument if provided
let workspaceImage = null;
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--workspace-image' && i + 1 < process.argv.length) {
    workspaceImage = process.argv[i + 1];
    break;
  }
}

// Parse --no-interactive argument
const noInteractive = process.argv.includes('--no-interactive');

let isGenerating = false;
let regenerateTimeout = null;
let nextDevProcess = null;
let devServerStarted = false;

function regenerate() {
  return new Promise((resolve, reject) => {
    if (isGenerating) {
      console.log('⏳ Generation already in progress, queuing...');
      // Wait for current generation to complete
      const checkInterval = setInterval(() => {
        if (!isGenerating) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    isGenerating = true;
    console.log(`\n🔄 Regenerating playground from ${openapiFile}...`);
    
    const startTime = Date.now();
    const args = [pythonScript, openapiFile, outputDir, '--force'];
    if (apiKey) {
      args.push('--api-key', apiKey);
    }
    if (workspaceImage) {
      args.push('--workspace-image', workspaceImage);
    }
    if (noInteractive) {
      args.push('--no-interactive');
    }
    const python = spawn('python3', args, {
      stdio: 'inherit',
      cwd: __dirname
    });

    python.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      isGenerating = false;
      if (code === 0) {
        console.log(`✅ Regeneration complete in ${duration}s\n`);
        resolve();
      } else {
        console.error(`❌ Regeneration failed with code ${code}\n`);
        reject(new Error(`Generation failed with code ${code}`));
      }
    });

    python.on('error', (err) => {
      isGenerating = false;
      reject(err);
    });
  });
}

// Watch for changes to:
// 1. The OpenAPI spec file
// 2. The Python generator script
// 3. Template files in src/ directory

const watchPaths = [
  openapiFile,
  pythonScript,
  path.join(__dirname, 'src')
];

console.log('👀 Watching for changes...');
console.log(`   - OpenAPI spec: ${openapiFile}`);
console.log(`   - Generator: ${pythonScript}`);
console.log(`   - Templates: ${path.join(__dirname, 'src')}`);
console.log(`   - Output: ${outputDir}\n`);

// Initial generation
regenerate();

// Watch for changes
watchPaths.forEach(watchPath => {
  try {
    watch(watchPath, { recursive: true }, (eventType, filename) => {
      if (filename && !filename.includes('node_modules') && !filename.includes('.next')) {
        // Debounce rapid changes
        if (regenerateTimeout) {
          clearTimeout(regenerateTimeout);
        }
        
        regenerateTimeout = setTimeout(async () => {
          console.log(`\n📝 Detected change: ${filename}`);
          try {
            await regenerate();
          } catch (err) {
            console.error(`Error during regeneration: ${err.message}`);
          }
        }, 500); // Wait 500ms for multiple rapid changes
      }
    });
  } catch (err) {
    console.warn(`⚠️  Could not watch ${watchPath}: ${err.message}`);
  }
});

// Start Next.js dev server after initial generation completes
async function startDevServerIfNeeded() {
  if (devServerStarted) {
    return; // Already started
  }

  const codeDir = path.join(__dirname, outputDir);
  const nodeModulesPath = path.join(codeDir, 'node_modules');
  const fs = require('fs');
  
  // Wait a bit for file system to settle after regeneration
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if node_modules exists, if not, install dependencies first
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...\n');
    const install = spawn('pnpm', ['install'], {
      stdio: 'inherit',
      cwd: codeDir
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('\n🚀 Starting Next.js dev server...\n');
        startDevServer();
      } else {
        console.error(`\n❌ Failed to install dependencies (code ${code})`);
        process.exit(1);
      }
    });
  } else {
    startDevServer();
  }
  
  function startDevServer() {
    devServerStarted = true;
    nextDevProcess = spawn('pnpm', ['dev'], {
      stdio: 'inherit',
      cwd: codeDir
    });

    nextDevProcess.on('close', (code) => {
      process.exit(code);
    });
  }
}

// Wait for initial generation to complete, then start dev server
(async () => {
  try {
    await regenerate();
    await startDevServerIfNeeded();
  } catch (err) {
    console.error(`Error during initial setup: ${err.message}`);
    process.exit(1);
  }
})();

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...');
  if (nextDevProcess) {
    nextDevProcess.kill();
  }
  process.exit(0);
});
