<template>
  <div class="header-comp">
    <div class="header-comp_background"></div>
    <div class="header-comp_container">
      <div class="header-comp-container_top">
        <div>
          <img class="header-container-top_logo" src="@img/logo.png">
          <span>IVY</span>
        </div>
        <div>
          <button @click="connect">{{ $t('home.connect') }}</button>
          <van-dropdown-menu>
            <van-dropdown-item v-model="lang" :options="langList" @change="languageSelect"/>
          </van-dropdown-menu>
        </div>
      </div>

      <div class="header-comp-container_panel">
        <div><span>{{ $t('home.issue') }}:</span><span>{{ TOTAL }}</span></div>
        <div><span>{{ $t('home.contract', { symbol: 'BSC'}) }}:</span><span>000000000</span></div>
        <img src="@img/home/flower.png">
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import tp from 'tp-js-sdk'
import IVYContract from '@/server/IVYContract'

export default {
  name: 'HeaderComp',
  data () {
    return {
      TOTAL: 10000 // 发行总量
    }
  },
  methods: {
    // 语言切换
    languageSelect (language) {
      localStorage.setItem('language', language)
      this.locale = language
    },
    // 链接IVY钱包
    connect () {
      tp.getWallet({
        walletTypes: [IVYContract.WALLET_TYPE],
        switch: true
      })
    }
  },
  setup () {
    const lang = ref('zh')
    const langList = [
      { text: '中文', value: 'zh' },
      { text: '繁體', value: 'tw' },
      { text: 'English', value: 'en' }
    ]
    const { locale } = useI18n({ useScope: 'global' })
    return {
      locale,
      lang,
      langList
    }
  }
}
</script>

<style>
.van-dropdown-menu {
  display: inline-block;
  --van-dropdown-menu-height: 26px;
  --van-gray-4: #FFFFFF;
  --van-dropdown-menu-background-color: transparent;
  --van-dropdown-menu-title-text-color: #FFFFFF;
  --van-dropdown-menu-box-shadow: none;
  --van-dropdown-menu-option-active-color: var(--primary-color);
  --van-dropdown-menu-title-active-text-color: #FFFFFF;
}
</style>
<style lang="less" scoped>
.header-comp {
  position: relative;
  .header-comp_container {
    position: relative;
    z-index: 1;
    width: 340px;
    margin: auto;
    padding-top: 22px;
    .header-comp-container_top {
      display: flex;
      justify-content: space-between;
      .header-container-top_logo {
        width: 32px;
        height: 32px;
      }
      span {
        color: #FFFFFF;
        font-size: 24px;
        font-weight: 600;
        margin-left: 8px;
      }
      button {
        border: none;
        background-color: rgba(255,255,255, 0.4);
        color: #FFFFFF;
        padding: 4px 8px;
        border-radius: 6px;
        margin-right: 6px;
      }
    }
    //发行总量
    .header-comp-container_panel {
      position: relative;
      margin-top: 15px;
      line-height: 26px;
      text-align: left;
      color: var(--primary-color);
      padding: 10px 20px;
      background-color: #FFFFFF;
      border-radius: var(--mining-radius);
      &>div>span:first-child {
        margin-right: 10px;
      }
      img {
        position: absolute;
        right: 0;
        bottom: 0;
        height: 100%;
      }
    }
  }
  //圆弧背景色块
  .header-comp_background {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 120px;
    overflow: hidden;
    background-color: var(--primary-color);
  }
}
</style>
