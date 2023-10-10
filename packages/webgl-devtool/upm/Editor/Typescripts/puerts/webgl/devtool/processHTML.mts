import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as cheerio from 'cheerio'

export default function processHTML(htmlPath: string) {
    const htmlContent = readFileSync(join(htmlPath, 'index.html'), 'utf-8');
    const $ = cheerio.load(htmlContent);
    if (!$('head script[src="./puerts-runtime.js"]').length) {
        $('head').append('<script src="./puerts-runtime.js">')
    }
    if (!$('head script[src="./puerts_browser_js_resources.js"]').length) {
        $('head').append('<script src="./puerts_browser_js_resources.js">')
    }
    writeFileSync(join(htmlPath, 'index.html'), $.html(), 'utf-8')

}