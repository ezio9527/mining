<template>
  <BaseDialog class="redeem-dialog-comp" v-model:visible="dialogVisible">
    <template #default>
      <van-field v-model="balance" :label="$t('home.balance', { symbol: 'LP' })" disabled/>
      <van-field v-model="number" type="number" :label="$t('home.pledgeNumber')" :placeholder="$t('home.pledgeNumberPlaceholder')">
        <template #button>
          <van-button plain size="mini" type="primary" color="#02B202" @click="number = balance">{{ $t('component.all') }}</van-button>
        </template>
      </van-field>
      <div>
        <van-button @click="pledge" :disabled="disabled" type="primary" color="#02B202" block>{{ $t('component.pledge') }}</van-button>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import { mapGetters } from 'vuex'
import Web3 from 'web3'
// import Web3 from 'web3'
export default {
  name: 'RedeemDialogComp',
  components: {
    BaseDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      balance: 0,
      number: null
    }
  },
  computed: {
    ...mapGetters({
      cakeLPContract: 'contract/getCakeLPContract',
      ivyContract: 'contract/getIVYContract'
    }),
    disabled () {
      return this.number === null || !Number(this.number) || this.number <= 0 || this.number > this.balance
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
      if (this.cakeLPContract) {
        this.cakeLPContract.getBalanceInfo().then(res => {
          this.balance = res
          console.log('lp余额:', res)
        }).catch(e => {
          console.log(e)
        })
      }
    },
    dialogVisible (val) {
      if (!val) {
        this.$emit('update:visible', false)
        this.$emit('close')
      }
    },
    cakeLPContract (val) {
      if (val) {
        this.cakeLPContract.getBalanceInfo().then(res => {
          this.balance = res
          console.log('lp余额:', res)
        }).catch(e => {
          console.log(e)
        })
      }
    }
  },
  methods: {
    pledge () {
      this.$emit('update:visible', false)
      this.$emit('close')
      // 查询授权
      this.cakeLPContract.allowance().then(number => {
        this.$toast.success(this.$t('common.approveWaiting'))
        if (number >= Web3.utils.toWei(this.number)) {
          this.ivyContract.pledge({
            amount: this.number
          })
        } else {
          this.cakeLPContract.approve(Web3.utils.toWei(this.number) - number).then(() => {
            this.ivyContract.pledge({
              amount: this.number
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.redeem-dialog-comp {
}
</style>
