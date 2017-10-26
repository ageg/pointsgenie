import { join } from "path";
import _ from "lodash";
import webpack from "webpack";
import strategies from "./strategies";

const defaultEnv = {
  docs: false,
  test: false,
  apiUrl: ""
};

export default (env, argv) => {
  env = _.merge({}, defaultEnv, env);

  env.publicPath = env.devServer ? "//localhost:2992/_assets/" : "";
  const environment = env.test || env.development ? "development" : "production";

  const babelLoader = "babel-loader?optional[]=runtime" +
    "&optional[]=es7.objectRestSpread&optional[]=es7.asyncFunctions&optional[]=es7.classProperties";

  const reactLoader = env.development ? `react-hot-loader!${babelLoader}` : babelLoader;
  const chunkFilename = (env.devServer ? "[id].js" : "[name].js") +
    (env.longTermCaching ? "?[chunkhash]" : "");

  const root = join(__dirname, "..");

  env.excludeFromStats = [
    /node_modules/,
  ];

  const config = {
    entry: {
      "app": join(root, "app", "app.js"),
      "admin": join(root, "app", "admin-app.jsx"),
    },

    output: {
      path: join(root, "build", "public"),
      filename: "[name].js",
      chunkFilename: chunkFilename,
      publicPath: env.publicPath,
      sourceMapFilename: "debugging/[file].map",
    },

    externals: [
    ],

    resolve: {
      extensions: [".js",".jsx"],
      alias: {
        // shared: join(root, "shared"),
        // client: join(root, "client"),
        // app: join(root, "app"),
      },
    },

    module: {
      loaders: [
        { test: /\.(js|jsx)/, loader: reactLoader, exclude: /node_modules/ },
        { test: /\.json/, loader: "json" },
        { test: /\.(woff|woff2)/, loader: "url-loader?limit=100000" },
        { test: /\.(png|jpg|jpeg|gif|svg)/, loader: "url-loader?limit=100000" },
        { test: /\.(ttf|eot)/, loader: "file-loader" },
      ]
    },

    plugins: [
      new webpack.PrefetchPlugin("react"),
      new webpack.PrefetchPlugin("react-bootstrap"),
      new webpack.PrefetchPlugin("react-router/build/npm/lib"),
      new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
      new webpack.PrefetchPlugin("flummox"),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(environment),
          API_URL: JSON.stringify(env.apiUrl),
        }
      }),
    ],

    devServer: {
      stats: {
        exclude: env.excludeFromStats
      }
    }
  };

  return strategies.reduce((conf, strategy) => {
    return strategy(conf, env);
  }, config);
}
