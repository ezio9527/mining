<template>
  <div class="home-view">
    <HeaderComp></HeaderComp>
    <MiningComp></MiningComp>
    <DescriptionComp></DescriptionComp>
  </div>
</template>

<script>
import HeaderComp from './HeaderComp'
import MiningComp from './MiningComp'
import DescriptionComp from './DescriptionComp'
import tp from 'tp-js-sdk'
import IVYContract from '@/server/IVYContract'
import CakeLPContract from '@/server/CakeLPContract'

export default {
  name: 'HomeView',
  components: {
    HeaderComp,
    MiningComp,
    DescriptionComp
  },
  mounted () {
    window.ethereum.enable().then(() => {
      tp.getCurrentWallet().then(res => {
        if (res.result && res.data.blockchain_id === IVYContract.BLOCKCHAIN_ID) {
          const ivyContract = IVYContract.getInstanceof(res.data.address)
          const lpContract = CakeLPContract.getInstanceof(res.data.address)
          this.$store.commit('contract/setIVYContract', ivyContract)
          this.$store.commit('contract/setCakeLPContract', lpContract)
        } else {
          tp.getWallet({
            walletTypes: [IVYContract.WALLET_TYPE],
            switch: true
          })
        }
      }).catch(e => {
        console.log(e)
      })
    })
  }
}
</script>
<style lang="less" scoped>
.home-view {
  background-color: #EFEFEF;
  overflow: hidden;
  .header-comp {
    margin-bottom: 15px;
  }
  .mining-comp {
    margin-bottom: 45px;
  }
}
</style>
