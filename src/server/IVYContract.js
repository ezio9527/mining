import { IVY_ABI, IVY_ABI_STAKE, IVY_ABI_UNSTAKE, IVY_ABI_PROCESS_REWARDS, IVY_ABI_BALANCE_OF, GET_DEPOSITS_LENGTH, GET_DEPOSIT, POOL_TOKEN_RESERVE, PENDING_YIELD_REWARDS } from '@/server/IVY_ABI'
import Contract from 'web3-eth-contract'
import Web3 from 'web3'
import config from '@data/config.json'

class IVYContract {
  static instanceofObj = null

  static pledgeInstanceofObj = null

  static web3 = null

  // IVY代币地址
  static TOKEN_ADDRESS = config.contract.IVY_Token.address

  // IVY质押挖矿合约地址
  static CONTRACT_ADDRESS = config.contract.IVY.address

  static PROVIDER_LIST = config.wallet.rpcUrls

  /**
   * 获取实例对象
   */
  static getInstanceof (address) {
    if (IVYContract.instanceofObj) {
      return IVYContract.instanceofObj
    } else {
      IVYContract.instanceofObj = new IVYContract(address)
      return IVYContract.instanceofObj
    }
  }

  /**
   * 初始化合约构造器
   * @param address 钱包地址
   */
  constructor (address) {
    const web3Instanceof = new Web3(IVYContract.PROVIDER_LIST[0])
    Contract.setProvider(web3Instanceof.eth.givenProvider)
    IVYContract.web3 = web3Instanceof
    IVYContract.walletAddress = address
    // IVY代币
    this.token = new Contract(IVY_ABI, IVYContract.TOKEN_ADDRESS)
    this.token.options.jsonInterface = IVY_ABI
    this.token.options.address = IVYContract.TOKEN_ADDRESS
    this.token.options.from = address
    // 质押合约
    this.contract = new Contract(IVY_ABI, IVYContract.CONTRACT_ADDRESS)
    this.contract.options.jsonInterface = IVY_ABI
    this.contract.options.address = IVYContract.CONTRACT_ADDRESS
    this.contract.options.from = address
  }

