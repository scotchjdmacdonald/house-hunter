import { Request, Response } from 'express';
import { searchAndScrape } from '../search/searchController';
import { SearchParams } from '../search/searchModel';

export default [
    {
        path: '/api/v1/healthcheck',
        method: 'get',
        handler: async (req: Request, res: Response) => {
            res.send('We are up and running! No reason to stress :)');
        },
    },
    {
        path: '/api/v1/search',
        method: 'get',
        handler: [
            async ({ query }: Request, res: Response) => {
                const params: SearchParams = new SearchParams(
                    query.minSize,
                    query.maxPrice,
                    query.minPrice,
                    query.bedrooms,
                    query.keywords,
                    query.furnished,
                    query.suburbs,
                    query.page,
                );
                const result = await searchAndScrape(params);
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            },
        ],
    },
];
