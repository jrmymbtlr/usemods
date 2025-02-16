<template>
  <Example>
    <ExampleInputs>
      <FormInput v-model="threshold" label="Threshold" type="number" />
      <Button @click="handleClick()">Click me</Button>
    </ExampleInputs>

    <ClickLog :executions="executions" :clicks="clicks" :executionLog="executionLog" />

    <ExampleCode :code="`throttle(() => { executions.value++ }, ${threshold})`" />
  </Example>
</template>

<script lang="ts" setup>
const threshold = ref(2000)
const clicks = ref(0)
const executions = ref(0)
const executionLog = ref<string[]>([])

const throttledHandler = computed(() => throttle(() => {
  const currentTime = new Date().toLocaleTimeString()
  executions.value++
  executionLog.value = [...executionLog.value, currentTime].slice(-5)
}, threshold.value))

function handleClick() {
  clicks.value++
  throttledHandler.value()
}
</script>