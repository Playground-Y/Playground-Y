# Contributing to OpenAPI Playground Generator

Thank you for your interest in contributing! This guide will help you set up the development environment and understand how to make changes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.7+** - Required for the generator script
- **Node.js 18+** - Required for the watch script and generated Next.js apps
- **pnpm** - Package manager (install with `npm install -g pnpm`)
- **PyYAML** (optional) - Only needed if working with YAML OpenAPI specs
  ```bash
  pip install pyyaml
  ```

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Playground-Y
```

### 2. Understanding the Project Structure

```
.
├── generate.py          # Main generator script (Python)
├── watch.js             # Development watcher script (Node.js)
├── src/                 # Template files (source code)
│   ├── components/      # React components
│   │   ├── api-playground/  # Core playground components
│   │   └── ui/          # UI component library
│   ├── lib/             # Utilities and parsers
│   └── app/             # Next.js app directory structure
├── examples/            # Example OpenAPI specifications
└── CONTRIBUTING.md      # This file
```

### 3. Running the Development Environment

The easiest way to develop is using the `watch.js` script, which:
- Watches for changes to OpenAPI specs, generator code, and templates
- Automatically regenerates the playground when changes are detected
- Starts and manages the Next.js dev server

**Start the development environment:**

```bash
# Using an example spec
node watch.js examples/example-spec.yaml example

# Or with an API key (for automatic auth mode)
node watch.js examples/example-spec.yaml example --api-key YOUR_API_KEY
```

This will:
1. Generate the playground in `example/code/`
2. Install dependencies automatically (if needed)
3. Start the Next.js dev server on `http://localhost:3000`
4. Watch for changes and auto-regenerate

**Stop the development environment:**
Press `Ctrl+C` to stop the watcher and dev server.

## Development Workflow

### Making Changes

#### 1. Changing Template Files

Template files in `src/` are copied to generated playgrounds. To modify them:

1. Edit files in `src/` (e.g., `src/components/api-playground/sidebar.tsx`)
2. The `watch.js` script will detect the change
3. The playground will automatically regenerate
4. Next.js will hot-reload the changes in your browser

**Example:**
```bash
# Edit a component
vim src/components/api-playground/sidebar.tsx

# watch.js detects the change and regenerates
# Browser automatically refreshes with your changes
```

#### 2. Changing Generator Logic

To modify how the playground is generated:

1. Edit `generate.py`
2. The `watch.js` script will detect the change
3. The playground will regenerate with your changes

**Example:**
```bash
# Modify the generator
vim generate.py

# watch.js detects the change and regenerates
```

#### 3. Changing the Watch Script

To modify the watch script itself:

1. Edit `watch.js`
2. Restart the watch script to apply changes

**Note:** Changes to `watch.js` require a manual restart.

### Testing Your Changes

1. **Start the dev environment:**
   ```bash
   node watch.js examples/example-spec.yaml example
   ```

2. **Make your changes** to templates or generator code

3. **Verify the changes:**
   - Open `http://localhost:3000` in your browser
   - Check that your changes appear correctly
   - Test different OpenAPI specs if needed

4. **Test with different specs:**
   ```bash
   # Stop current watch (Ctrl+C)
   node watch.js examples/httpbin-spec.json httpbin-test
   ```

### Common Development Tasks

#### Adding a New Component

1. Create the component in `src/components/`
2. Add it to the template files list in `generate.py` (in `copy_template_files()`)
3. The component will be automatically included in generated playgrounds

#### Modifying UI Components

1. Edit files in `src/components/ui/` or `src/components/api-playground/`
2. Changes will automatically propagate to generated playgrounds

#### Adding Generator Features

1. Modify `generate.py` to add new functionality
2. Test with `watch.js` to see changes immediately
3. Ensure backward compatibility with existing OpenAPI specs

#### Testing with Different OpenAPI Specs

The `examples/` directory contains various OpenAPI specs for testing:

```bash
# Test with different specs
node watch.js examples/httpbin-spec.json httpbin-test
node watch.js examples/coingecko-spec.json coingecko-test
node watch.js examples/anthropic.yaml anthropic-test
```

## Project Architecture

### How It Works

1. **Generator (`generate.py`):**
   - Reads an OpenAPI specification (JSON or YAML)
   - Copies template files from `src/` to the output directory
   - Generates configuration files (package.json, tsconfig.json, etc.)
   - Creates Next.js pages and components based on the spec

2. **Watch Script (`watch.js`):**
   - Monitors `src/`, `generate.py`, and the OpenAPI spec file
   - Automatically runs the generator when changes are detected
   - Manages the Next.js dev server lifecycle

3. **Template Files (`src/`):**
   - React components and Next.js app structure
   - These are copied as-is to generated playgrounds
   - Changes here affect all future generated playgrounds

### Key Files

- **`generate.py`**: Main generation logic
  - `copy_template_files()`: Copies files from `src/` to output
  - `generate_package_json()`: Creates package.json
  - `generate_page_tsx()`: Generates Next.js pages

- **`watch.js`**: Development automation
  - File watching and change detection
  - Automatic regeneration
  - Dev server management

- **`src/components/api-playground/`**: Core playground components
  - `sidebar.tsx`: Navigation sidebar
  - `api-form.tsx`: API request form
  - `code-editor.tsx`: Code example viewer

## Code Style Guidelines

- **Python**: Follow PEP 8 style guide
- **TypeScript/React**: Use TypeScript strict mode, functional components with hooks
- **File naming**: Use kebab-case for files (e.g., `api-form.tsx`)
- **Component naming**: Use PascalCase for components
- **Function naming**: Use descriptive, intention-revealing names

## Debugging

### Generator Issues

If the generator fails:

1. Check Python version: `python3 --version` (should be 3.7+)
2. Check for YAML files: Install PyYAML if needed: `pip install pyyaml`
3. Check the error output in the terminal

### Watch Script Issues

If `watch.js` isn't detecting changes:

1. Ensure you're using Node.js 18+
2. Check file permissions
3. Try restarting the watch script

### Next.js Dev Server Issues

If the dev server fails to start:

1. Check that dependencies are installed: `cd example/code && pnpm install`
2. Check for port conflicts (default port is 3000)
3. Check the terminal output for specific errors

## Submitting Changes

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly:**
   - Test with multiple OpenAPI specs
   - Verify generated playgrounds work correctly
   - Check that existing functionality still works

4. **Commit your changes:**
   ```bash
   git commit -m "Description of your changes"
   ```

5. **Push and create a pull request**

## Getting Help

- Check the [README.md](README.md) for usage examples
- Review existing issues and pull requests
- Ask questions in discussions or issues

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

