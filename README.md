# OpenAPI Playground Generator

Generate beautiful, interactive API playgrounds from OpenAPI specifications.

## DEMO
https://coingecko-y.vercel.app/

## Usage

**Create a playground:**
```bash
python3 generate.py <spec-path> <output-path>
```

**Run it:**
```bash
cd <output-path> && pnpm install && pnpm dev
```

## Options

- `--force` or `-f`: Force overwrite of existing output directory
- `--api-key KEY`: Pre-configure API key (stores in `.env`, hides auth field from users)
- `--theme THEME`: Set default theme (`light`, `dark`, or `coffee`)
- `--workspace-image URL|FILE`: Workspace logo/image

## Development

Auto-regenerate on changes:
```bash
node watch.js <spec-path> <output-path>
```

## License

MIT
