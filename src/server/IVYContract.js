import Web3 from 'web3'
import config from '@data/config.json'
import abi from '@data/ABI_IVY.json'
import BaseContract from '@/server/BaseContract'

class IVYContract extends BaseContract {
  /**
   * abi方法名
   * @type {string}
   */
  static ABI_NAME_STAKE = 'stake'
  static ABI_NAME_UN_STAKE = 'unstake'
  static ABI_NAME_PROCESS_REWARDS = 'processRewards'

  /**
   * 初始化合约构造器
   * @param {String} walletAddress 钱包地址
   */
  constructor (walletAddress) {
    super(abi, walletAddress, config.contract.IVY.address)
  }

  /**
   * 质押
   */
  pledge ({ amount, lock = 0, use = false }) {
    let num = Web3.utils.toWei(amount.toString())
    num = Web3.utils.toHex(num)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(IVYContract.ABI_NAME_STAKE)
      const data = this.signature({
        func: abi,
        params: [
          num,
          lock,
          use
        ]
      })
      this.sendEtherFrom({ data }).then(hash => {
        resolve(hash)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 赎回
   * @param {number} amount 赎回数量
   * @param {number} depositId 赎回id
   * @param {boolean} use
   */
  redeem ({ amount = 0, depositId = 0, use = false }) {
    let num = Web3.utils.toWei(amount.toString())
    num = Web3.utils.toHex(num)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(IVYContract.ABI_NAME_UN_STAKE)
      const data = this.signature({
        func: abi,
        params: [
          depositId,
          num,
          use
        ]
      })
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
      const abi = this.getABI(IVYContract.ABI_NAME_PROCESS_REWARDS)
      const data = this.signature({
        func: abi,
        params: [
          use
        ]
      })
      this.sendEtherFrom({ data }).then(hash => {
        resolve(hash)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * 获取质押列表
   */
  getDepositLength (address = this.contract.options.from) {
    return new Promise((resolve, reject) => {
      this.contract.methods.getDepositsLength(address).call({
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 获取质押详情
   */
  getDepositDetails ({ id, address = this.contract.options.from }) {
    return new Promise((resolve, reject) => {
      this.contract.methods.getDeposit(address, id).call({
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 获取全部用户质押总量
   * @param address
   */
  getPledgeAllTotal (address = this.contract.options.from) {
    return new Promise((resolve, reject) => {
      this.contract.methods.poolTokenReserve().call({
      }).then(res => {
        resolve(Web3.utils.fromWei(res))
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 获取挖矿数量
   * @param address
   */
  getMiningNumber (address = this.contract.options.from) {
    return new Promise((resolve, reject) => {
      this.contract.methods.pendingYieldRewards(address).call({
      }).then(res => {
        resolve(Web3.utils.fromWei(res))
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default IVYContract
