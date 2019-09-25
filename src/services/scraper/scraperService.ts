import { SearchParams } from '../search/searchModel';
import { constructFundaUrl, constructParariusUrl, constructSNUrl } from '../../utils/urlHelper';
import { crawlFunda, findNumberOfResultsFunda } from './funda/fundaCrawler';
import { crawlPararius, findNumberOfResultsPar } from './pararius/parariusCrawler';
import axios from 'axios';
import cheerio from 'cheerio';
import { logger } from '../../config/logger';

const scraperService = async (params: SearchParams) => {
    const fundaResults = await scrapeFunda(params);
    var fundaProperties = fundaResults.first;
    var totalFundaResults = fundaResults.second;

    const parResults = await scrapePararius(params);
    var parariusProperties = parResults.first;
    var totalParResults = parResults.second;

    var properties = parariusProperties.concat(fundaProperties);
    var totalResults = ( totalFundaResults ? totalFundaResults : 0 )
    + ( totalParResults ? totalParResults : 0 );

    return {properties, totalResults};
};

const scrapeFunda = async (params: SearchParams) => {
    const fundaUrl = constructFundaUrl(params);
    const $ = await scrapeWithSN(fundaUrl);
    const fundaProperties = await crawlFunda($);
    const numResults: number = findNumberOfResultsFunda($);    

    return { first: fundaProperties, second: numResults };
};

const scrapePararius = async (params: SearchParams) => {
    const parUrl = constructParariusUrl(params);
    try {
        const result = await axios.get(parUrl);

        if (result.status === 200) {
            const $ = cheerio.load(result.data)
            const parariusProperties = crawlPararius($);
            const numResults: number = findNumberOfResultsPar($);

            return { first: parariusProperties, second: numResults };
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
