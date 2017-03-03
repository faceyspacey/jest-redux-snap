# Jest Redux Snap

*Jest Redux Snap* solves a core problem with testing Redux apps: keeping your components up to date as you take snapshots of them.

It lets you think of the area of your application that you're writing tests for as an `app` object, which you can call `app.dispatch()` and `app.snap()` on any time you want,
all while staying up to date with your Redux store.


## Installation
```bash
yarn add --dev jest-redux-snap
```

## Usage

```javascript
import { createApp } from 'jest-redux-snap'

const store = configureStore() 
const app = createApp(store, MyComponent)

app.snap()

app.dispatch({ type: 'FOO' })

app.snap() // snapshot reflects updated state and component tree!
```

As you can see, it's as simple as creating your app by pairing your store with a component, and then dispatching and snapping at will.

*we also have a simple multi-purpose `snap` function for when you don't plan to dispatch additional actions:*
```javascript
import { snap } from 'jest-redux-snap'
snap(<MyComponent foo='bar' />)
```
*it can snap anything, not just react components*.


## Motivation

There are several challenges when it comes to testing Redux-based reactive components, the biggest being: lifecycle methods like `componentWillReceiveProps` and `shouldComponentUpdate` will
not be called if you don't have a reactively "alive" instance of your app. That means if you go to render it the regular Jest way, 
and take a snapshot of it--even after correctly using a `<Provider />` to provide a `store`, those lifecycle methods won't be called.

For example:

```javascript
import Provider from 'react-redux'
import renderer from 'react-test-renderer'
import configureStore from './configureStore'

const store = configureStore()

const instance = renderer.create(
  <Provider store={store}>
    <MyConnectedComponent />
  </Provider>
)

const tree = instance.toJSON()
expect(tree).toMatchSnapshot()

store.dispatch({ type: 'FOO' })


const instance = renderer.create( // not all lifecycle methods called!
  <Provider store={store}>
    <MyConnectedComponent />
  </Provider>
)
const tree = instance.toJSON()
expect(tree).toMatchSnapshot()
```

Only `componentDidMount` will be called in both calls to `renderer.create()`.`componentWillReceiveProps`, `shouldComponentUpdate` 
and methods such as `componentWillEnter` from `ReactTransitionGroup` will not! 
The reason is because the component tree thinks thinks its being rendered for the first time in both cases. 

There's a few other similar such issues we solve. 

What **Jest Redux Snap** does is let you get down to business and allow you
to think of your `app` as a single reactive unit which you can operate on in the obvious ways (e.g. `snap`, `dispatch`, `getState`, etc).

We like to think **Jest Redux Snap** lets you treat the components your testing as if they are ***"alive"*** and truly reactive.
And of course while "snapping" all along the way.


# API:

## createApp(store, ComponentClass, [props | mapStateToProps])

*no props:*
```javascript
const store = configureStore() // we recommend you have a configureStore function just for tests
const app = createApp(store, MyComponent)
```

*with props:*
```javascript
const store = configureStore() // you can setup state by dispatching actions before its returned
const app = createApp(store, MyComponent, { foo: 'bar' })
```

*with mapStateToProps:*
```javascript
const store = configureStore()
const mapStateToProps = state => ({ foo: state.foo })
const app = createApp(store, MyComponent, mapStateToProps)
```

The idea of `mapStateToProps` is simply that you may be taking snapshots of a component deep within your component tree (i.e. not your `<App />` root component)
and that nested component may be getting props passed to it which are determined from Redux state. So `mapStateToProps` solves that problem.
The props passed to your parent component will stay up to date as you `dispatch` actions against the `store`.

That said, `mapStateToProps` is just a frill feature. The most value you will get from **Jest Redux Snap** is from how even more deeply nested components stay up to date
with the redux store.  


### app.snap()
Take a snapshot of the reactive component contained within `app`. If you `dispatch` any actions on the
store, no more work is required to capture an updated snapshot of the component. Just call `app.snap()` again.

Example:

```javascript
const store = configureStore()
const app = createApp(store, MyComponent)

app.snap()

app.dispatch({ type: 'FOO' })
app.snap()

app.dispatch({ type: 'BAR' })
app.snap()
```

So clearly this is the where using **Jest Redux Snap** pays off. Enjoy!

### app.dispatch()
*Same as `store.dispatch(action)`*. It is available here so you can think of your component as one *atomic unit* known as as `app`.

### app.getState()
*Same as `store.getState()`*

### app.tree()
Equivalent to the following:

```
import renderer from 'react-test-renderer'
const instance = renderer.create(<MyComponent />)
const tree = instance.toJSON()
```

with one important capability: it stays up to date as you dispatch against the `app`'s associated store.

### app.component()
The equivalent of:

