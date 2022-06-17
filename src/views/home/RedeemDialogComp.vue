<template>
  <BaseDialog class="redeem-dialog-comp" v-model:visible="dialogVisible">
    <template #default>
      <van-radio-group v-model="checked">
        <van-cell-group inset>
          <van-cell v-for="(item, index) in redeemList" :class="{ checked: checked===index }" :key="index">
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
      return !Number(input) || input < 0 || input > number
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
        item = val === index ? item : ''
        return item
      })
    },
    ivyContract (val) {
      if (val) {
        this.qry()
        // this.ivyContract.getDepositLength().then(res => {
        //   console.log('个人质押列表长度:', res)
        //   const array = []
        //   this.inputList = []
        //   for (let i = 0; i < res; i++) {
        //     this.ivyContract.getDepositDetails({ id: i }).then(res => {
        //       console.log('质押详情:', res)
        //       array.push(Web3.utils.fromWei(res.tokenAmount))
        //       this.inputList.push('')
        //     }).catch(e => {
        //       console.log('质押详情获取错误++++++++++', e)
        //     })
        //   }
        //   this.redeemList = array
        // }).catch(e => {
        //   console.log('质押获取错误---------', e)
        // })
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
      this.ivyContract.redeem({
        amount: this.redeemList[this.checked],
        depositId: this.checked
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
