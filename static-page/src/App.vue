<template>
  <div class="app">
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">加载失败: {{ error }}</div>
    <div v-else class="data-list">
      <WeeklyDigest :data="data" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WeeklyDigest from './components/WeeklyDigest.vue'

const data = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    // 使用 fetch API 获取数据
    //   const response = await fetch('http://localhost:3000/api/v1/article/fetchWeeklyArticles')
    const response = await fetch('/api/v1/article/fetchWeeklyArticles')
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`)
    }

    const res = await response.json()

    data.value = res.data
    console.log('获取到的数据:', data.value)
  } catch (err) {
    error.value = err.message
    console.error('获取数据失败:', err)
  } finally {
    loading.value = false
  }
})

</script>

<style></style>