import { SearchParams } from './searchModel';
import scraperService from '../scraper/scraperService';

export const searchAndScrape = async (params: SearchParams) => {
    return scraperService(params);
};