  /**
   * 获取代币余额
   * @param address 钱包地址
   */
  getBalanceInfo (address = IVYContract.walletAddress) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(IVY_ABI_BALANCE_OF)
      address = address.substring(2)
      address = Web3.utils.padLeft(address, 64)
      const data = funcSign + address
      window.ethereum.request({
        method: 'eth_call',
        params: [{
          form: address,
          QUANTITY: 'latest',
          to: IVYContract.TOKEN_ADDRESS,
          data
        }]
      }).then(res => {
        resolve(Web3.utils.fromWei(res))
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 质押
   * @param address
   */
  pledge ({ address = IVYContract.walletAddress, amount, lock = 0, use = false }) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(IVY_ABI_STAKE)
      amount = Web3.utils.toHex(Web3.utils.toWei(amount.toString())).substring(2)
      amount = Web3.utils.padLeft(amount, 64)
      lock = Web3.utils.toHex(Web3.utils.toWei(lock.toString())).substring(2)
      lock = Web3.utils.padLeft(lock, 64)
      use = Web3.utils.toHex(Web3.utils.toWei('0')).substring(2)
      use = Web3.utils.padLeft(use, 64)
      const data = funcSign + amount + lock + use
      this.sendEtherFrom({ data }).then(hash => {
        resolve(hash)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 赎回
   * @param address
   */
  redeem ({ address = IVYContract.walletAddress, amount = 0, depositId = 0, use = false }) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(IVY_ABI_UNSTAKE)
      depositId = Web3.utils.toHex(depositId.toString()).substring(2)
      depositId = Web3.utils.padLeft(depositId, 64)
      amount = Web3.utils.toHex(Web3.utils.toWei(amount.toString())).substring(2)
      amount = Web3.utils.padLeft(amount, 64)
      use = Web3.utils.toHex(Web3.utils.toWei('0')).substring(2)
      use = Web3.utils.padLeft(use, 64)
      const data = funcSign + depositId + amount + use
      this.sendEtherFrom({ data }).then(hash => {
        resolve(hash)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 提取挖矿收益
   */
  pickup (use = false) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(IVY_ABI_PROCESS_REWARDS)
      use = Web3.utils.toHex(Web3.utils.toWei('0')).substring(2)
      use = Web3.utils.padLeft(use, 64)
      const data = funcSign + use
      this.sendEtherFrom({ data }).then(hash => {
        console.log('开始监听交易是否成功')
        resolve(hash)
      }).catch(e => {
        console.log('不监听交易，因为失败了')
        reject(e)
      })
    })
  }

  /**
   * 获取质押列表
   */
  getDepositLength (address = IVYContract.walletAddress) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(GET_DEPOSITS_LENGTH)
      address = address.substring(2)
      address = Web3.utils.padLeft(address, 64)
      const data = funcSign + address
      window.ethereum.request({
        method: 'eth_call',
        params: [{
          form: address,
          QUANTITY: 'latest',
          to: IVYContract.CONTRACT_ADDRESS,
          data
        }]
      }).then(res => {
        resolve(Web3.utils.hexToNumber(res))
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 获取质押详情
   */
  getDepositDetails ({ id, address = IVYContract.walletAddress }) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(GET_DEPOSIT)
      address = address.substring(2)
      address = Web3.utils.padLeft(address, 64)
      id = Web3.utils.toHex(id.toString()).substring(2)
      id = Web3.utils.padLeft(id, 64)
      const data = funcSign + address + id
      window.ethereum.request({
        method: 'eth_call',
        params: [{
          form: address,
          QUANTITY: 'latest',
          to: IVYContract.CONTRACT_ADDRESS,
          data
        }]
      }).then(res => {
        const result = IVYContract.web3.eth.abi.decodeParameters([
          {
            name: 'tokenAmount',
            type: 'uint256'
          },
          {
            name: 'weight',
            type: 'uint256'
          },
          {
            name: 'lockedFrom',
            type: 'uint64'
          },
          {
            name: 'lockedUntil',
            type: 'uint64'
          },
          {
            name: 'isYield',
            type: 'bool'
          }], res)
        resolve(result)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 获取我的质押量
   * @param address
   */
  getPledgeTotal (address = IVYContract.walletAddress) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(IVY_ABI_BALANCE_OF)
      address = address.substring(2)
      address = Web3.utils.padLeft(address, 64)
      const data = funcSign + address
      window.ethereum.request({
        method: 'eth_call',
        params: [{
          form: address,
          QUANTITY: 'latest',
          to: IVYContract.CONTRACT_ADDRESS,
          data
        }]
      }).then(res => {
        resolve(Web3.utils.fromWei(res))
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 获取全部用户质押总量
   * @param address
   */
  getPledgeAllTotal (address = IVYContract.walletAddress) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(POOL_TOKEN_RESERVE)
      const data = funcSign
      window.ethereum.request({
        method: 'eth_call',
        params: [{
          form: address,
          QUANTITY: 'latest',
          to: IVYContract.CONTRACT_ADDRESS,
          data
        }]
      }).then(res => {
        resolve(Web3.utils.fromWei(res))
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 获取挖矿数量
   * @param address
   */
  getMiningNumber (address = IVYContract.walletAddress) {
    return new Promise((resolve, reject) => {
      const funcSign = IVYContract.web3.eth.abi.encodeFunctionSignature(PENDING_YIELD_REWARDS)
      address = address.substring(2)
      address = Web3.utils.padLeft(address, 64)
      const data = funcSign + address
      window.ethereum.request({
        method: 'eth_call',
        params: [{
          form: address,
          QUANTITY: 'latest',
          to: IVYContract.CONTRACT_ADDRESS,
          data
        }]
      }).then(res => {
        resolve(Web3.utils.fromWei(res))
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 计算旷工费
   * @param {Object} address 用户地址
   * @param {Object} data 数据
   * @param {Object} value 转账金额
   */
  getGas ({ data, value = '0x0', from = IVYContract.walletAddress, to = IVYContract.CONTRACT_ADDRESS }) {
    return new Promise((resolve, reject) => {
      // 计算旷工费
      console.log('开始计算旷工费gaslimit')
      window.ethereum.request({
        method: 'eth_estimateGas',
        params: [{
          QUANTITY: 'latest',
          to: IVYContract.CONTRACT_ADDRESS,
          data
        }]
      }).then(gaslimit => {
        console.log('开始计算旷工费gasPrice', gaslimit)
        window.ethereum.request({
          method: 'eth_gasPrice'
        }).then(gasPrice => {
          console.log('gasPrice计算成功')
          resolve({ gaslimit, gasPrice })
        }).catch(e => {
          console.log('gasPrice计算失败')
          resolve({ gaslimit })
        })
      }).catch(e => {
        resolve({})
        console.log('gaslimit计算失败', e)
      })
      // IVYContract.web3.eth.estimateGas({
      //   from,
      //   to,
      //   value,
      //   data: data
      // }).then(gaslimit => {
      //   console.log('开始计算旷工费gasPrice')
      //   IVYContract.web3.eth.getGasPrice().then(gasPrice => {
      //     console.log('gasPrice计算成功')
      //     resolve({ gaslimit, gasPrice })
      //   }).catch(e => {
      //     console.log('gasPrice计算失败')
      //     resolve({ gaslimit })
      //   })
      // }).catch(error => {
      //   resolve({})
      //   console.log('gaslimit计算失败', error)
      // })
    })
  }

  /**
   * 发送交易
   * @param {Object} address 用户地址
   * @param {Object} data 数据
   * @param {Object} value 转账金额
   */
  sendEtherFrom ({ data, value = '0x0', from = IVYContract.walletAddress, to = IVYContract.CONTRACT_ADDRESS }) {
    return new Promise((resolve, reject) => {
      // this.getGas({ data, value, from, to }).then(res => {
      //   // getGas调用结束
      // })
      const parameters = [{
        from,
        to,
        value,
        data: data
        // gasPrice: res.gasPrice,
        // gasLimit: res.gaslimit
      }]
      const payload = {
        method: 'eth_sendTransaction',
        params: parameters,
        from
      }
      window.ethereum.sendAsync(payload, (error, response) => {
        if (error) {
          console.log('发送交易失败', error)
          reject(error)
        }
        if (response.result) {
          resolve(response.result)
        }
      })
    })
  }

  /**
   * 确认交易是否成功
   * @param {String} hash 交易Hash
   */
  getTransactionReceipt (hash) {
    return new Promise((resolve, reject) => {
      let queryTimes = 0
      const timer = setInterval(() => {
        queryTimes++
        window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [hash]
        }).then(res => {
          console.log('交易确认函数-------', res)
          if (res) {
            console.log('交易确认了-------', res.status === 1)
            resolve(res.status === 1)
            clearInterval(timer)
          }
        }).catch(e => {
          console.log(e)
        })
        if (queryTimes > 10) {
          clearInterval(timer)
          queryTimes = 0
          reject(new Error('timeout'))
        }
      }, 2000)
    })
  }
}

export default IVYContract
