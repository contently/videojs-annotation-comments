'use strict';
/*
	General logging library, checking to see if window.VAC_DEBUG is present and true to enable debugging
*/

const LOG_PREFIX = "::VAC::";

function debug(){
	return !!window.VAC_DEBUG;
}

function buildArgs(args){
	return [LOG_PREFIX].concat(args);
}

module.exports.log = (...args) => {
    if(!debug()) return;
    console.log.apply(null, buildArgs(args));
}

module.exports.error = (...args) => {
    if(!debug()) return;
    console.error.apply(null, buildArgs(args));
}

module.exports.info = (...args) => {
    if(!debug()) return;
    console.info.apply(null, buildArgs(args));
}
