const { environment } = require('@rails/webpacker')
const fileLoader = environment.loaders.get('file')
fileLoader.test = /\.(jpg|jpeg|png|gif|eot|otf|ttf|woff|woff2)$/i;
environment.loaders.prepend('svg', {
  test: /\.svg$/,
  loader: 'svg-react-loader'
})

module.exports = environment