```
import renderer from 'react-test-renderer'
const instance = renderer.create(<MyComponent />)
```

But, again, of course it reactively alive! Moo ha ha!!!

### app.element()
**alias: app.story()**

If you passed `MyComponent` to `createApp(store, MyComponent)`, you will be returned from `app.element()`: 

```javascript
<MyComponent foo='bar' />
```

This can be helpful if you want to pass it to `renderer.create()` manually or if you ever want to render your JSX in another context. 

For example [Jest Storybook Facade](https://github.com/faceyspacey/jest-storybook-facade)
allows you to return React elements from your `it` tests to display the components used in your tests in React Storybook!!! Hence,
the alias `app.story()`!

### app.snapState()
The equivalent of: 

```
expect(app.getState()).toMatchSnapshot()
```

### app.snap(action) 🔥
The equivalent of: 

```
expect(action).toMatchSnapshot() // note: it will NOT snapshot thunks
app.dispatch(action)
expect(app.getState()).toMatchSnapshot()
app.snap()
```

So that's 2 or 3 snapshots it will take, depending on whether you supply a thunk or an action object. This is the *BFG 9000* of **Jest Redux Snap**.



## snap(target, [props], [deep = true])

### target: Component Class
```javascript
snap(MyComponent) 
snap(MyComponent, { foo: 'bar' })
```

### target: `<ReactElement />`
```javascript
snap(<MyComponent foo='bar' />)
```

### target: Component Instance
```javascript
import renderer from 'react-test-renderer'
const instance = renderer.create(<MyComponent />)
snap(instance)
```

### target: Component JSON Tree
```javascript
import renderer from 'react-test-renderer'
const instance = renderer.create(<MyComponent />)
const tree = instance.toJSON()
snap(tree)
```

### target: Anything
```javascript
snap({ foo: 'bar' })
snap(123)
```

### props?: Object
`props` can only be second parameter when passing a Component Class as the first argument

### deep?: boolean = true
if `false` is supplied as the final argument, `react-addons-test-utils` will be used to shallowly
render your component instead. For example, if you take the first test in the `__tests__/snap.js` folder 
and you try passing `false` as a third parameter, you will see this difference:

*DEEP SNAPSHOT:* `snap(Target, { className: 'foo' })`
```html
<div>
  <span>
    A TITLE
  </span>
  <div
    className="foo"
    id="shallowComponent"
  />
</div>
```

*SHALLOW SNAPSHOT:* `snap(Target, { className: 'foo' }, false)`
```html
<div>
  <span>
    A TITLE
  </span>
  <ShallowComponent
    className="foo"
  />
</div>
```

So obviously if you pass `false`, the system won't try to traverse imported components, but rather
will just snapshot the props passed to it, in this case: `ShallowComponent`.

This is extremely useful for Jest, because it saves
you from having to mock child components, which in turn saves you from having to create a separate file 
to achieve snapshots of both the mocked and unmocked versions of the child component. 

In other words, using *mocking* in Jest, you *CANNOT* have the same indirectly imported child component/module
*mocked and unmocked within the same file*, since mocks operate statically on an entire-file-basis. 

**Jest Redux Snap** solves that problem, making it "a snap" to capture every "angle" of your components :)


# Recommendation (create a `shoot()` function):
It could look like this (and in fact this is what we use):

```javascript
import { createApp, snap, isClass, isStore } from 'jest-redux-snap'
import configureStore from './configureStore'

export default function shoot(Component, props, ...args) {
  if (!isClass(Component)) {
    return snap(Component)
  }

  const store = isStore(args[0]) ? args[0] : configureStore(...args)
  const app = createApp(store, Component, props)

  app.snap()
  app.snapState()

  return app
}
```

And here is the various ways you could use it:


*no need to provide store*:
```javascript
shoot(MyComponent)
```

```javascript
shoot(MyComponent, { foo: 'bar' })
```

```javascript
const mapState = state => ({ foo: state.foo })
shoot(MyComponent, mapState)
```

*provide store anyway:*
```javascript
const store = configureStore()
shoot(MyComponent, {}, store)
```

*use it to snap anything because you're too lazy to also import `snap`:*

```javascript
shoot({ foo: 'bar' })
shoot(<My Component />)
```

*provide configuration options for configureStore(...args):*
```javascript
const loadUsers = true
const loadOtherEntities = true
shoot(MyComponent, {}, loadUsers, loadOtherEntities)
```

So the idea with the last example is that your `configureStore` function takes arguments that tell it what asyncronous data-loading 
actions to perform, and it does it, returning you a fully stocked store! That way you don't have to worry about setting up your store
throughout your tests. 

You likely have a few ways you commonly fill the store with data. Use the additional `...args` passed to 
`configureStore()` to tell it what asyncronous actions to dispatch. Make sure you have the responses mocked of course. 
