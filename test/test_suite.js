const expect = require('chai').expect,
    jsdom = require('jsdom'),
    // plugin = require('path').resolve(__dirname, '../src/main.js'),
    testPage = require('path').resolve(__dirname, './test.html');

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole().sendTo(console);


// const { JSDOM } = jsdom;
// const window = (new JSDOM(html, { runScripts: "dangerously" })).window;
// // window.videojs = require('video.js');
// window.onModulesLoaded = () => console.log("LOADED");
// window.eval(html)
// const window = (new JSDOM(``, { runScripts: "outside-only" })).window;
//
// window.eval(`document.body.innerHTML = "<p>Hello, world!</p>";`);
// window.document.body.children.length === 1;

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

describe('video-annoation-comments', function () {

    const testPageDom = JSDOM.fromFile(
        testPage,
        {
            runScripts: "outside-only",
            virtualConsole: virtualConsole
        }
    )

    it('works', function() {
        testPageDom.then(function(dom){
            // console.log(dom.window);
            console.log(dom.window.videojs);
            expect(dom.window.document.getElementsByClassName('vjs-big-play-button').length).eql(1);
        })
    });
})
