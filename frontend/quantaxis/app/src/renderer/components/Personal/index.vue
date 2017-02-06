<template>
    <div id="index">
        <div id="logo">
            <mu-list>
            <mu-list-item title="yutiansut" disabled >
                <mu-avatar slot="left" :src="myron" />
            </mu-list-item>
            </mu-list>
        </div>
        <div id="personal-content">
            <ul>
                <li>策略收益</li>
                <li>爬虫状况</li>
                <li>回测概览</li>
            </ul>
        </div>
    </div>
</template>
<script>
import myron from '../assets/QUANTAXIS.jpg'
export default {
  data () {
    return {
      myron
    }
  }
}
</script>
<style lang="css">
    #logo{
        width:20%;
        height: 20%;
    }
    #personal-content{
        margin-top: 2%;
    }
</style>