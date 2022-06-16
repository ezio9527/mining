import { createStore } from 'vuex'
import contract from './modules/contract'

// const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    contract
  }
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
