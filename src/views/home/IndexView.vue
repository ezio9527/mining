<template>
  <div class="home-view">
    <HeaderComp v-model:connection="connection"></HeaderComp>
    <MiningComp></MiningComp>
    <DescriptionComp></DescriptionComp>
  </div>
</template>

<script>
import HeaderComp from './HeaderComp'
import MiningComp from './MiningComp'
import DescriptionComp from './DescriptionComp'
import IVYContract from '@/server/IVYContract'
import CakeLPContract from '@/server/CakeLPContract'

export default {
  name: 'HomeView',
  components: {
    HeaderComp,
    MiningComp,
    DescriptionComp
  },
  data () {
    return {
      connection: false
    }
  },
  mounted () {
    window.ethereum.enable().then((accounts) => {
      this.connection = true
      const account = accounts[0]
      const ivyContract = IVYContract.getInstanceof(account)
      const lpContract = CakeLPContract.getInstanceof(account)
      this.$store.commit('contract/setIVYContract', ivyContract)
      this.$store.commit('contract/setCakeLPContract', lpContract)
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
