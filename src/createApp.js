import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'

import createRenderer from './createRenderer'
import snap from './snap'


export default (store, ReactComponentClass, mapStateToProps) => {
  let wrapper

  store.subscribe(() => {
    wrapper.forceUpdate()
  })

  const element =
    <Provider store={store}>
      <ReactiveWrapper
        ref={wr => wrapper = wr}
        store={store}
        Component={ReactComponentClass}
        mapStateToProps={mapStateToProps}
      />
    </Provider>

  const instance = renderer.create(element)
  const app = createRenderer(instance)

  addMethods(app, store, instance)

  return app
}


class ReactiveWrapper extends React.Component {
  render() {
    const { store, Component, mapStateToProps } = this.props

    const props = typeof mapStateToProps === 'function'
      ? mapStateToProps(store.getState(), store.dispatch)
      : mapStateToProps // object or undefined

    return <Component {...props} />
  }
}


const addMethods = (app, store, element) => {
  app.element = () => element
  app.story = () => element

  app.getState = () => store.getState()
  app.dispatch = action => store.dispatch(action)

  app.snapAction = (action) => {
    if (typeof action !== 'function') {
      snap(action)
    }

    store.dispatch(action)
    snap(store.getState())
    app.snap()
  }

  app.snapState = () => snap(app.getState())
}
