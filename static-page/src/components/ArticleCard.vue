<template>
  <div class="article-card">
    <img :src="coverImage" alt="封面图" class="cover" />
    <div class="meta">
      <span class="platform">{{ article.platform }}</span>
      <span class="date">{{ formatDate(article.date) }}</span>
    </div>
    <h3 class="title">{{ article.title }}</h3>
    
    <div class="summary-container">
      <div class="summary-label">📄 摘要</div>
      <div class="summary" :class="{ 'expanded': isExpanded }">{{ displayText }}</div>
      <div v-if="isTruncated" class="expand-btn" @click="toggleExpand">
        {{ isExpanded ? '收起' : '展开全文' }}
      </div>
    </div>

    <div class="tags" v-if="article.tags?.length">
      <span class="tag" v-for="tag in article.tags" :key="tag">{{ tag }}</span>
    </div>

    <a class="link" :href="article.link" target="_blank" rel="noopener noreferrer">
      🔗 阅读原文
    </a>

    <transition name="fade-slide">
      <div class="reason-container" v-if="article.reason">
        <div class="reason-label">🔍 推荐理由</div>
        <div class="reason">{{ article.reason }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isExpanded: false,
      isTruncated: false
    }
  },
  computed: {
    coverImage() {
      const media = this.article.media;
      return media?.length ? media[0].url : 'https://qn.huat.xyz/mac/202505061130521.png';
    },
    displayText() {
      return this.article.summary || this.article.content || '暂无简介';
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    }
  },
  mounted() {
    // 检查文本是否需要截断
    const summaryText = this.displayText;
    if (summaryText.length > 150) {
      this.isTruncated = true;
    }
  }
};
</script>

<style scoped>
.article-card {
  width: 100%;
  /* max-width: 23vw; */
  max-width: 30vw;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
  background: #f5f5f5;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.summary-container {
  margin-bottom: 12px;
}

.summary-label {
  font-size: 13px;
  font-weight: 600;
  color: #4285f4;
  margin-bottom: 4px;
}

.summary {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.summary:not(.expanded) {
  max-height: 4.5em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.summary.expanded {
  max-height: 500px;
}

.expand-btn {
  font-size: 12px;
  color: #4285f4;
  cursor: pointer;
  margin-top: 4px;
  text-align: right;
}

.expand-btn:hover {
  text-decoration: underline;
}

.reason-container {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 8px;
  margin-top: 12px;
}

.reason-label {
  font-size: 13px;
  font-weight: 600;
  color: #ea4335;
  margin-bottom: 4px;
}

.reason {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.tag {
  background: #eef2f8;
  color: #333;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
}

.link {
  font-size: 13px;
  color: #1677ff;
  text-decoration: none;
  margin-top: auto;
  display: inline-block;
  margin-top: 8px;
}

.fade-slide-enter-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>