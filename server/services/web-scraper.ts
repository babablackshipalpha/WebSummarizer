import { load } from 'cheerio';
import type { WebsiteData } from '@shared/schema';

export class WebScraper {
  async scrapeWebsite(url: string): Promise<WebsiteData> {
    try {
      const startTime = Date.now();
      
      // Fetch the webpage
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Audit-Bot/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const loadTime = Date.now() - startTime;
      
      const $ = load(html);

      // Extract title
      const title = $('title').text().trim() || '';

      // Extract meta description
      const metaDescription = $('meta[name="description"]').attr('content') || '';

      // Extract headings
      const headings: Array<{ level: number; text: string }> = [];
      $('h1, h2, h3, h4, h5, h6').each((_, element) => {
        const tagName = $(element).prop('tagName');
        const level = parseInt(tagName?.charAt(1) || '1');
        const text = $(element).text().trim();
        if (text) {
          headings.push({ level, text });
        }
      });

      // Extract images
      const images: Array<{ src: string; alt: string; hasAlt: boolean }> = [];
      $('img').each((_, element) => {
        const src = $(element).attr('src') || '';
        const alt = $(element).attr('alt') || '';
        const hasAlt = !!$(element).attr('alt');
        if (src) {
          images.push({ src, alt, hasAlt });
        }
      });

      // Extract links
      const links: Array<{ href: string; text: string; isInternal: boolean }> = [];
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href') || '';
        const text = $(element).text().trim();
        const isInternal = href.startsWith('/') || href.includes(new URL(url).hostname);
        if (href && text) {
          links.push({ href, text, isInternal });
        }
      });

      // Extract main content
      const content = $('body').text().replace(/\s+/g, ' ').trim();
      const wordCount = content.split(/\s+/).length;

      // Check for schema markup
      const schemaScripts = $('script[type="application/ld+json"]');
      const hasSchema = schemaScripts.length > 0;
      const schemaTypes: string[] = [];

      schemaScripts.each((_, element) => {
        try {
          const schemaData = JSON.parse($(element).html() || '{}');
          if (schemaData['@type']) {
            schemaTypes.push(schemaData['@type']);
          }
        } catch (e) {
          // Ignore invalid JSON
        }
      });

      return {
        title,
        metaDescription,
        headings,
        images,
        links,
        content,
        hasSchema,
        schemaTypes,
        loadTime,
        wordCount,
      };
    } catch (error) {
      throw new Error(`Failed to scrape website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
