<template>
    <div class="data-container">
      <h2>API 数据展示</h2>
      <div v-if="loading">加载中...</div>
      <div v-else-if="error">加载失败: {{ error }}</div>
      <div v-else class="data-list">
        <div v-for="(item, index) in data" :key="index" class="data-item">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
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
    } catch (err) {
      error.value = err.message
      console.error('获取数据失败:', err)
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .data-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .data-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .data-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  h3 {
    margin-top: 0;
    color: #2c3e50;
  }
  </style>