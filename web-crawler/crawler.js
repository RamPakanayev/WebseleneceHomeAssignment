// crawler.js !
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import { URL } from "url";

class WebCrawler {
  constructor() {
    this.results = [];
    this.visited = new Set();
  }

  isValidUrl(urlString) {
    try {
      const url = new URL(urlString);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }

  normalizeUrl(url, baseUrl) {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return null;
    }
  }

  async crawlPage(url, depth, maxDepth) {
    if (depth > maxDepth || this.visited.has(url) || !this.isValidUrl(url)) {
      return;
    }

    this.visited.add(url);
    console.log(`Crawling: ${url} (Depth: ${depth})`);

    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": "Custom Web Crawler" },
        timeout: 5000,
      });

      const $ = cheerio.load(response.data);

      // Extract images
      $("img").each((_, element) => {
        const imageUrl = this.normalizeUrl($(element).attr("src"), url);
        if (imageUrl) {
          this.results.push({
            imageUrl,
            sourceUrl: url,
            depth,
          });
        }
      });

      // Only follow links if we haven't reached max depth
      if (depth < maxDepth) {
        const links = [];
        $("a").each((_, element) => {
          const link = this.normalizeUrl($(element).attr("href"), url);
          if (link && !this.visited.has(link)) {
            links.push(link);
          }
        });

        for (const link of links) {
          await this.crawlPage(link, depth + 1, maxDepth);
        }
      }
    } catch (error) {
      console.error(`Error crawling ${url}:`, error.message);
    }
  }

  async saveResults() {
    const path = "./results.json";
    await fs.writeFile(
      path,
      JSON.stringify({ results: this.results }, null, 2)
    );
    console.log(`Results saved to ${path}`);
  }
}

async function main() {
  const [, , url, depthStr] = process.argv;
  const depth = parseInt(depthStr);

  if (!url || isNaN(depth)) {
    console.error("Usage: node crawler.js <url> <depth>");
    process.exit(1);
  }

  const crawler = new WebCrawler();
  await crawler.crawlPage(url, 0, depth);
  await crawler.saveResults();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
// hello