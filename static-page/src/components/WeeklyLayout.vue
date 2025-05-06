<template>
    <div class="weekly-layout">
      <aside class="sidebar">
        <h3>🧭 分类导航</h3>
        <ul>
          <li
            v-for="cat in categories"
            :key="cat.id"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            <span class="icon">{{ cat.icon }}</span>
            <span class="label">{{ cat.name }}</span>
          </li>
        </ul>
      </aside>
  
      <main class="article-waterfall">
        <div class="masonry">
          <ArticleCard
            v-for="item in filteredArticles"
            :key="item.id"
            :article="item"
          />
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import ArticleCard from './ArticleCard.vue';
  
  const props = defineProps({
    articles: {
      type: Array,
      required: true
    }
  });
  
  const categories = [
    { id: 'highlight_tech', name: '技术亮点', icon: '🚀' },
    { id: 'model_progress', name: '模型进展', icon: '📊' },
    { id: 'product_update', name: '产品更新', icon: '🧩' },
    { id: 'safety_alignment', name: '安全与对齐', icon: '🧠' },
    { id: 'company_news', name: '公司动态', icon: '🗞️' }
  ];
  
  const activeCategory = ref(categories[0].id);
  
  const filteredArticles = computed(() => {
    return props.articles.filter(article => article.ownCategory === activeCategory.value);
  });
  </script>
  
  <style scoped>
  .weekly-layout {
    display: flex;
    padding: 1.5rem;
    gap: 2rem;
  }
  
  .sidebar {
    width: 160px;
    flex-shrink: 0;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
  }
  
  .sidebar li {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .sidebar li.active,
  .sidebar li:hover {
    background-color: #f0f0f0;
  }
  
  .sidebar .icon {
    margin-right: 0.5rem;
  }
  
  .article-waterfall {
    flex: 1;
  }
  
  .masonry {
    column-count: 3;
    column-gap: 1rem;
  }
  
  .ArticleCard,
  .article-card {
    display: inline-block;
    width: 100%;
    break-inside: avoid;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 1024px) {
    .masonry {
      column-count: 2;
    }
  }
  
  @media (max-width: 640px) {
    .weekly-layout {
      flex-direction: column;
    }
  
    .sidebar {
      width: 100%;
      display: flex;
      overflow-x: auto;
    }
  
    .sidebar ul {
      display: flex;
      gap: 0.5rem;
    }
  
    .masonry {
      column-count: 1;
    }
  }
  </style>
  