import cheerio from 'cheerio';
import dotenv from 'dotenv';
import { PropertyResultModel } from '../../search/searchResultsModel';
import { ADDRCONFIG } from 'dns';
import { listeners } from 'cluster';

dotenv.config();

export const crawlPararius = ($: any) => {
    const properties: PropertyResultModel[] = [];

    const numResults: number = findNumberOfResults($);

    const listingNodes = $('.property-list-item-container');
    const numListingsOnPage = listingNodes.length;

    for (let i = 0; i < numListingsOnPage; i++) {
        const currNode = listingNodes[i];

        const imgNodes = $(currNode).find('.centered-image-container img');
        const pImgs: string[] = [];
        imgNodes.each((c: any, n: any) => {
            var tmpImg = ($(n).attr('src') || $(n).attr('data-src')).replace('180x300', '613x920');
            pImgs.push(tmpImg);
        });

        const pLink = `${process.env.PARARIUS_BASE_URL}${$(currNode)
            .find('.details h2 a')
            .attr('href')}`;
        const pCode = $(currNode)
            .find('.details .breadcrumbs li:first-child')
            .text()
            .trim();
        const pPrice = $(currNode)
            .find('.details .price')
            .text()
            .replace(/\s/g, '')
            .split('/')[0];
        const pAddr = $(currNode)
            .find('.details h2 a')
            .text()
            .replace(/House|Apartment/gi, '')
            .replace(/  +/g, ' ')
            .replace(/(\r\n\t|\n|\r\t)/gm, '')
            .trim();
        const pSize = $(currNode)
            .find('.details .property-features .surface')
            .text()
            .trim()
            .replace(' ', '');
        const pRooms = $(currNode)
            .find('.details .property-features .bedrooms')
            .text()
            .trim();

        properties.push(
            new PropertyResultModel(
                (this.price = pPrice),
                (this.size = pSize),
                (this.link = pLink),
                (this.image = pImgs),
                (this.address = pAddr),
                (this.postcode = pCode),
                (this.rooms = pRooms),
            ),
        );
    }

    return properties;
};

const findNumberOfResults = ($: any) => {
    return Number(
        $('.search-results-wrapper .header .count')
            .text()
            .trim()
            .split(' ')[0],
    );
};
