import cheerio from 'cheerio';
import dotenv from 'dotenv';
import { PropertyResultModel } from '../../search/searchResultsModel';
import { logger } from '../../../config/logger';

dotenv.config();

export const crawlFunda = ($: any) => {
    const properties: PropertyResultModel[] = [];

    let pLinks: string[] = [];
    let pImgs: string[] = [];
    let pAddrs: string[] = [];
    let pCodes: string[] = [];
    let pPrices: string[] = [];
    let pRooms: string[] = [];
    let pSizes: string[] = [];

    pLinks = findPropertyLinks($);
    pImgs = findPropertyImages($);
    pPrices = findPriceInfo($);
    let vals = findAddressInfos($);
    pAddrs = vals.first;
    pCodes = vals.second;
    vals = findRoomsAndSizeInfo($);
    pSizes = vals.first;
    pRooms = vals.second;

    const numValuesForListings = [
        pLinks.length,
        pImgs.length,
        pPrices.length,
        pAddrs.length,
        pCodes.length,
        pSizes.length,
        pRooms.length,
    ];

    if (
        numValuesForListings.every(v => {
            return v === numValuesForListings[0];
        })
    ) {
        const numListings = pLinks.length;
        for (let i = 0; i < numListings; i++) {
            properties.push(
                new PropertyResultModel(
                    (this.price = pPrices[i]),
                    (this.size = pSizes[i]),
                    (this.link = pLinks[i]),
                    (this.image = imageSourcesConstructor(pImgs[i])),
                    (this.address = pAddrs[i]),
                    (this.postcode = pCodes[i]),
                    (this.rooms = pRooms[i]),
                ),
            );
        }
    } else {
        logger.info(`Inconsistent property details array length, 
        priceL:${pPrices.length}, linksL:${pLinks.length}, sizesL:${pSizes.length}, 
        addrL:${pAddrs.length}, codesL:${pCodes.length}, roomL:${pRooms.length}`);
    }
    return properties;
};

const findRoomsAndSizeInfo = ($: any) => {
    const sizes: string[] = [];
    const rooms: string[] = [];

    const sizeResults = $('.search-result-info .search-result-kenmerken li:first-child span');
    const roomResults = $('.search-result-info .search-result-kenmerken li:nth-child(2)');

    if (sizeResults.length == roomResults.length) {
        for (let i = 0; i < sizeResults.length; i++) {
            sizes.push($(sizeResults[i]).text());
            rooms.push($(roomResults[i]).text());
        }
    }

    return { first: sizes, second: rooms };
};

const findPriceInfo = ($: any) => {
    const prices: string[] = [];
    const priceResults = $('.search-result-info .search-result-price');

    priceResults.each((i: any, p: any) => {
        const price = $(p).text();
        if (price.includes('p/mo')) prices.push($(p).text());
    });
    return prices;
};

const findAddressInfos = ($: any) => {
    const codes: string[] = [];
    const addrs: string[] = [];
    const addrResults = $('.search-result-header .search-result-title');
    const codeResults = $('.search-result-header .search-result-subtitle');

    addrResults.each((i: any, a: any) => {
        addrs.push($(a).text());
        $(a).text();
    });
    codeResults.each((i: any, c: any) => {
        codes.push($(c).text());
    });

    return { first: addrs, second: codes };
};

const findPropertyLinks = ($: any) => {
    const links: string[] = [];
    const results = $('.search-content .search-results .search-result-header a:first-child');
    results.each((i: any, l: any) => {
        const link = $(l).attr('href');
        if (link.includes('.html') == false) links.push(`${process.env.FUNDA_BASE_URL}${link}`);
    });
    return links;
};

const findPropertyImages = ($: any) => {
    const imgs: string[] = [];
    const results = $('.search-result-media .search-result-image img');
    results.each((i: any, img: any) => {
        imgs.push($(img).attr('src'));
    });
    return imgs;
};

const imageSourcesConstructor = (imgLink: string) => {
    const splitSrc = imgLink.split('_');
    const imageRes = `_${splitSrc[splitSrc.length - 1]}`;
    const imgNum = Number(splitSrc[1].split('/').slice(-1)[0]);
    const imageSources: string[] = [];

    imageSources.push(imgLink);
    imageSources.push(imgLink.replace(`${imgNum}_720x480.jpg`, `${imgNum + 1}_720x480.jpg`));
    imageSources.push(imgLink.replace(`${imgNum}_720x480.jpg`, `${imgNum + 2}_720x480.jpg`));
    imageSources.push(imgLink.replace(`${imgNum}_720x480.jpg`, `${imgNum + 3}_720x480.jpg`));

    return imageSources;
};

export const findNumberOfResultsFunda = ($: any) => {
    return Number(
        $('.search-output-result-count span')
            .text()
            .split(' ')[0]
            .replace(',', ''),
    );
};
