import babel from 'rollup-plugin-babel';
import scss from 'rollup-plugin-scss';

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
      })
    ]
  }
];
