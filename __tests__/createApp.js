import React from 'react'
import renderer from 'react-test-renderer'

import configureStore from '../__test-helpers__/configureStore'
import Component from '../__test-helpers__/ContainerComponent'
import { createApp } from '../src'


describe('createApp(store, Class) ', () => {
  it('app.tree() and app.component().toJSON() updates in response to state changes', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    console.log(app.tree().children)
    app.snap()

    store.dispatch({ type: 'EMPTY' })
    console.log(app.tree().children)
    app.snap()

    store.dispatch({ type: 'INCREMENT' })
    console.log(app.component().toJSON().children)
    app.snap()
  })

  it('app.snap()', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    app.snap()
  })

  it('app.tree()', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    console.log(app.tree())

    expect(app.tree()).toMatchSnapshot()
  })

  it('app.component()', () => {
    const store = configureStore()
    const app = createApp(store, Component)
    const tree = app.component().toJSON()

    expect(tree).toEqual(app.tree())
    expect(tree).toMatchSnapshot()
  })

  it('app.element() [alias: app.story()]', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    const element = renderer.create(app.element()).toJSON()
    const story = renderer.create(app.story()).toJSON()

    console.log(element)
    console.log(story)

    expect(element).toEqual(story)
    expect(app.tree()).toEqual(element)

  })

  it('app.dispatch()', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    app.dispatch({ type: 'EMPTY' })
    app.snap()
  })

  it('app.getState()', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    console.log(app.getState())
    expect(app.getState()).toMatchSnapshot()

    app.dispatch({ type: 'INCREMENT' })

    console.log(app.getState())
    expect(app.getState()).toMatchSnapshot()
  })

  it('app.snapState()', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    app.dispatch({ type: 'INCREMENT' })

    app.snapState()
  })

  it('app.snapAction()', () => {
    const store = configureStore()
    const app = createApp(store, Component)

    app.snapAction({ type: 'INCREMENT' })
  })
})


describe('createApp(store, Class, mapStateToProps)', () => {
  it('mapStateToProps == object', () => {
    const store = configureStore()
    const app = createApp(store, Component, { title: 'FOO' })

    console.log(app.tree().children)
    expect(app.tree().children[0].children[0]).toEqual('FOO')
    expect(app.tree().children[1].children[0]).toEqual(0)
    app.snap()

    app.dispatch({ type: 'INCREMENT' })

    console.log(app.tree().children)
    expect(app.tree().children[0].children[0]).toEqual('FOO')
    expect(app.tree().children[1].children[0]).toEqual(1)
    app.snap()
  })

  it('mapStateToProps == function', () => {
    const store = configureStore()
    const mapState = state => ({ title: `title: ${state.num}` })
    const app = createApp(store, Component, mapState)

    console.log(app.tree().children[0])
    expect(app.tree().children[0].children[0]).toEqual('title: 0')
    expect(app.tree().children[1].children[0]).toEqual(0)
    app.snap()

    app.dispatch({ type: 'INCREMENT' })

    console.log(app.tree().children[0])
    expect(app.tree().children[0].children[0]).toEqual('title: 1')
    expect(app.tree().children[1].children[0]).toEqual(1)
    app.snap()
  })
})
