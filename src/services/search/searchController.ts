import { SearchParams } from './searchModel';
import scraperService from '../scraper/scraperService'

export const searchAndScrape = async (params : SearchParams) => {
    
    console.log(params);
    return scraperService(params);
}