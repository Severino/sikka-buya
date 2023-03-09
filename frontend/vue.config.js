const path = require("path")

module.exports = {
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