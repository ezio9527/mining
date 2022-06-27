<template>
  <BaseDialog class="pledge-dialog-comp" v-model:visible="dialogVisible">
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
import Notice from '@data/notice.json'

export default {
  name: 'PledgeDialogComp',
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
      loading: false,
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
      const number = Number(this.number)
      const balance = Number(this.balance)
      return !number || number <= 0 || number > balance
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
    /**
     * 需要授权的数量
     * @param number
     * @returns {Promise<unknown>}
     */
    approve (number) {
      return new Promise(resolve => {
        // 查询授权
        this.cakeLPContract.allowance().then(num => {
          number = Web3.utils.toWei(number.toString())
          number = Web3.utils.toBN(number.toString())
          num = Web3.utils.toBN(num.toString())
          if (num.gt(number)) {
            resolve()
          } else {
            // 避免精度导致的授权数量不足，影响后续交易失败，这里直接用交易数量请求授权
            this.cakeLPContract.approve(this.number).then(() => {
              this.$toast.success(this.$t('common.approveWaiting'))
            }).finally(() => {
              resolve()
            })
          }
        })
      })
    },
    pledge () {
      this.$store.commit('transaction/setPledge', true)
      this.$store.commit('notice/setNotice', { level: Notice.transaction.level, message: this.$t('common.pledgeIng') })
      this.$emit('update:visible', false)
      this.$emit('close')
      this.$toast.loading({
        message: this.$t('common.waiting'),
        duration: 5000,
        forbidClick: true
      })
      this.approve(this.number).then(() => {
        this.ivyContract.pledge({
          amount: this.number
        }).then(hash => {
          this.ivyContract.getTransactionReceipt(hash).then(() => {
            this.$store.commit('transaction/setPledge', false)
            this.$store.commit('notice/clearNotice', Notice.transaction.level)
            this.$notify({
              type: 'success',
              message: this.$t('common.pledgeSuccess', { number: this.number, symbol: 'LP' }),
              duration: 5000
            })
          }).catch(() => {
            this.$store.commit('transaction/setPledge', false)
            this.$store.commit('notice/clearNotice', Notice.transaction.level)
            this.$notify({
              type: 'danger',
              message: this.$t('common.pledgeFailed'),
              duration: 5000
            })
          })
        }).catch(() => {
          this.$store.commit('transaction/setPledge', false)
          this.$store.commit('notice/clearNotice', Notice.transaction.level)
          this.$notify({
            type: 'danger',
            message: this.$t('common.pledgeFailed'),
            duration: 5000
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pledge-dialog-comp {
}
</style>
