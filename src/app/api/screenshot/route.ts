export const dynamic = 'force-dynamic' // defaults to auto
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get('url')
  let browser;

  if (!url) {
    return NextResponse.json({error: 'URL parameter is required'}, {status: 400});
  }

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({type: 'png'});

    return new Response(screenshot); 
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}