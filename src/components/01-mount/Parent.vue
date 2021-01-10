<template>
  <div>
    <h1>Parent text</h1>
    <Child />
  </div>
</template>

<script>
import Child from "./Child.vue"

export default {
  name: "Parent",
  components: { Child },
}
</script>
