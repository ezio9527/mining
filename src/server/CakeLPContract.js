import config from '@data/config.json'
import abi from '@data/ABI_CakeLP.json'
import BaseContract from '@/server/BaseContract'
import Web3 from 'web3'

class CakeLPContract extends BaseContract {
  /**
   * abi方法名
   * @type {string}
   */
  static ABI_NAME_APPROVE = 'approve'

  /**
   * 初始化合约构造器
   * @param {String} walletAddress 钱包地址
   */
  constructor (walletAddress) {
    super(abi, walletAddress, config.contract.Cake_LP.address)
    // 指定授权目标合约
    this.approveTargetContract = config.contract.IVY.address
  }

  /**
   * 授权
   * @param {Number} number lp数量
   */
  approve (number) {
    let num = Web3.utils.toWei(number.toString())
    num = Web3.utils.toHex(num)
    return new Promise((resolve, reject) => {
      const abi = this.getABI(CakeLPContract.ABI_NAME_APPROVE)
      const data = this.signature({
        func: abi,
        params: [
          this.approveTargetContract,
          Web3.utils.toHex(num)
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
   * 查询授权
   */
  allowance () {
    return new Promise((resolve, reject) => {
      this.contract.methods.allowance(this.contract.options.from, this.approveTargetContract).call({
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default CakeLPContract
