// Configuración de Karma: Jasmine, webpack con Babel para JSX y reporte de cobertura
const usarCobertura = true

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    files: ['src/pruebas/**/*.spec.js', 'src/pruebas/**/*.spec.jsx'],
    preprocessors: {
      'src/pruebas/**/*.spec.js': ['webpack', 'sourcemap'],
      'src/pruebas/**/*.spec.jsx': ['webpack', 'sourcemap'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            resolve: { fullySpecified: false },
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: usarCobertura
                  ? [['istanbul', { exclude: ['**/*.spec.js', '**/*.spec.jsx'] }]]
                  : [],
              },
            },
          },
        ],
      },
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html', subdir: 'html' }, { type: 'text-summary' }],
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: false,
  })
}