<template>
  <div>
  </div>
</template>

<script>
  export default {
    name: "Emitter",

    methods: { 
      emitEvent() {
        this.$emit("myEvent", "name")
      }
    }
  }
</script>

<style scoped>
</style>