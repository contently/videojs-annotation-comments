/*
	General logging library, checking to see if window.VAC_DEBUG is present and true to enable debugging
*/

// Prefix for appending to all logger messages
const LOG_PREFIX = '::VAC::';

// Are we in debug mode?
function debug() {
  return !!window.VAC_DEBUG;
}

// Build arguments for console fn, adding prefix
function buildArgs(args) {
  return [LOG_PREFIX].concat(args);
}

// Log message/data
module.exports.log = (...args) => {
  if (!debug()) return;
  console.log.apply(null, buildArgs(args));
};

// Error message/data
module.exports.error = (...args) => {
  if (!debug()) return;
  console.error.apply(null, buildArgs(args));
};

// Info message/data
module.exports.info = (...args) => {
  if (!debug()) return;
  console.info.apply(null, buildArgs(args));
};
