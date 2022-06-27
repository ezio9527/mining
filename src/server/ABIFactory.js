class ABIFactory {
  /**
   * 一个Array的ABI对象
   * @param {Array} json
   */
  constructor (json) {
    this.abi = json
  }

  /**
   * ABI方法名
   * @param {String} name
   */
  getABIByName (name) {
    const arr = this.abi.filter(item => {
      return item.name === name
    })
    if (arr.length > 0) {
      return arr[0]
    } else {
      return {}
    }
  }
}

export default ABIFactory
