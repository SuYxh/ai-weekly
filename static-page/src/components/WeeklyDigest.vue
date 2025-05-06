<!-- WeeklyDigest.vue -->
<template>
    <div class="weekly-digest">
      <div class="categories" v-if="categories.length">
        <h3>📂 分类导航</h3>
        <ul>
          <li
            v-for="cat in categories"
            :key="cat.key"
            :class="{ active: cat.key === selectedCategory }"
            @click="selectedCategory = cat.key"
          >
            {{ cat.icon }} {{ cat.label }}
          </li>
        </ul>
      </div>
  
      <div class="articles">
        <ArticleCard
          v-for="article in filteredArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import ArticleCard from './ArticleCard.vue';
  
  const props = defineProps({
    data: Array,
  });
  
  const categoryMap = {
    highlight_tech: { label: '技术亮点', icon: '🚀' },
    model_progress: { label: '模型进展', icon: '📊' },
    product_update: { label: '产品更新', icon: '🧩' },
    safety_alignment: { label: '安全与对齐', icon: '🧠' },
    company_news: { label: '公司动态', icon: '📰' },
  };
  
  const selectedCategory = ref('highlight_tech');
  
  const categories = Object.entries(categoryMap).map(([key, val]) => ({
    key,
    ...val,
  }));
  
  const filteredArticles = computed(() => {
    console.log('filteredArticles',props)

    const list = props.data.filter((a) => a.ownCategory === selectedCategory.value && a.isWeekly)

    return list
  });
  </script>
  
  <style scoped>
  .weekly-digest {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    padding: 2rem;
  }
  
  .categories {
    min-width: 200px;
  }
  
  .categories ul {
    list-style: none;
    padding: 0;
  }
  
  .categories li {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background 0.3s;
  }
  
  .categories li:hover,
  .categories li.active {
    background: #f0f0f0;
    font-weight: bold;
  }
  
  .articles {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  </style>
  