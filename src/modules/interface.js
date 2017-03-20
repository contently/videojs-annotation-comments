"use strict";

module.exports = (id) => {

	function _draw() {
		console.log("Draw UI");
	}

	return {
		draw: _draw
	};
};
