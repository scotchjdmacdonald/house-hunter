
export class PropertyResultModel {
    public price: string;
    public size: string;
    public link: string;
    public images: string[];
    public address: string;
    public postcode: string;
    public rooms: string;

    constructor(price : string, size: string, link: string, 
        images: string[], address: string, postcode: string, rooms: string){
            this.price = price;
            this.size = size;
            this.link = link;
            this.images = images;
            this.address = address;
            this.postcode = postcode;
            this.rooms = rooms;
    }
}