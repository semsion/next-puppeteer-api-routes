export const dynamic = 'force-dynamic'
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get('url');
  const selector = searchParams.get('selector') || 'body'; // CSS selector to target specific elements
  const searchText = searchParams.get('text') || ''; // Text to search for within elements
  const targetEndpoint = searchParams.get('targetEndpoint'); // The API endpoint to forward data to
  let browser;

  if (!url) {
    return NextResponse.json({error: 'URL parameter is required'}, {status: 400});
  }

  try {
    browser = await puppeteer.launch({
      headless: "new",
      // Use the following args to reduce detection and improve performance
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-http2' // Disable HTTP/2 protocol
      ],
      ignoreHTTPSErrors: true
    });
    
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Add request interception
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      // Block unnecessary resources to improve performance and reduce detection
      if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // Set a timeout for navigation to handle cases where page might hang
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Wait for JavaScript to execute
    await new Promise(r => setTimeout(r, 5000));
    
    // Extract content based on selector and optional text search
    const content = await page.evaluate((sel, text) => {
      const elements = Array.from(document.querySelectorAll(sel));
      
      // If search text is provided, filter elements containing that text
      if (text) {
        const matchingElements = elements.filter(el => 
          el.textContent && el.textContent.toLowerCase().includes(text.toLowerCase())
        );
        
        // For each matching element, collect its info and siblings' child text
        return matchingElements.map(el => {
          // Get siblings
          const siblings = [];
          let sibling = el.nextElementSibling;
          while (sibling) {
            // For each sibling, get its children's text content
            const siblingChildrenText = Array.from(sibling.children).map(child => 
              ({ tag: child.tagName.toLowerCase(), text: child.textContent?.trim() })
            );
            
            siblings.push({
              tag: sibling.tagName.toLowerCase(),
              childrenText: siblingChildrenText,
              html: sibling.outerHTML
            });
            
            sibling = sibling.nextElementSibling;
          }
          
          return JSON.stringify({
            element: el.outerHTML,
            siblings: siblings
          });
        }).join('\n');
      }
      
      // Same for non-text search case
      return elements.map(el => {
        const siblings = [];
        let sibling = el.nextElementSibling;
        while (sibling) {
          const siblingChildrenText = Array.from(sibling.children).map(child => 
            ({ tag: child.tagName.toLowerCase(), text: child.textContent?.trim() })
          );
          
          siblings.push({
            tag: sibling.tagName.toLowerCase(),
            childrenText: siblingChildrenText,
            html: sibling.outerHTML
          });
          
          sibling = sibling.nextElementSibling;
        }
        
        return JSON.stringify({
          element: el.outerHTML,
          siblings: siblings
        });
      }).join('\n');
    }, selector, searchText);
    
    // If targetEndpoint is provided, forward the scraped data
    if (targetEndpoint) {
      try {
        const response = await fetch(targetEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scrapedContent: content, sourceUrl: url }),
        });
        
        const apiResponse = await response.json();
        
        return NextResponse.json({
          scrapedContent: content,
          apiResponse
        });
      } catch (forwardError: any) {
        return NextResponse.json({
          scrapedContent: content,
          forwardError: forwardError.message
        });
      }
    }
    
    // If no targetEndpoint, just return the scraped content
    return NextResponse.json({ scrapedContent: content });
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}