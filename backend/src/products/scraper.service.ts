import { Injectable } from '@nestjs/common';
import { ProductsService } from './products.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedProduct {
  asin: string;
  title: string;
  brand?: string;
  category?: string;
  image_url?: string;
  price: number;
  currency: string;
  availability?: string;
  seller?: string;
}

@Injectable()
export class ScraperService {
  constructor(private productService: ProductsService) {}

  async fetchProductsByASINs(): Promise<void> {
    const asins = [
      'B0C1KPXPM9','B0CRTYZG5C','B0CMV98DP2','B0863TXGM3','B0FTCBL9YN',
      'B0CQMPSWMJ','B0947BJ67M','B07Y91BMSK','B0B9BYXM5Z','B07RW4CHC3',
      'B07MBHRYTJ','B09Y4HHY1P','B007HD570Q','B001ET7IQK','B000GAYQJ0',
      'B00HF49WXK','B009KYJAJY','B0DTB5641V','B000AYW0KO','B09PZG4R17',
      'B0C3BSZ56D','B09TRW57WB'
    ];

    for (const asin of asins) {
      const url = `https://www.amazon.com/dp/${asin}`;

      try {
        const response = await axios.get('https://app.scrapingbee.com/api/v1/', {
          params: {
            api_key: process.env.SCRAPINGBEE_API_KEY,
            url,
            render_js: true,
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const title = $('#productTitle').text().trim();
        const brand = $('#bylineInfo').text().trim() || $('a#bylineInfo').text().trim();
        const category = $('a.a-link-normal.a-color-tertiary').first().text().trim();
        const image_url = $('#landingImage').attr('src') || '';

        const { price, currency, rawPrice } = this.extractPrice($);

        const availability = $('#availability span').text().trim() || 'Unknown';
        const seller = $('#sellerProfileTriggerId').text().trim() || 'Amazon.com';

        console.log(`Scraper: ASIN=${asin} priceRaw="${rawPrice}" parsedPrice=${price} currency=${currency}`);

        if (title) {
          const product: ScrapedProduct = {
            asin,
            title,
            brand,
            category,
            image_url,
            price,
            currency,
            availability,
            seller,
          };

          await this.productService.create(product);
          console.log(`Saved product ${asin}: ${title}`);
        } else {
          console.warn(`Could not scrape product ${asin}`);
        }

      } catch (err) {
        console.error(`Failed to scrape ${asin}:`, err.message);
      }
    }
  }

  private extractPrice($: any): { price: number; currency: string; rawPrice: string } {
    let priceString = '';
    
    // Try to find price in the main product section
    let priceElement = $('.a-price .a-offscreen').first();
    if (!priceElement || !priceElement.length) {
      priceElement = $('span.a-price .a-offscreen').first();
    }
    if (priceElement && priceElement.length) {
      priceString = priceElement.text().trim();
      console.log('Found price with .a-price .a-offscreen:', priceString);
    }

    // Try additional selectors if still no price found
    if (!priceString) {
      const selectors = [
        '#price_inside_buybox',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '#priceblock_saleprice',
        'span.a-price[data-a-size="xl"] .a-offscreen',
        '#corePrice_feature_div .a-offscreen',
        '#newBuyBoxPrice',
        '#usedBuyBoxPrice',
      ];

      for (const sel of selectors) {
        const txt = $(sel).first().text();
        if (txt && txt.trim()) {
          const trimmed = txt.trim();
          // Skip if it's a percentage, error message, or doesn't contain numbers
          if (!trimmed.includes('%') && 
              !trimmed.toLowerCase().includes('unavailable') && 
              !trimmed.toLowerCase().includes('cannot be shipped') &&
              /[0-9]/.test(trimmed)) {
            priceString = trimmed;
            console.log(`Found price with selector ${sel}:`, priceString);
            break;
          }
        }
      }
      if (!priceString) {
        console.log('No price found with any standard selector');
      }
    }

    // Fallback: Check JSON-LD structured data
    if (!priceString) {
      const jsonLdScripts = $('script[type="application/ld+json"]');
      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const data = JSON.parse($(jsonLdScripts[i]).html());
          if (data.offers && data.offers.price) {
            priceString = data.offers.priceCurrency
              ? `${data.offers.price} ${data.offers.priceCurrency}`
              : String(data.offers.price);
            break;
          }
        } catch (e) {
          // JSON parsing failed, try next script
          continue;
        }
      }
    }

    // Fallback: Check for price in JavaScript variables
    if (!priceString) {
      const scriptTexts = $('script').map((i, el) => $(el).html()).get();
      const priceRegex = /['"]price['"]\s*[:=]\s*['"]([0-9.,]+)['"]/i;
      for (const script of scriptTexts) {
        const match = script.match(priceRegex);
        if (match && match[1]) {
          priceString = match[1];
          break;
        }
      }
    }

    // Normalize the price string
    priceString = priceString.replace(/\s+/g, '').replace(/\u00A0/g, '').trim();
    
    // Extract numeric value - handle different decimal and thousand separators
    let numericValue = 0;
    let currency = 'USD';
    
    // Detect currency from the string
    if (priceString.includes('EUR')) currency = 'EUR';
    else if (priceString.includes('GBP') || priceString.includes('£')) currency = 'GBP';
    else if (priceString.includes('CAD')) currency = 'CAD';
    else if (priceString.includes('BRL')) currency = 'BRL';
    else if (priceString.includes('PLN')) currency = 'PLN';
    else if (priceString.includes('$')) currency = 'USD';
    
    // Try to extract price with different formats
    const priceMatch = priceString.match(/([\$\£\€]?)\s*([0-9]+[.,]?[0-9]*)/);
    if (priceMatch) {
      // Extract currency if present
      if (priceMatch[1]) {
        switch (priceMatch[1]) {
          case '£': currency = 'GBP'; break;
          case '€': currency = 'EUR'; break;
          case '$': currency = 'USD'; break;
        }
      }
      
      // Handle different decimal/thousand separators
      const numberStr = priceMatch[2].replace(/[^0-9.,]/g, '');
      if (numberStr.includes(',') && numberStr.includes('.')) {
        // Format like 1,234.56 (US) or 1.234,56 (EU)
        const lastComma = numberStr.lastIndexOf(',');
        const lastDot = numberStr.lastIndexOf('.');
        if (lastComma > lastDot) {
          // European format: 1.234,56 -> 1234.56
          numericValue = parseFloat(numberStr.replace(/\./g, '').replace(',', '.'));
        } else {
          // US format: 1,234.56 -> 1234.56
          numericValue = parseFloat(numberStr.replace(/,/g, ''));
        }
      } else if (numberStr.includes(',')) {
        // Check if comma is decimal separator (EU) or thousands separator (US)
        const parts = numberStr.split(',');
        if (parts.length === 2 && parts[1].length <= 2) {
          // Likely decimal: 12,99 -> 12.99
          numericValue = parseFloat(numberStr.replace(',', '.'));
        } else {
          // Likely thousands: 1,234 -> 1234
          numericValue = parseFloat(numberStr.replace(/,/g, ''));
        }
      } else {
        // No comma or just a dot as decimal separator
        numericValue = parseFloat(numberStr);
      }
    }

    return { 
      price: Number.isFinite(numericValue) ? numericValue : 0,
      currency,
      rawPrice: priceString || 'Not found'
    };
  }
}
