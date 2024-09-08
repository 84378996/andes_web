const { defineConfig } = require("@vue/cli-service");
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        //target: "http://localhost:53399",
        target: "http://192.168.1.6:9000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  chainWebpack: (config) => {
    //const svgRule = config.module.rule("svg")
    //svgRule.uses.clear()
    //svgRule.use("vue-loader").loader("vue-loader")

    config.module
      .rule("leader-line")
      .test(path.resolve(__dirname, "node_modules/leader-line"))
      .use("skeleton-loader")
      .loader("skeleton-loader")
      .options({
        procedure: (content) => `${content}export default LeaderLine`,
      });
    config.module.rule("svg").exclude.add(resolve("src/assets")).end();

    config.module
      .rule("assets")
      .test(/\.svg$/)
      .include.add(resolve("src/assets"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  // configureWebpack: (config) => {
  //   config.module.rules.push({
  //     test: path.resolve(__dirname, "node_modules/leader-line/"),
  //     use: [
  //       {
  //         loader: "skeleton-loader",
  //         options: {
  //           procedure: (content) => `${content}export default LeaderLine`,
  //         },
  //       },
  //     ],
  //   });
  // },
});
