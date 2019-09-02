import { SearchParams } from '../search/searchModel';
import { constructFundaUrl, constructParariusUrl, constructSNUrl } from '../../utils/urlHelper';
import { crawlFunda } from './funda/fundaCrawler';
import { crawlPararius } from './pararius/parariusCrawler';
import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const scraperService = async (params: SearchParams) => {
    const fundaResults = await scrapeFunda(params);
    const parResults = await scrapePararius(params);

    return parResults.concat(fundaResults);
};

const scrapeFunda = async (params: SearchParams) => {
    const fundaUrl = constructFundaUrl(params);
    const $ = await scrapeWithSN(fundaUrl);
    const fundaProperties =  await crawlFunda($);

    return fundaProperties;
};

const scrapePararius = async (params: SearchParams) => {
    const parUrl = constructParariusUrl(params);
    const result = await axios.get(parUrl);
    const parariusProperties = crawlPararius(cheerio.load(result.data));

    return parariusProperties;
};

const scrapeWithSN = async (url: string) => {
    const snUrl = constructSNUrl(url);
    const result = await axios.get(snUrl);
    return cheerio.load(result.data);
};
/**
const scrapeWithPuppeteer = async (url: string) => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 320, height: 600});    
    await page.setUserAgent('Opera/5.02 (Windows NT 5.0; U)');    
    await page.goto(url);
    await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
    await page.waitForSelector('#content');

    var result = await page.evaluate(() => {
        try {
            var data = (document.querySelector("body"));
            return String(data);
        } catch(err) {
            return(err.toString());
        }
    })

    return cheerio.load(result);
}*/

export default scraperService;
