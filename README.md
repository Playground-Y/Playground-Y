# OpenAPI Playground Generator

Generate beautiful, interactive API playgrounds from OpenAPI specifications.

<table>
<tr>
<td width="50%">
<img width="100%" alt="Screenshot 2025-11-18 at 3 26 08 PM" src="https://github.com/user-attachments/assets/89cb9792-0000-4463-8f24-ef5c9dfef529" />
</td>
<td width="50%">
<img width="100%" alt="Screenshot 2025-11-18 at 3 26 27 PM" src="https://github.com/user-attachments/assets/285c9350-451f-4cfd-98cc-f70a005196cd" />
</td>
</tr>
</table>


## DEMO
https://coingecko-y.vercel.app/

## Installation

**Clone the repository:**
```bash
git clone <repository-url>
cd Playground-Y
```

**Prerequisites:**
- Python 3.7+ (required for the generator script)
- Node.js 18+ (required for generated Next.js apps)
- pnpm (install with `npm install -g pnpm`)

**Install Python dependencies:**
```bash
pip install -r requirements.txt
```

Note: PyYAML is included in requirements.txt and is required for YAML OpenAPI specs (optional for JSON-only usage).

## Usage

**Create a playground:**
```bash
python generate.py <spec-path> <output-path>
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
