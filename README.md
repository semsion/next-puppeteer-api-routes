# next-puppeteer-api-routes

A **Next.js** project that demonstrates using **Puppeteer** within API routes for server-side web scraping, automation, and rendering content to a web page. This setup integrates headless browser functionality inside of a Next.js application for dynamic content generation.

## Features

- **Advanced Web Scraping**: Extract specific content from webpages using CSS selectors and text search
- **Screenshot API**: Capture screenshots of any webpage
- **PDF Generation**: Convert HTML to PDF documents

## Getting Started

First, install dependencies:

```
npm install
```

Next, run the development server:

```bash
npm run dev
```

## Web Scraping Features

The advanced web scraping functionality (`/scraper-ext`) provides:

- **CSS Selector Targeting**: Extract specific elements from webpages
- **Text Search**: Filter elements containing specific text
- **Sibling Analysis**: Extract content from elements that follow your target elements
- **Interactive UI**: User-friendly interface for configuring scraping parameters

To use the scraping UI:
1. Navigate to `http://localhost:3000/scraper-ext`
2. Enter the URL you want to scrape
3. Specify a CSS selector (e.g., `h1`, `.article-content`, `#main`)
4. Optionally enter text to search for within those elements
5. View the extracted content with HTML formatting

## Usage Options

### 1. Pull data via the browser:

Access the following endpoints in your browser:

- **Web Scraping UI**: `http://localhost:3000/scraper-ext` - Interactive UI for extracting content from websites
- **Screenshots**: `http://localhost:3000/api/screenshot?url=https://www.bbc.co.uk`
- **PDF Generation**: `http://localhost:3000/api/pdf`

### 2. Pull data via the terminal:

If you have the command line utility curl installed, proceed as follows:

#### For web scraping:

```
curl "http://localhost:3000/api/scrape-ext?url=https://example.com&selector=h1&text=Example"
```

#### For screenshots:

```
curl -O --output-dir <path_to_local_directory> http://localhost:3000/api/screenshot\?url\=https://www.bbc.co.uk
```

#### For PDF generation:

```
curl -O --output-dir <path_to_local_directory> http://localhost:3000/api/pdf
```

**Notes:**
1. Replace `<path_to_local_directory>` with a local directory such as `~/Downloads`
2. It may take a few seconds to generate screenshots or PDFs
3. The PDF example pulls HTML from the Next.js default page at http://localhost:3000

