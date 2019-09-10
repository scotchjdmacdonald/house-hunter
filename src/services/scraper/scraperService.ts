import { SearchParams } from '../search/searchModel';
import { constructFundaUrl, constructParariusUrl, constructSNUrl } from '../../utils/urlHelper';
import { crawlFunda } from './funda/fundaCrawler';
import { crawlPararius } from './pararius/parariusCrawler';
import axios from 'axios';
import cheerio from 'cheerio';
import { logger } from '../../config/logger';

const scraperService = async (params: SearchParams) => {
    const fundaResults = await scrapeFunda(params);
    const parResults = await scrapePararius(params);

    return parResults.concat(fundaResults);
};

const scrapeFunda = async (params: SearchParams) => {
    const fundaUrl = constructFundaUrl(params);
    const $ = await scrapeWithSN(fundaUrl);
    const fundaProperties = await crawlFunda($);

    return fundaProperties;
};

const scrapePararius = async (params: SearchParams) => {
    const parUrl = constructParariusUrl(params);
    try {
        const result = await axios.get(parUrl);

        if (result.status === 200) {
            const parariusProperties = crawlPararius(cheerio.load(result.data));
            return parariusProperties;
        } else {
            throw `${result.status} problem scraping pararius`;
        }
    } catch (e) {
        logger.error(`Exception: ${e}, error whilst scraping Pararius with axios`);
        return;
    }
};

const scrapeWithSN = async (url: string) => {
    const snUrl = constructSNUrl(url);
    try {
        const result = await axios.get(snUrl);
        return cheerio.load(result.data);
    } catch (e) {
        logger.error(`Exception: ${e}, error whilst scraping funda with SN`);
        throw e;
    }
};

export default scraperService;
