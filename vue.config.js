module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'assets': '@/assets',
        'network': '@/network',
        'plugins': '@/plugins'
      }
    }
  }
}