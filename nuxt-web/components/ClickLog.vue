<template>
    <div class="p-6 font-mono text-xs">
      <div>Clicks: {{ clicks }}</div>
      <div class="mt-2">Executions: {{ executions }}</div>
      <div class="mt-2">
        <div v-for="(time, index) in executionLog.slice().reverse()" :key="index" class="flex py-1 gap-1 items-baseline">
          <div class="shrink-0">{{ time }}</div>
          <div class="w-full border-b-2 border-gray-500 border-dotted rounded-full"></div>
          <div class="text-emerald-500 gap-1 items-center font-bold flex"><Icon name="heroicons:check"/> SUCCESS</div>
        </div>
        <div v-if="executions > executionLog.length" class="mt-2">
          + {{ executions - executionLog.length }} more...
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    executions: number
    clicks: number
    executionLog: string[]
}>()
</script>