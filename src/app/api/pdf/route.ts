export const dynamic = 'force-dynamic' // defaults to auto
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.emulateMediaType('screen')

    // This does appear to create a pdf but with non selectable text,
    // and the text doesn't appear to be vectorized
    const pdfBuffer = await page.pdf({ format: 'A4' })

    return new Response(pdfBuffer); 
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}












