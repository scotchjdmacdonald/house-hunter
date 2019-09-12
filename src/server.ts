import express from 'express';
import http from 'http';
import middleware from './middleware';
import routes from './services';
import { applyMiddleware, applyRoutes } from './utils';

//crudely handling exceptions and rejections
process.on('uncaughtException', e => {
    console.log(e);
    process.exit(1);
});
process.on('unhandledRejection', e => {
    console.log(e);
    process.exit(1);
});

const router = express();

applyMiddleware(middleware, router);
applyRoutes(routes, router);

const server = http.createServer(router);
const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Server is running at http:localhost:${port}`));
