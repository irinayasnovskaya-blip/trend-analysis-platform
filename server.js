const http = require('node:http');

const port = Number(process.env.PORT || 3000);

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html>
<html lang="uk">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Платформа для аналізу трендів</title>
</head>
<body>
    <h1>Платформа для аналізу трендів</h1>
    <p>Тестова сторінка працює.</p>
</body>
</html>`);
});

server.listen(port, '0.0.0.0');
