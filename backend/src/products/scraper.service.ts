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
            url: url,
            render_js: true,
          },
        });

        const html = response.data;
        const $ = cheerio.load(html);

  const title = $('#productTitle').text().trim();
  const brand = $('#bylineInfo').text().trim() || $('a#bylineInfo').text().trim();
  const category = $('a.a-link-normal.a-color-tertiary').first().text().trim();
  const image_url = $('#landingImage').attr('src') || '';

  // Improved price extraction: try multiple selectors Amazon uses and normalize values
  const { price, currency, rawPrice } = this.extractPrice($);
  const availability = $('#availability span').text().trim() || 'Unknown';
  const seller = $('#sellerProfileTriggerId').text().trim() || 'Amazon.com';

  // Debug log to help diagnose empty/missing price strings
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

  // Extract price and currency using several common Amazon selectors and normalize the value
  private extractPrice($: any): { price: number; currency: string; rawPrice: string } {
    const selectors = [
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '#priceblock_saleprice',
      '#price_inside_buybox',
      'span.a-offscreen',
      '.a-price .a-offscreen',
    ];

    let priceString = '';
    for (const sel of selectors) {
      const txt = $(sel).first().text();
      if (txt && txt.trim()) {
        priceString = txt.trim();
        break;
      }
    }

    // normalize nbsp and trim
    priceString = priceString.replace(/\u00A0/g, ' ').trim();

    // keep only digits, dot and comma for numeric part
    const numericPart = (priceString || '').replace(/[^0-9.,]/g, '');
    // convert commas to dots (basic normalization) and remove extra dots if any
    const normalized = numericPart.replace(/,/g, '.');
    const parsed = parseFloat(normalized);
    const price = Number.isFinite(parsed) ? parsed : 0;

    // currency: remove numbers, dots, commas and whitespace
    const currency = (priceString || '').replace(/[0-9.,\s\u00A0]/g, '') || 'USD';

    return { price, currency, rawPrice: priceString };
  }
}
