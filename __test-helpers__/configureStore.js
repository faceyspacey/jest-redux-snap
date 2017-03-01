import { createStore } from 'redux'


export default () => {
  const reducer = (state = { num: 0, empty: false }, action = {}) => {
    switch (action.type) {
      case 'INCREMENT':
        return {
          ...state,
          num: state.num + 1,
        }
      case 'EMPTY':
        return {
          ...state,
          empty: true,
        }
      case 'FULL':
        return {
          ...state,
          empty: false,
        }
      default:
        return state
    }
  }

  return createStore(reducer)
}
