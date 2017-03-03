import { isStore } from '../src/utils'
import configureStore from '../__test-helpers__/configureStore'


describe('isStore', () => {
  it('true', () => {
    const store = configureStore()
    expect(isStore(store)).toBeTruthy()
  })

  it('false', () => {
    expect(isStore({})).toBeFalsy()
  })
})
