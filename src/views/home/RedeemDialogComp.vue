<template>
  <BaseDialog class="redeem-dialog-comp" v-model:visible="dialogVisible">
    <template #default>
      <van-radio-group v-model="checked">
        <van-cell-group inset>
          <van-cell :title="$t('home.pledgeNumber') + ':' + item"  v-for="(item, index) in redeemList" :key="index">
            <template #right-icon>
              <van-radio :name="index" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div>
        <van-button @click="redeem" type="primary" color="#02B202" block>{{ $t('component.redeem') }}</van-button>
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
      checked: 0,
      redeemList: []
    }
  },
  computed: {
    ...mapGetters({
      ivyContract: 'contract/getIVYContract'
    }),
    disabled () {
      return this.redeemList.length === 0
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
    },
    ivyContract (val) {
      if (val) {
        this.ivyContract.getDepositLength().then(res => {
          console.log('个人质押列表长度:', res)
          const array = []
          for (let i = 0; i < res; i++) {
            this.ivyContract.getDepositDetails({ id: i }).then(res => {
              console.log('质押详情:', res)
              array.push(Web3.utils.fromWei(res.tokenAmount))
            }).catch(e => {
              console.log(e)
            })
          }
          this.redeemList = array
        }).catch(e => {
          console.log(e)
        })
      }
    }
  },
  methods: {
    redeem () {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.ivyContract.redeem({ amount: this.redeemList[this.checked], depositId: this.checked })
    }
  }
}
</script>

<style scoped>
.redeem-dialog-comp {
  --van-radio-border-color: var(--primary-color);
  --van-radio-checked-icon-color: var(--primary-color);
  --van-radio-checked-icon-color: var(--primary-color);
}
</style>
