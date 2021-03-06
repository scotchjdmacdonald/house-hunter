import { SearchParams } from '../services/search/searchModel';
import dotenv from 'dotenv';

dotenv.config();

/* https://www.funda.nl/en/huur/amsterdam/jordaan/0-2000/50+woonopp/2+kamers/
- base: funda.nl/en/huur/amsterdam
- suburb: suburb
- price: minprice-maxprice
- minsize: size+woonopp
- bedrooms: num+kamers */
export const constructFundaUrl = (p: SearchParams) => {
    let fundaUrl = 'https://www.funda.nl/en/huur/amsterdam/';
    if (p.suburb) fundaUrl += `${p.suburb}/`;
    if (p.maxPrice != null && p.minPrice != null) fundaUrl += `${p.minPrice}-${p.maxPrice}/`;
    fundaUrl += 'appartement/';
    if (p.minSize) fundaUrl += `${p.minSize}+woonopp/`;
    if (p.bedrooms) fundaUrl += `${p.bedrooms}+kamers/`;
    if (p.page) fundaUrl += `p${p.page}/`;

    return fundaUrl;
};

export const constructSNUrl = (url: string) => {
    const key = process.env.SN_API_KEY;
    const baseUrl = process.env.SN_BASE_URL;
    return `${baseUrl}api_key=${key}&url=${url}&render_js=False`;
};

/* eg: https://www.pararius.com/apartments/amsterdam/area-jordaan/900-2000/25m2/1-bedrooms/unfurnished
- base: pararius.com/apartments/amsterdam
- suburb: area-suburb
- price: minprice-maxprice
- minsize: sizem2
- bedrooms: num-bedrooms
- furnished: furnished/unfurnished/blank(for no preference) */
export const constructParariusUrl = (p: SearchParams) => {
    let parUrl = 'https://www.pararius.com/apartments/amsterdam/';
    if (p.suburb) parUrl += `area-${p.suburb}/`;
    if (p.maxPrice != null && p.minPrice != null) parUrl += `${p.minPrice}-${p.maxPrice}/`;
    if (p.minSize) parUrl += `${p.minSize}m2/`;
    if (p.bedrooms) parUrl += `${p.bedrooms}-bedrooms/`;
    if (p.furnished != null) p.furnished == 'true' ? (parUrl += 'furnished/') : (parUrl += 'unfurnished/');
    if (p.page) parUrl += `page-${p.page}/`;

    return parUrl;
};
