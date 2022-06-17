<template>
  <BaseDialog class="pickup-dialog-comp" v-model:visible="dialogVisible">
    <template #default>
      <van-field v-model="miningVol" :label="$t('home.miningNumber')" disabled/>
      <!--<van-field v-model="miningVol" type="number" :label="$t('home.pickupNumber')" :placeholder="$t('home.pickupNumberPlaceholder')">-->
      <!--  <template #button>-->
      <!--    <van-button plain size="mini" type="primary" color="#02B202" @click="number = balance">{{ $t('component.all') }}</van-button>-->
      <!--  </template>-->
      <!--</van-field>-->
      <div>
        <van-button @click="pickup" type="primary" color="#02B202" block>{{ $t('component.pickup') }}</van-button>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'PickupDialogComp',
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
    ...mapGetters({
      ivyContract: 'contract/getIVYContract',
      miningVol: 'contract/getMiningVol'
    })
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
      dialogVisible: false
    }
  },
  methods: {
    pickup () {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.ivyContract.pickup()
    }
  }
}
</script>

<style lang="less" scoped>
.pickup-dialog-comp {
}
</style>
