import * as profiler from './common'
import * as _ from '../utils'

// A map from platform names as reported by platform.js to DITA conditions
// (data attribute values).
export var options = {
  mapping: {
    'OS X': 'osx',
    'Windows NT': 'windows',
    'Linux': 'linux'
  }
}

function clickHandler(selectedProfile, event) {
  let newProfile = event.currentTarget
  let platform = options.mapping[newProfile.getAttribute('data-props')]
  selectedProfile.textContent = newProfile.textContent
  profiler.profile('platform', platform)
}

export function initialize(selector, userOptions = {}) {
  options = Object.assign(options, userOptions)

  // Use platform.js to detect current OS.
  let os = platform.os.family

  let div = document.querySelector(selector)
  let ul = div.querySelector('ul')
  let li = ul.querySelectorAll('li')

  let span = document.createElement('span')
  span.classList.add('platform-profiler-selected')

  span.textContent = _.filter(li, el => {
    return el.getAttribute('data-props') === os
  })[0].textContent

  span.addEventListener('mouseenter', event => {
    ul.classList.remove('hidden')
  })

  div.addEventListener('mouseleave', event => {
    ul.classList.add('hidden')
  })

  div.insertBefore(span, ul)

  _.forEach(li, el => {
    el.addEventListener('click', clickHandler.bind(this, span))
  })

  profiler.profile('platform', options.mapping[os])
}
