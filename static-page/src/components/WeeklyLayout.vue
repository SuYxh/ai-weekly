<template>
  <div class="weekly-page-layout">
    <!-- 移动端分类选择器 -->
    <div class="mobile-category-selector" v-if="isMobile">
      <select v-model="selectedCategory" class="mobile-dropdown">
        <option v-for="category in categoryList" :key="category.id" :value="category.id">
          {{ category.icon }} {{ category.name }}
        </option>
      </select>
    </div>

    <!-- 左侧分类导航 (桌面端) -->
    <aside class="category-nav" v-if="!isMobile">
      <h3 class="nav-title">📡 分类导航</h3>
      <ul>
        <li v-for="category in categoryList" :key="category.id" :class="{ active: selectedCategory === category.id }"
          @click="selectedCategory = category.id">
          <span class="icon">{{ category.icon }}</span>
          <span class="name">{{ category.name }}</span>
        </li>
      </ul>
    </aside>

    <!-- 右侧文章瀑布流展示区 -->
    <main class="article-list">
      <div v-if="filteredArticles.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>暂无内容</h3>
        <p>当前分类下暂时没有文章，请尝试选择其他分类或稍后再来查看。</p>
      </div>
      <MasonryWall v-else :items="filteredArticles" :column-width="isMobile ? 300 : 360" :gap="isMobile ? 12 : 16">
        <template #default="{ item }">
          <ArticleCard :article="item" />
        </template>
      </MasonryWall>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
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
  { id: 'tool', name: '编程工具', icon: '💻' },
];

const selectedCategory = ref(categoryList[0].id);
const isMobile = ref(false);

// 检测设备类型
const checkDeviceType = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 监听窗口大小变化
onMounted(() => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDeviceType);
});

const filteredArticles = computed(() =>
  props.articles.filter((item) => item.ownCategory === selectedCategory.value)
);
</script>

<style scoped>
.weekly-page-layout {
  display: flex;
  padding: 24px 16px;
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

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background-color: #f9f9fb;
  border-radius: 12px;
  width: 100%;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.empty-state p {
  font-size: 14px;
  color: #666;
  max-width: 300px;
  line-height: 1.5;
}


/* 移动端样式 */
.mobile-category-selector {
  width: 100%;
  margin-bottom: 16px;
}

.mobile-dropdown {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  font-size: 16px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .weekly-page-layout {
    flex-direction: column;
    padding: 16px 12px;
    gap: 16px;
  }

  .article-list {
    width: 100%;
  }
}

/* 调整 ArticleCard 在移动端的宽度 */
@media (max-width: 768px) {
  :deep(.article-card) {
    max-width: 100% !important;
  }
}
</style>