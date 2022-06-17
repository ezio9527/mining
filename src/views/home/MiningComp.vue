<template>
  <div class="mining-comp">
    <img class="mining-comp_bg" src="@img/home/bg.png">
    <div class="mining-comp_title mining-comp_line">
      <img src="@img/home/shovel.png"><span>{{ $t('home.mining', { symbol: 'LP' }) }}</span>
    </div>
    <div class="mining-comp_line">{{ $t('home.miningVol') }}</div>
    <div class="mining-comp_line mining-comp_total">{{ miningAllTotal }}</div>
    <div class="mining-comp_line mining-comp-line_align"><span>{{ $t('home.pledgeTotal', { symbol: 'LP' }) }}</span><span>{{ pledgeTotal }}</span></div>
    <div class="mining-comp_line mining-comp-line_align"><span>{{ $t('home.pledgeMineTotal', { symbol: 'LP' }) }}</span><span>{{ pledgeVol }}</span></div>
    <div class="mining-comp_line mining-comp-line_align"><span>{{ $t('home.miningTotal') }}</span><span>{{ MINING_TOTAL }}</span></div>
    <div class="mining-comp_line mining-comp-line_align"><span>{{ $t('home.miningMineTotal') }}</span><span>{{ miningVol }}</span></div>
    <div class="mining-comp_button-group">
      <BaseButton :checked="selected===SELECTED_PLEDGE" @click="pledge">{{ $t('component.pledge') }}</BaseButton>
      <BaseButton :checked="selected===SELECTED_PICKUP" @click="pickup">{{ $t('component.pickup') }}</BaseButton>
      <BaseButton :checked="selected===SELECTED_REDEEM" @click="redeem">{{ $t('component.redeem') }}</BaseButton>
    </div>

    <PledgeDialogComp v-model:visible="pledgeDialog" @close="selected=''"></PledgeDialogComp>
    <PickupDialogComp v-model:visible="pickupDialog" @close="selected=''"></PickupDialogComp>
    <RedeemDialogComp v-model:visible="redeemDialog" @close="selected=''"></RedeemDialogComp>
  </div>
</template>

<script>
import BaseButton from '@comp/BaseButton'
import PledgeDialogComp from './PledgeDialogComp'
import PickupDialogComp from './PickupDialogComp'
import RedeemDialogComp from './RedeemDialogComp'
import { mapGetters } from 'vuex'
export default {
  name: 'MiningComp',
  components: {
    BaseButton,
    PledgeDialogComp,
    PickupDialogComp,
    RedeemDialogComp
  },
  computed: {
    ...mapGetters({
      miningAllTotal: 'contract/getMiningAllTotal',
      miningVol: 'contract/getMiningVol',
      pledgeVol: 'contract/getPledgeVol',
      pledgeTotal: 'contract/getPledgeTotal'
    })
  },
  data () {
    return {
      MINING_TOTAL: 6000, // 挖矿总量
      pledgeDialog: false,
      pickupDialog: false,
      redeemDialog: false,
      SELECTED_PLEDGE: 'pledge',
      SELECTED_PICKUP: 'pickup',
      SELECTED_REDEEM: 'redeem',
      selected: ''
    }
  },
  methods: {
    pledge () {
      this.selected = this.SELECTED_PLEDGE
      this.pledgeDialog = true
      this.pickupDialog = false
      this.redeemDialog = false
    },
    pickup () {
      this.selected = this.SELECTED_PICKUP
      this.pledgeDialog = false
      this.pickupDialog = true
      this.redeemDialog = false
    },
    redeem () {
      this.selected = this.SELECTED_REDEEM
      this.pledgeDialog = false
      this.pickupDialog = false
      this.redeemDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.mining-comp {
  position: relative;
  width: 340px;
  margin: auto;
  background-color: var(--primary-color);
  border-radius: var(--mining-radius);
  color: #FFFFFF;
  padding: 20px;
  text-align: left;
  //背景
  .mining-comp_bg {
    position: absolute;
    z-index: 0;
    width: 340px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  //行样式
  .mining-comp_line {
    line-height: 40px;
    font-size: 14px;
    position: relative;
    z-index: 1;
  }
  .mining-comp-line_align {
    display: flex;
    justify-content: space-between;
  }
  .mining-comp_title {
    font-size: 18px;
    img {
      width: 20px;
      margin-right: 10px;
    }
  }
  .mining-comp_total {
    font-size: 22px;
  }
  .mining-comp_button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    position: relative;
    z-index: 1;
  }
}
</style>
