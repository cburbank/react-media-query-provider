module.exports = function (api) {
  api.cache(true)

  const presets = [
    '@babel/react',
    ['@babel/env', { modules: false }],
    '@babel/flow'
  ]

  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: false }]
  ]

  const env = {
    development: {
      plugins: [
        ['flow-react-proptypes']
      ]
    },
    production: {
      plugins: [
        ['transform-react-remove-prop-types'],
        ['transform-flow-strip-types']
      ]
    }
  }

  return {
    presets,
    plugins,
    env
  }
}
