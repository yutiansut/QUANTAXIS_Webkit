<template>
  <div id="app">
  <mu-appbar title="Title">
    <mu-flat-button color="white" label="QUANTAXIS_SPIDER" slot="left"/> 
    <mu-text-field  class="appbar-search-field"  slot="right" hintText="请输入搜索内容"/>
     
    <mu-icon-button color="white" label="QUANTAXIS_SPIDER" slot="left"/>
    <mu-raised-button label="More"slot="right" @click="toggle()"/>
    <mu-drawer right :open="open" @close="toggle()">
      <mu-appbar title="View"/>
      <mu-list>
        <router-link to='/home'><mu-list-item title="HOME"/></router-link>
        <router-link to='/start'><mu-list-item title="START"/></router-link>
        <router-link to='/todo'><mu-list-item title="TODO"/></router-link>
        <mu-list-item @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>
  </mu-appbar>
    <div class="container">
      <router-view></router-view>
    </div>
            
  </div>
</template>

<script>
import mobileTearSheet from './components/mobile.vue'
export default {
  name: 'app',
  components: {
    'mobile-tear-sheet': mobileTearSheet
  },
   data () {
    return {
      open: false
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    }
  }
  //vm
}
</script>

<style lang='less'>
span.mu-flat-button-label{
  font-size: 28px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

.appbar-search-field{
  color: #FFF;
  margin-bottom: 0;
  &.focus-state {
    color: #FFF;
  }
  .mu-text-field-hint {
    color: fade(#FFF, 54%);
  }
  .mu-text-field-input {
    color: #FFF;
  }
  .mu-text-field-focus-line {
    background-color: #FFF;
  }
}

.mu-raised-button{
  background-color: red;
  color:#FFF;
  }
button.mu-raised-button.hover{
  color:#000000;
}
</style>
