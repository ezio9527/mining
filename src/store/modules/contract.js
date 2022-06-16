// 合约
const state = () => ({
  ivyContract: null,
  cakeLPContract: null
})

// getters
const getters = {
  getIVYContract (state) {
    return state.ivyContract
  },
  getCakeLPContract (state) {
    return state.cakeLPContract
  }
}

// mutations
const mutations = {
  setIVYContract (state, contract) {
    state.ivyContract = contract
  },
  setCakeLPContract (state, contract) {
    state.cakeLPContract = contract
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
