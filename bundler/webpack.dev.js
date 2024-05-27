const path = require('path');
const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const ip = require('ip');

const infoColor = (message) =>
    `\u001b[1m\u001b[34m${message}\u001b[39m\u001b[22m`;

module.exports = merge(commonConfiguration, {
    stats: 'errors-warnings',
    mode: 'development',
    infrastructureLogging: {
        level: 'warn',
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        allowedHosts: 'all',
        hot: true,
        watchFiles: ['src/**', 'static/**'],
        static: {
            watch: true,
            directory: path.join(__dirname, '../static'),
        },
        client: {
            logging: 'none',
            overlay: true,
            progress: false,
        },
        onListening: function (devServer) {
            const port = devServer.server.address().port;
            const localIp = ip.address();
            const domain1 = `http://${localIp}:${port}`;
            const domain2 = `http://localhost:${port}`;

            console.log(
                `Project is running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(
                    domain2
                )}`
            );
        },
    },
});
