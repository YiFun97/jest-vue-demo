<template>
  <div>
    <span v-if="isLogin">{{username}},hello</span>
    <span v-else>hello</span>
  </div>
</template>

<script>
export default {
  name: "PropTest",

  props: {
    username: {
      type: String,
      default: ''
    },
    isLogin: {
      type: Boolean,
      default: false
    }
  }
}
</script>