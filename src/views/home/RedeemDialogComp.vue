<template>
  <BaseDialog class="redeem-dialog-comp" v-model:visible="dialogVisible">
    <template #default>
      <van-field v-model="balance" :label="$t('home.pledgeNumber')" disabled/>
      <van-field v-model="number" type="number" :label="$t('home.redeemNumber')" :placeholder="$t('home.redeemNumberPlaceholder')">
        <template #button>
          <van-button plain size="mini" type="primary" color="#02B202" @click="number = balance">{{ $t('component.all') }}</van-button>
        </template>
      </van-field>
      <div>
        <van-button :disabled="disabled" type="primary" color="#02B202" block>{{ $t('component.redeem') }}</van-button>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
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
  computed: {
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
  data () {
    return {
      dialogVisible: false,
      balance: 0,
      number: null
    }
  }
}
</script>

<style lang="less" scoped>
.redeem-dialog-comp {
}
</style>
