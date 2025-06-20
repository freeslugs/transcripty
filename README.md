# Transcripty

Extract chat logs from Google Meet HTML files and convert them to text and markdown files.

## Installation

### Global Installation (Recommended)
```bash
npm install -g transcripty
```

### Local Installation
```bash
npm install transcripty
```

## Usage

### As a Global CLI Tool
```bash
transcripty <html-file-path> [options]
```

### As a Local Package
```bash
npx transcripty <html-file-path> [options]
```

## Options

- `-o, --output <path>` - Output directory or file path (without extension)
- `--txt-only` - Only generate .txt file
- `--md-only` - Only generate .md file
- `-h, --help` - Display help information
- `-V, --version` - Display version number

## Examples

### Basic Usage
Extract chat log and save as both .txt and .md files:
```bash
transcripty meet-chat.html
```
This creates `meet-chat_chat.txt` and `meet-chat_chat.md` in the same directory.

### Specify Output Path
```bash
transcripty meet-chat.html -o /path/to/output/meeting-transcript
```
This creates `meeting-transcript.txt` and `meeting-transcript.md`.

### Generate Only Text File
```bash
transcripty meet-chat.html --txt-only
```

### Generate Only Markdown File
```bash
transcripty meet-chat.html --md-only
```

### Custom Output Directory
```bash
transcripty meet-chat.html -o ./transcripts/meeting-2024-01-15
```

## How to Get Google Meet HTML

1. Join or host a Google Meet
2. Open the chat panel
3. Right-click on the chat area and select "Inspect Element"
4. In the developer tools, right-click on the HTML element containing the chat
5. Select "Copy" > "Copy outerHTML"
6. Paste the HTML into a `.html` file
7. Use transcripty to extract the chat log

## Output Formats

### Text Format (.txt)
```
Speaker Name: Message content here
Another Speaker: Another message

Speaker Name: Follow-up message
```

### Markdown Format (.md)
```markdown
# Google Meet Chat Log

**Speaker Name:** Message content here

**Another Speaker:** Another message

**Speaker Name:** Follow-up message
```

## Requirements

- Node.js 18.0.0 or higher

## Development

```bash
git clone <repository>
cd transcripty
npm install
npm start -- <html-file-path>
```

## License

ISC 