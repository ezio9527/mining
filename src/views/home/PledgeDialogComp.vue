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
      number: null
    }
  },
  computed: {
    ...mapGetters({
      cakeLPContract: 'contract/getCakeLPContract',
      ivyContract: 'contract/getIVYContract',
      balance: 'contract/getLpBalance'
    }),
    disabled () {
      return this.number === null || !Number(this.number) || this.number <= 0 || this.number > this.balance
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      if (!val) {
        this.$emit('update:visible', false)
        this.$emit('close')
      }
    }
  },
  methods: {
    pledge () {
      this.$emit('update:visible', false)
      this.$emit('close')
      // 查询授权
      this.cakeLPContract.allowance().then(number => {
        if (number >= Web3.utils.toWei(this.number)) {
          this.ivyContract.pledge({
            amount: this.number
          })
        } else {
          this.cakeLPContract.approve(Web3.utils.toWei(this.number) - number).then(() => {
            this.$toast.success(this.$t('common.approveWaiting'))
          }).finally(() => {
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
