const state = () => ({
  message: '',
  level: 0
})

// getters
const getters = {
  getNotice (state) {
    return state.message
  }
}

// mutations
const mutations = {
  setNotice (state, { level, message }) {
    if (Number(level) >= state.level) {
      state.message = message
      state.level = Number(level)
    }
  },
  clearNotice (state, level) {
    if (Number(level) >= state.level) {
      state.message = ''
      state.level = 0
    }
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
  }
}
