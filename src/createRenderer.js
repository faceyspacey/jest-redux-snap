import React from 'react'
import renderer from 'react-test-renderer'
import ReactTestUtils from 'react-addons-test-utils'

import { isClass, isTree, isElement, isInstance } from './utils'
import { DeepRenderer, ShallowRenderer } from './renderer'


export default function createRenderer(Target, props, deep = true) {
  if (typeof props === 'boolean') {
    deep = props
    props = undefined
  }

  if (deep === false) {
    return _createShallowRenderer(Target, props)
  }

  let tree
  let instance

  if (isClass(Target)) {
    instance = renderer.create(<Target {...props} />)
  }
  else if (isTree(Target)) {
    tree = Target
  }
  else if (isElement(Target)) {
    instance = renderer.create(Target)
  }
  else if (isInstance(Target)) {
    instance = Target // note: createApp() always provides an instance
  }
  else {
    tree = Target
  }

  return new DeepRenderer(instance, tree)
}


export function _createShallowRenderer(Target, props) {
  const renderer = ReactTestUtils.createRenderer()

  let tree
  let element

  if (isClass(Target)) {
    element = <Target {...props} />
    renderer.render(element)
  }
  else if (isTree(Target)) {
    tree = Target
  }
  else if (isElement(Target)) {
    element = Target
    renderer.render(element)
  }
  else {
    tree = Target
  }

  return new ShallowRenderer(renderer, element, tree)
}


// ReactTestUtils does not create component instances that play nice with Jest mocks.
// A mocked component passed to ReactTestUtils.createRenderer().render(component)
// will expect there to be no props passed, which defeats its purpose.

const originalError = global.console.error.bind(global.console)

global.console.error = (...args) => {
  const msg = args[0]
  if (msg && msg.indexOf('Unknown prop') > -1) {
    return
  }

  return originalError(...args)
}
