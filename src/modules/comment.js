"use strict";

class Comment {
  constructor(data) {
    this.meta = data.meta;
    this.body = data.body;
  }
}

module.exports = {
	class: Comment
};