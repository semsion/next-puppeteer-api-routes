# next-puppeteer-api-routes

A **Next.js** project that demonstrates using **Puppeteer** within API routes for server-side web scraping, automation, and rendering content to a web page. This setup integrates headless browser functionality into Next.js applications for dynamic content generation.


## Getting Started

First, install dependancies:

```
npm install
```

Next, run the development server:

```bash
npm run dev
```

Then you have two options.

### Pull data via the browser:

Simply go to a browser to see the output of a screenshot from any webpage via a URL such as http://localhost:3000/api/screenshot?url=https://www.bbc.co.uk, or pull the html from the front page of this appication to convert to a PDF via the URL http://localhost:3000/api/pdf 

### Pull data via the terminal:

If you have the command line utility curl intalled, proceed as follows to pull a screenshot (bash/zsh):


```
curl -O --output-dir <path_to_local_directory> http://localhost:3000/api/screenshot\?url\=https://www.bbc.co.uk
```
Note 1: where <path_to_local_directory> is specified above, replace all of this (including the angled brackets) with a local directory such as ~/Downloads.<br />
Note 2: it may take a few seconds to generate the screenshot above, or the PDF below.

The below indicates a similar method to pull html data to convert to a PDF:

```
curl -O --output-dir <path_to_local_directory> http://localhost:3000/api/pdf
```
