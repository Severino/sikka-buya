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
        @import "@/scss/_variables.scss";
        @import "@/scss/_mixins.scss";
        `
            }
        }
    }
}