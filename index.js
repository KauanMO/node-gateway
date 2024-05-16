const express = require('express');
const app = express();
const httpProxy = require('express-http-proxy');

const PORT = 3002;

const microsservices = require('./microsservices');

const selectProxyHost = req => {
    let host;

    microsservices.forEach(ms => {
        if (ms.paths.some(path => req.path.startsWith(path))) {
            host = ms.host;
        }
    });

    if (!host) {
        throw `Microsservice not found at path ${req.path}`;
    }

    return host;
}

app.use((req, res, next) => {
    httpProxy(selectProxyHost(req))(req, res, next);
});

app.listen(PORT, () => { console.log(`Gateway running at ${PORT}`) })