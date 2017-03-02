# jest-redux-snap

## createApp()

### app.snap()

### app.dispatch()

### app.getState()

### app.tree()

### app.component()

### app.element()
**alias: app.story()**

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

*Jest Redux Snap* solves that problem, making it "a snap" to capture every "angle" of your components :)
