<template>
  <div class="article-card">
    <img class="cover" :src="coverImage" alt="封面图" />

    <div class="card-content">
      <div class="card-header">
        <span class="platform">{{ article.platform }}</span>
        <span class="date">{{ formatDate(article.date) }}</span>
      </div>

      <h3 class="title">{{ article.title }}</h3>
      <p class="summary" v-if="article.summary">{{ article.summary }}</p>

      <div class="tags" v-if="article.tags?.length">
        <span class="tag" v-for="tag in article.tags" :key="tag">{{ tag }}</span>
      </div>

      <div class="footer">
        <a :href="article.link" target="_blank" class="link">🔗 阅读原文</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    coverImage() {
      const mediaUrl = this.article.media?.[0]?.url
      return mediaUrl || 'https://placekitten.com/400/200' // 默认封面图
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      return `${y}/${m}/${d}`
    }
  }
}
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  max-height: 58vh;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.article-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #f3f3f3;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
}

.summary {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 12px;
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 6px;
  color: #555;
}

.footer {
  margin-top: auto;
}

.link {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .cover {
    height: 140px;
  }
  .title {
    font-size: 15px;
  }
  .summary {
    font-size: 13px;
  }
}
</style>
