const path = require("path")

module.exports = {
    devServer: {
        progress: false // disable progress logging in console. => it massively pollutes the CI logs
    },
    configureWebpack: {
        devtool: 'source-map',
        resolve: {
            alias: {
                icons: path.resolve(__dirname, "node_modules/vue-material-design-icons")
            },
            extensions: [
                ".vue"
            ]
        },
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                @use "sass:math";
        @import "@/scss/_import.scss";
        `
            }
        }
    }
}