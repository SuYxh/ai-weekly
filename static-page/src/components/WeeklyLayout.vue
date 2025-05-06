<template>
    <div class="weekly-layout">
      <div class="sidebar">
        <div
          class="category"
          v-for="category in categories"
          :key="category.id"
          :class="{ active: category.id === activeCategory }"
          @click="activeCategory = category.id"
        >
          <span class="icon">{{ category.icon }}</span>
          <span class="name">{{ category.name }}</span>
        </div>
      </div>
  
      <div class="content">
        <div class="card-list">
          <ArticleCard
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ArticleCard from './ArticleCard.vue';
  
  export default {
    name: 'WeeklyPageLayout',
    components: { ArticleCard },
    props: {
      articleList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        activeCategory: 'highlight_tech'
      };
    },
    computed: {
      categories() {
        return [
          { id: 'highlight_tech', name: '技术亮点', icon: '🚀' },
          { id: 'model_progress', name: '模型进展', icon: '📊' },
          { id: 'product_update', name: '产品更新', icon: '🧩' },
          { id: 'safety_alignment', name: '安全与对齐', icon: '🧠' },
          { id: 'company_news', name: '公司动态', icon: '🗞️' }
        ];
      },
      filteredArticles() {
        return this.articleList.filter(
          (a) => a.ownCategory === this.activeCategory && a.isWeekly
        );
      }
    }
  };
  </script>
  
  <style scoped>
  .weekly-layout {
    box-sizing: border-box;
    display: flex;
    width: 90vw;
    height: 100vh;
    overflow: auto;
    margin: 0 auto;
    padding: 16px;
  }
  
  .sidebar {
    flex: 0 0 180px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 16px;
    border-right: 1px solid #ddd;
    min-height: 80vh;
  }
  
  .category {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  .category.active {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  .category .icon {
    margin-right: 6px;
  }
  
  .content {
    flex: 1;
    padding-left: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    width: 100%;
  }
  </style>
  