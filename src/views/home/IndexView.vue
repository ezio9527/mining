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

export default {
  name: 'HomeView',
  components: {
    HeaderComp,
    MiningComp,
    DescriptionComp
  },
  data () {
    return {
    }
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
