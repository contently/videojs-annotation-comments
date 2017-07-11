const expect = require('chai').expect,
    jsdom = require('mocha-jsdom'),
    lib = require('path').resolve(__dirname, '../src/main.js');

// FIXME: bug: https://github.com/rstacruz/mocha-jsdom/pull/28
// describe('video-annoations', function () {
//     jsdom()
//
//     before(function () {
//         VideoAnnoations = require('../src/main.js').Main;
//     });
//
//     it('works', function () {
//         expect(1+1).eql(2);
//     })
// });
