'use strict';

global.videojs = require('video.js');

const Annotation = require("../../../src/modules/annotation").class,
      expect = require('chai').expect;

class MockedAnnotation extends Annotation {
    buildComments() { this.commentList = { data: [] } }
    buildMarker() {}
    buildShape() {}
    bindEvents() {}
}

describe('Annotation', () => {
    describe('get data', () => {
        it('returns the data the annotation was initalized with', () => {
            var annotation = new MockedAnnotation({
                'id': 'myId',
                'range': { 'start': 55, 'end': 60 },
                'shape': { 'x1':23.47,'y1':9.88,'x2':60.83,'y2':44.2 },
                'comments' : [
                    {
                        'id': 'myCommentId',
                        'body': 'My comment',
                        'meta': {
                            'datetime': '2017-03-28T19:17:32.238Z',
                            'user_id': 1,
                            'user_name': 'Alex Ackerman'
                        }
                    }
                ]
            });

            var data = annotation.data;

            expect(data.id).to.equal('myId');
            expect(data.range.start).to.equal(55);
            expect(data.range.end).to.equal(60);
            expect(data.shape.x1).to.equal(23.47);
            expect(data.shape.x2).to.equal(60.83);
            expect(data.shape.y1).to.equal(9.88);
            expect(data.shape.y2).to.equal(44.2);
            expect(data.comments).to.be.an("array").that.is.empty
        }) ;
    });
});
