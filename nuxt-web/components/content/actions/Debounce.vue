<template>
  <Example>
    <ExampleInputs>
      <FormInput v-model="delay" label="Delay" type="number" />
      <Button @click="handleClick" color="secondary">Click me</Button>
    </ExampleInputs>

    <ClickLog :executions="executions" :clicks="clicks" :executionLog="executionLog" />
    <ExampleCode :code="`debounce(() => { executions.value++ }, ${delay})`" />
  </Example>
</template>

<script lang="ts" setup>
import { onUnmounted } from 'vue'

const delay = ref(500)
const clicks = ref(0)
const executions = ref(0)
const executionLog = ref<string[]>([])

// Create a stable debounced function that updates when delay changes
const debouncedHandler = computed(() => {
  const handler = debounce(() => {
    executions.value++
    executionLog.value = executionLog.value.slice(-4) // Keep last 4 entries
    executionLog.value.push(new Date().toLocaleTimeString())
  }, delay.value)
  
  // Clean up the previous debounced function when delay changes
  onUnmounted(() => handler.cancel?.())
  
  return handler
})

function handleClick() {
  clicks.value++
  debouncedHandler.value()
}
</script>