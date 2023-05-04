(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["threading"] = factory();
	else
		root["threading"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _threadFirst = __webpack_require__(1);

	Object.defineProperty(exports, 'threadFirst', {
	  enumerable: true,
	  get: function get() {
	    return _threadFirst.default;
	  }
	});

	var _threadLast = __webpack_require__(2);

	Object.defineProperty(exports, 'threadLast', {
	  enumerable: true,
	  get: function get() {
	    return _threadLast.default;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value) {
	  for (var _len = arguments.length, operators = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    operators[_key - 1] = arguments[_key];
	  }

	  if (typeof operators === 'undefined') {
	    return value;
	  }

	  return operators.reduce(function (aggregate, operator) {
	    if ((typeof operator === 'undefined' ? 'undefined' : _typeof(operator)) === 'object') {
	      var operatorFn = operator.shift();
	      operator.unshift(aggregate);
	      return operatorFn.apply(undefined, operator);
	    }

	    return operator.call(undefined, aggregate);
	  }, value);
	};

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value) {
	  for (var _len = arguments.length, operators = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    operators[_key - 1] = arguments[_key];
	  }

	  if (typeof operators === 'undefined') {
	    return value;
	  }

	  return operators.reduce(function (aggregate, operator) {
	    if ((typeof operator === 'undefined' ? 'undefined' : _typeof(operator)) === 'object') {
	      var operatorFn = operator.shift();
	      operator.push(aggregate);
	      return operatorFn.apply(undefined, operator);
	    }

	    return operator.call(undefined, aggregate);
	  }, value);
	};

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/***/ }
/******/ ])
});
;