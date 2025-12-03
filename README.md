# WebseleneceHomeAssignment!!!

A simple Node.js CLI for crawling web pages, extracting image URLs, and saving results in a JSON file.

## Features
- Crawls a URL and linked pages up to a specified depth.
- Extracts and saves image URLs with source page info.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd web-crawler
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
Run the crawler with:
   ```bash
   node crawler.js <url> <depth>
   ```
- `<url>`: Starting URL (e.g., `https://example.com`).
- `<depth>`: Crawling depth (`0` for just the starting page).

### Example
   ```bash
   node crawler.js https://books.toscrape.com 2
   ```

## Output
Results are saved in `results.json`:
   ```json
   {
     "results": [
       {
         "imageUrl": "https://example.com/image.jpg",
         "sourceUrl": "https://example.com",
         "depth": 0
       }
     ]
   }
   ```

## Notes
- Ensure the website permits crawling.
- Use responsibly to avoid overloading servers.
