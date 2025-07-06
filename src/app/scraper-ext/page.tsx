'use client';

import { useState } from 'react';

export default function ScraperExtPage() {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<Array<{element: string, siblings: any[]}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format URL if needed
    let formattedUrl = url.trim();

    // Handle URLs without protocol
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Parse URL to check its validity
    try {
      new URL(formattedUrl);
    } catch (err) {
      setError('Please enter a valid URL');
      return;
    }
    
    if (!formattedUrl) {
      setError('Please enter a URL');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Build the query URL with optional text parameter
      let queryUrl = `/api/scrape-ext?url=${encodeURIComponent(formattedUrl)}&selector=${encodeURIComponent(selector || 'body')}`;
      
      // Add text search parameter if provided
      if (searchText) {
        queryUrl += `&text=${encodeURIComponent(searchText)}`;
      }
      
      const response = await fetch(queryUrl);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setResults([]);
      } else if (data.scrapedContent) {
        // Parse the JSON strings in the response
        const parsedResults = data.scrapedContent
          .split('\n')
          .filter(Boolean)
          .map(item => {
            try {
              return JSON.parse(item);
            } catch (e) {
              return { element: item, siblings: [] };
            }
          });
        setResults(parsedResults);
      } else {
        setResults([]);
        setError('No content found');
      }
    } catch (err) {
      setError('Failed to fetch data: ' + (err instanceof Error ? err.message : String(err)));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>URL content extraction</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div>
          <label htmlFor="url">URL:</label>
          <input
            id="url"
            className="input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com or https://example.com"
          />
        </div>
        
        <div>
          <label htmlFor="selector">CSS Selector:</label>
          <input
            id="selector"
            className="input"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="body, h1, .article-content, etc."
          />
        </div>
        
        <div>
          <label htmlFor="searchText">Text to search for (optional):</label>
          <input
            id="searchText"
            className="input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for specific text content"
          />
        </div>
        
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape Content'}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {results.length > 0 && (
        <div className="results">
          <h2>Results ({results.length})</h2>
          {results.map((result, i) => (
            <div key={i} className="resultItem">
              <h3>Element {i+1}</h3>
              <div dangerouslySetInnerHTML={{ __html: result.element }} />
              
              {result.siblings.length > 0 && (
                <div className="siblings">
                  <h4>Sibling Children Text:</h4>
                  {result.siblings.map((sibling, si) => (
                    <div key={si} className="sibling">
                      <h5>Sibling {si+1} ({sibling.tag})</h5>
                      {sibling.childrenText.length > 0 ? (
                        <ul>
                          {sibling.childrenText.map((child, ci) => (
                            <li key={ci}>
                              <strong>{child.tag}:</strong> {child.text}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No children</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}