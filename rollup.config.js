import babel from 'rollup-plugin-babel';
import scss from 'rollup-plugin-scss';
import handlebars from 'rollup-plugin-handlebars-plus';

module.exports = [
  {
    input: 'src/js/index.js',
    output: {
      file: 'build/bundle.js',
      format: 'umd'
    },
    plugins: [
      scss(),
      babel({
        exclude: 'node_modules/**'
      }),
      handlebars({
        handlebars: {
          id: 'handlebars', // Default: the path of Handlebars' CJS definition within this module

          // Custom handlebars compiler if the built in version is not proper. If you pass this,
          // you must also pass `id` (above), to ensure that the compiler and runtime versions match.
          module: require('handlebars'),
          helpers: ['/src/lib/handlebarsHelpers.js']
        }
      })
    ]
  }
];
