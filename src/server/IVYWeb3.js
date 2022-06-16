import web3 from 'web3'

class IVYWeb3 {
  static web3 = null

  static contract = null

  /**
   * 初始化
   * @param {Object} callback 返回账户地址
   */
  static Init () {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line new-cap
      IVYWeb3.web3 = new web3(web3.givenProvider)
      if (typeof window.ethereum === 'undefined') {
        reject(new Error('未检测到Web3环境'))
      } else {
        // 如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        window.ethereum.enable().catch(function (reason) {
          // 如果用户拒绝了登录请求
          console.log(reason)
          if (reason === 'User rejected provider access') {
            // 用户不想登录，你看该怎么办？
          } else {
            // 本不该执行到这里，但是真到这里了，说明发生了意外
            // alert("There was an issue signing you in.");
          }
        }).then(accounts => {
          // 返回当前在用的通信服务提供器，如果没有的话则返回null
          // const currentProvider = IVYWeb3.web3.currentProvider
          // eslint-disable-next-line no-undef,new-cap
          // IVYWeb3.web3 = new web3js.getWeb3()
          // 用来修改指定模块的底层通讯服务提供器。
          // web3.setProvider(currentProvider)
          resolve(accounts)
        })
      }
    })
  }

  /**
   * 获取余额
   */
  static getBalanceInfo (address) {
    console.log(IVYWeb3.contract.pendingYieldRewards)
    IVYWeb3.contract.methods.pendingYieldRewards(address).then((res) => {
      console.log('IVY钱包余额', res)
    }).catch(err => {
      console.log('获取钱包余额失败', err)
    })
  }
}

export default IVYWeb3
