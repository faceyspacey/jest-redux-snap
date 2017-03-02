import React from 'react'
import renderer from 'react-test-renderer'

import DeepComponent from '../__test-helpers__/DeepComponent'
import ShallowComponent from '../__test-helpers__/ShallowComponent'

import { snap } from '../src'


describe('snap(target, props) - deep', () => {
  const Target = DeepComponent

  it('target == class', () => {
    const app = snap(Target, { className: 'foo' })

    console.log(app.tree())
    console.log(app.component())
  })

  it('target == tree', () => {
    const target = renderer.create(<Target className='baz' />).toJSON()
    const app = snap(target)

    console.log(app.tree())

    expect(app.component()).not.toBeDefined()
  })

  it('target == element', () => {
    const target = <Target className='bar' />
    const app = snap(target)

    console.log(app.tree())
  })

  it('target == instance', () => {
    const target = renderer.create(<Target className='baz' />)
    const app = snap(target)

    console.log(app.tree())

    expect(app.component()).toEqual(target)
  })

  it('target == any', () => {
    const target = { plain: 'object' }
    const app = snap(target)

    console.log(app.component())
    console.log(app.tree())

    expect(app.component()).not.toBeDefined()
  })
})


describe('snap(target, props, false) - shallow', () => {
  const Target = ShallowComponent

  it('target == class', () => {
    const app = snap(Target, { className: 'foo' }, false)

    console.log(app.tree())
    expect(app.component()).toEqual(<Target className='foo' />)
  })

  it('target == tree', () => {
    const target = renderer.create(<Target className='baz' />).toJSON()
    const app = snap(target, false)

    console.log(app.tree())

    expect(app.component()).not.toBeDefined()
  })

  it('target == element', () => {
    const target = <Target className='bar' />
    const app = snap(target, false)

    console.log(app.tree())
    expect(app.component()).toEqual(target)
})

  it('target == any', () => {
    const target = { plain: 'object' }
    const app = snap(target, false)

    console.log(app.component())
    console.log(app.tree())

    expect(app.component()).not.toBeDefined()
  })
})
