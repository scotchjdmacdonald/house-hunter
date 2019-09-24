export class SearchParams {
    public minSize: string;
    public maxPrice: string;
    public minPrice: string;
    public bedrooms: string;
    public keywords: string[];
    public furnished: string;
    public suburb: string;
    public page: string;

    constructor(
        minSize: string,
        maxPrice: string,
        minPrice: string,
        bedrooms: string,
        keywords: string[],
        furnished: string,
        suburb: string,
        page: string,
    ) {
        this.minSize = minSize;
        this.maxPrice = maxPrice;
        this.minPrice = minPrice;
        this.bedrooms = bedrooms;
        this.keywords = keywords;
        this.furnished = furnished;
        this.suburb = suburb;
        this.page = page;
    }
}
