(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _profilerAudience = require('./profiler/audience');

var audienceProfiler = _interopRequireWildcard(_profilerAudience);

var _profilerPlatform = require('./profiler/platform');

var platformProfiler = _interopRequireWildcard(_profilerPlatform);

var _visualization = require('./visualization');

var visualization = _interopRequireWildcard(_visualization);

// $(document).ready()
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function initialize() {
  audienceProfiler.initialize('#introduction');
  platformProfiler.initialize('.platform-profiler');
  visualization.initialize('.metrics');
}

ready(initialize);

},{"./profiler/audience":2,"./profiler/platform":4,"./visualization":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.initialize = initialize;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('../utils');

var _ = _interopRequireWildcard(_utils);

var _common = require('./common');

var profiler = _interopRequireWildcard(_common);

var options = {
  id: 'audience-profiler',
  legend: 'Before we begin, pick the role that best describes you.',
  descriptions: {
    'user': "I don't care about the technical details, I just want to publish things with DITA-OT.",
    'developer': "I'd like to know a bit more about how this thing works."
  }
};

exports.options = options;
// This would be a protocol in Clojure(Script).
function clickHandler(name, event) {
  profiler.profile(name, event.currentTarget.value);
}

function makeProfilerLabel(name, value) {
  var label = document.createElement('label');
  var role = document.createElement('strong');
  var description = document.createElement('span');

  label.setAttribute('for', name);
  role.textContent = _.toTitleCase(value) + '.';
  description.textContent = options.descriptions[value];

  label.appendChild(role);
  label.appendChild(description);

  return label;
}

function makeAudienceProfiler(value, checked) {
  checked = checked || false;

  var name = 'audience';
  var div = document.createElement('div');
  var input = document.createElement('input');

  input.setAttribute('type', 'radio');
  input.setAttribute('id', name);
  input.setAttribute('name', name);
  input.setAttribute('value', value);

  input.addEventListener('click', clickHandler.bind(this, name));

  if (checked) {
    input.setAttribute('checked', 'checked');
  }

  var label = makeProfilerLabel(name, value);

  div.appendChild(input);
  div.appendChild(label);

  return div;
}

function initialize(selector) {
  var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  exports.options = options = Object.assign(options, userOptions);

  var form = document.createElement('form');
  var fieldset = document.createElement('fieldset');
  var legend = document.createElement('legend');

  var user = makeAudienceProfiler('user', true);
  var developer = makeAudienceProfiler('developer');

  legend.textContent = options.legend;

  fieldset.appendChild(legend);
  fieldset.appendChild(user);
  fieldset.appendChild(developer);

  form.setAttribute('id', options.id);
  form.appendChild(fieldset);

  document.querySelector(selector).appendChild(form);

  profiler.profile('audience', 'user');
}

},{"../utils":5,"./common":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.profile = profile;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('../utils');

var _ = _interopRequireWildcard(_utils);

function dataAttributeContainsValue(el, name, value) {
  return el.getAttribute('data-' + name).split(' ').indexOf(value) === -1;
}

function profile(name, value) {
  var elements = document.querySelectorAll('[data-' + name + ']');

  _.forEach(elements, function (el, i) {
    el.classList.toggle('hidden', dataAttributeContainsValue(el, name, value));
  });
}

},{"../utils":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.initialize = initialize;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _common = require('./common');

var profiler = _interopRequireWildcard(_common);

var _utils = require('../utils');

var _ = _interopRequireWildcard(_utils);

// A map from platform names as reported by platform.js to DITA conditions
// (data attribute values).
var options = {
  mapping: {
    'OS X': 'osx',
    'Windows NT': 'windows',
    'Linux': 'linux'
  }
};

exports.options = options;
function clickHandler(selectedProfile, event) {
  var newProfile = event.currentTarget;
  var platform = options.mapping[newProfile.getAttribute('data-props')];
  selectedProfile.textContent = newProfile.textContent;
  profiler.profile('platform', platform);
}

function initialize(selector) {
  var _this = this;

  var userOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  exports.options = options = Object.assign(options, userOptions);

  // Use platform.js to detect current OS.
  var os = platform.os.family;

  var div = document.querySelector(selector);
  var ul = div.querySelector('ul');
  var li = ul.querySelectorAll('li');

  var span = document.createElement('span');
  span.classList.add('platform-profiler-selected');

  span.textContent = _.filter(li, function (el) {
    return el.getAttribute('data-props') === os;
  })[0].textContent;

  span.addEventListener('mouseenter', function (event) {
    ul.classList.remove('hidden');
  });

  div.addEventListener('mouseleave', function (event) {
    ul.classList.add('hidden');
  });

  div.insertBefore(span, ul);

  _.forEach(li, function (el) {
    el.addEventListener('click', clickHandler.bind(_this, span));
  });

  profiler.profile('platform', options.mapping[os]);
}

},{"../utils":5,"./common":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = forEach;
exports.filter = filter;
exports.toTitleCase = toTitleCase;

function forEach(a, fn) {
  return [].forEach.call(a, fn);
}

function filter(a, fn) {
  return [].filter.call(a, fn);
}

function toTitleCase(value) {
  return value.substring(0, 1).toUpperCase() + value.substring(1);
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;

function initialize(selector) {
  d3.json('data.json', function (data) {
    MG.data_graphic({
      title: "With vs. without DITA-OT Gradle Plugin",
      data: data,
      decimals: 1,
      width: 750,
      height: 208,
      right: 50,
      xax_count: 20,
      target: selector,
      area: false,
      x_accessor: "run",
      y_accessor: "duration",
      small_text: true,
      show_tooltip: false,
      legend: ["Without", "With"]
    });
  });
}

},{}]},{},[1]);
