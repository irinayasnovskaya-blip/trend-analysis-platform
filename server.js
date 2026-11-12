const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const files = {
    '/': ['index.html', 'text/html'],
    '/style.css': ['style.css', 'text/css'],
    '/app.js': ['app.js', 'text/javascript']
};

http.createServer((request, response) => {
    const route = request.url.split('?')[0];
    const file = Object.hasOwn(files, route) && files[route];
    if (!file) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Сторінку не знайдено');
        return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
    }
    fs.readFile(path.join(__dirname, file[0]), (error, data) => {
        if (error) {
            response.writeHead(500).end();
            return;
        }
        response.writeHead(200, {
            'Content-Type': file[1] + '; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            'Content-Security-Policy': "default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"
        });
        response.end(request.method === 'HEAD' ? undefined : data);
    });
}).listen(Number(process.env.PORT || 3000), '0.0.0.0');
