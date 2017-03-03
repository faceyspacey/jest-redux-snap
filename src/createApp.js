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

  addMethods(app, store, element)

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

  app.snap = (action) => {
    if (!action) {
      expect(app.tree()).toMatchSnapshot()
    }
    else {
      const actionShot = typeof action !== 'function' ? action : 'thunk'
      snap(actionShot)

      store.dispatch(action)
      snap(store.getState())
      app.snap()
    }

    return app
  }

  app.snapState = () => snap(app.getState())
}
