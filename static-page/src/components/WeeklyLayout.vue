<template>
    <div class="weekly-page-layout">
      <!-- 左侧分类导航 -->
      <aside class="category-nav">
        <h3 class="nav-title">📡 分类导航</h3>
        <ul>
          <li
            v-for="category in categoryList"
            :key="category.id"
            :class="{ active: selectedCategory === category.id }"
            @click="selectedCategory = category.id"
          >
            <span class="icon">{{ category.icon }}</span>
            <span class="name">{{ category.name }}</span>
          </li>
        </ul>
      </aside>
  
      <!-- 右侧文章瀑布流展示区 -->
      <main class="article-list">
        <MasonryWall :items="filteredArticles" :column-width="360" :gap="16">
          <template #default="{ item }">
            <ArticleCard :article="item" />
            <!-- <ArticleCard :articles="item" /> -->
          </template>
        </MasonryWall>
      </main>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import MasonryWall from '@yeger/vue-masonry-wall';
  import ArticleCard from './ArticleCard.vue';
  
  const props = defineProps({
    articles: {
      type: Array,
      required: true,
    },
  });
  
  const categoryList = [
    { id: 'highlight_tech', name: '技术亮点', icon: '🚀' },
    { id: 'model_progress', name: '模型进展', icon: '📊' },
    { id: 'product_update', name: '产品更新', icon: '🧩' },
    { id: 'safety_alignment', name: '安全与对齐', icon: '🧠' },
    { id: 'company_news', name: '公司动态', icon: '🗞️' },
  ];
  
  const selectedCategory = ref(categoryList[0].id);
  
  const filteredArticles = computed(() =>
    props.articles.filter((item) => item.ownCategory === selectedCategory.value)
  );
  </script>
  
  <style scoped>
  .weekly-page-layout {
    display: flex;
    padding: 24px 32px;
    gap: 32px;
  }
  
  .category-nav {
    width: 180px;
    flex-shrink: 0;
    position: sticky;
    top: 24px;
    align-self: flex-start;
  }
  
  .nav-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 16px;
    padding-left: 8px;
  }
  
  .category-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .category-nav li {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .category-nav li.active {
    background-color: #e0e7ff;
    font-weight: bold;
  }
  
  .category-nav li:hover {
    background-color: #f4f4f5;
  }
  
  .icon {
    margin-right: 8px;
    width: 24px;
    display: inline-block;
    text-align: center;
  }
  
  .name {
    flex: 1;
  }
  
  .article-list {
    flex: 1;
    min-width: 0;
  }
  </style>