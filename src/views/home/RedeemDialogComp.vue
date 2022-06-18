<template>
  <BaseDialog class="redeem-dialog-comp" v-model:visible="dialogVisible">
    <template #default>
      <van-radio-group v-model="checked" v-show="redeemList.length > 0">
        <van-cell-group inset>
          <van-cell v-for="(item, index) in redeemList" :class="{ checked: checked===index }" @click="checked=index" :key="index">
            <template #title>
              <van-field v-model="inputList[index]" :disabled="checked!==index" :label="$t('home.redeemNumber')"
                         :placeholder="$t('home.redeemNumberPlaceholder')">
                <template #right-icon>
                  <van-radio :name="index"/>
                </template>
              </van-field>
            </template>
            <template #label>
              <span>{{ $t('home.pledgeNumber') + ':' + item }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-empty image="search" description=""  v-show="redeemList.length === 0"/>
      <div>
        <van-button :disabled="disabled" @click="redeem" type="primary" color="#02B202" block>{{
            $t('component.redeem')
          }}
        </van-button>
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
      activeNames: [],
      dialogVisible: false,
      checked: 0,
      redeemList: [], // 需要赎回的item
      inputList: []
    }
  },
  computed: {
    ...mapGetters({
      ivyContract: 'contract/getIVYContract'
    }),
    disabled () {
      const number = this.redeemList[this.checked]
      const input = this.inputList[this.checked]
      return isNaN(Number(input)) || input < 0 || input > number
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
    checked (val) {
      // 清空未选中输入框
      this.inputList = this.inputList.map((item, index) => {
        item = val === index ? this.redeemList[index] : ''
        return item
      })
    },
    ivyContract (val) {
      if (val) {
        this.qry()
      }
    }
  },
  methods: {
    qry () {
      this.ivyContract.getDepositLength().then(res => {
        const promiseList = []
        for (let i = 0; i < res; i++) {
          promiseList.push(this.ivyContract.getDepositDetails({ id: i }))
        }
        Promise.all(promiseList).then(detailsList => {
          this.inputList = []
          this.redeemList = detailsList.map(item => {
            this.inputList.push('')
            return Web3.utils.fromWei(item.tokenAmount)
          })
        }).catch(() => {
          this.qry()
        })
      }).catch(e => {
        this.qry()
      })
    },
    redeem () {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.$toast.loading({
        message: this.$t('common.waiting'),
        duration: 5000,
        forbidClick: true
      })
      this.ivyContract.redeem({
        amount: this.redeemList[this.checked],
        depositId: this.checked
      }).then(result => {
        result.then(() => {
          this.$notify({
            type: 'success',
            message: this.$t('common.redeemSuccess'),
            duration: 5000
          })
        }).catch(() => {
          this.$notify({
            type: 'danger',
            message: this.$t('common.redeemFailed'),
            duration: 5000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'danger',
          message: this.$t('common.redeemFailed'),
          duration: 5000
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.redeem-dialog-comp {
  --van-radio-border-color: var(--primary-color);
  --van-radio-checked-icon-color: var(--primary-color);
  --van-radio-checked-icon-color: var(--primary-color);

  .van-cell.van-field {
    padding-left: 0 !important;
  }

  .van-cell {
    background: none;
  }

  .checked {
    background-color: rgba(76, 194, 144, .1);
  }

  .van-cell-group--inset {
    height: 300px;
    overflow: scroll;
  }
}
</style>
