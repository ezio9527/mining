<template>
  <button @click="getWallet">切换钱包</button>
  <button @click="getCurrentWallet">当前钱包信息</button>
  <button @click="ceshi">web3初始化</button>
  <button @click="getBalanceInfo">获取钱包余额</button>
</template>

<script>
import IVYWeb3 from '@/server/IVYWeb3'
import eruda from 'eruda'
import tp from 'tp-js-sdk'
// import IVYContract from '@/server/IVYContract'
export default {
  name: 'IndexView',
  data () {
    return {
      // 钱包地址
      address: ''
    }
  },
  methods: {
    ceshi () {
      const web3 = require('web3')
      console.log(web3.givenProvider)
    },
    // 切换钱包
    getWallet () {
      const params = {
        walletTypes: ['bsc'],
        switch: true
      }
      console.log('切换钱包')
      tp.getWallet(params).then(result => {
        console.log(result)
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        console.log('切换钱包结束')
      })
    },
    // 当前钱包信息
    getCurrentWallet () {
      tp.getCurrentWallet().then(res => {
        if (res.result) {
          this.address = res.data.address
        }
        console.log(res)
      }).catch(e => {
        // console.log(e)
      }).finally(() => {
        // console.log('当前钱包信息结束')
      })
    },
    // web3初始化
    web3 () {
      console.log('web3初始化')
      IVYWeb3.Init().then(account => {
        this.address = account[0]
        this.getBalanceInfo(account[0])
      })
    },
    // 获取钱包余额
    getBalanceInfo () {
      console.log('获取钱包余额')
      IVYWeb3.getBalanceInfo(this.address)
    }
  },
  created () {
    eruda.init()
    // tp.getCurrentWallet().then(res => {
    //   if (res.result) {
    //     this.address = res.data.address
    //     const contract = IVYContract.getInstanceof(res.data.address)
    //     contract.getBalanceInfo(res.data.address)
    //   }
    // })

    // const ADDRESS = '0xb4B037F4Fc64EC9a4668AB3aF2c00b20A8F31db3'
    // const contract = IVYContract.getInstanceof(ADDRESS)
    // contract.getBalanceInfo(ADDRESS)
    // contract.pledge(ADDRESS)
  }
}
</script>

<style scoped>

</style>
