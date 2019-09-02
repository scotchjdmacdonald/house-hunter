
import cheerio from 'cheerio'
import dotenv from "dotenv";
import { PropertyResultModel } from '../../search/searchResultsModel';
import { ADDRCONFIG } from 'dns';
import { listeners } from 'cluster';

dotenv.config();

export const crawlPararius = ($: any) => {

    var properties : PropertyResultModel[] = new Array();

    var numResults: number = findNumberOfResults($);

    var listingNodes = $('.property-list-item-container');
    var numListingsOnPage = listingNodes.length;

    for(var i = 0; i < numListingsOnPage; i++){

        var currNode = listingNodes[i];

        var imgNodes = $(currNode).find('.centered-image-container img');
        var pImgs: string[] = new Array();
        imgNodes.each((c: any, n: any) => {
            pImgs.push($(n).attr('src') || $(n).attr('data-src'));
        })

        var pLink = `${process.env.PARARIUS_BASE_URL}${$(currNode).find('.details h2 a').attr('href')}`
        var pCode = $(currNode).find('.details .breadcrumbs li:first-child').text().trim();
        var pPrice = $(currNode).find('.details .price').text().replace(/\s/g,'').split("/")[0];
        var pAddr = $(currNode).find('.details h2 a').text().replace(/House|Apartment/gi, '').replace(/  +/g, ' ').replace(/(\r\n\t|\n|\r\t)/gm,"").trim();
        var pSize = $(currNode).find('.details .property-features .surface').text().trim().replace(' ', '');
        var pRooms = $(currNode).find('.details .property-features .bedrooms').text().trim();


        properties.push(new PropertyResultModel(
            this.price = pPrice,
            this.size = pSize,
            this.link = pLink,
            this.image = pImgs,
            this.address = pAddr,
            this.postcode = pCode,
            this.rooms = pRooms
            ));    
    };

    return properties;
}

const findNumberOfResults = ($: any) => {
    return Number(($('.search-results-wrapper .header .count').text()).trim().split(" ")[0]);
}