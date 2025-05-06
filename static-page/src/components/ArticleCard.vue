<template>
    <div class="article-card">
      <img v-if="article.coverImage" :src="article.coverImage" alt="cover" class="cover" />
      <div class="content">
        <div class="meta">
          <span class="platform">{{ article.platform }}</span>
          <span class="date">{{ formattedDate }}</span>
        </div>
        <h3 class="title">{{ article.title }}</h3>
        <p class="summary" v-if="article.summary">{{ article.summary }}</p>
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <a :href="article.link" class="read-more" target="_blank" rel="noopener">阅读原文</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ArticleCard',
    props: {
      article: {
        type: Object,
        required: true,
      },
    },
    computed: {
      formattedDate() {
        const d = new Date(this.article.date);
        return d.toLocaleDateString();
      },
    },
  };
  </script>
  
  <style scoped>
  .article-card {
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease;
    background-color: #fff;
    margin-bottom: 20px;
  }
  
  .article-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
  
  .cover {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .meta {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #999;
  }
  
  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 4px 0;
    line-height: 1.4;
    color: #333;
  }
  
  .summary {
    color: #555;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  
  .tag {
    background-color: #f3f4f6;
    color: #333;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 12px;
  }
  
  .read-more {
    margin-top: 8px;
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
    align-self: flex-start;
  }
  
  .read-more:hover {
    text-decoration: underline;
  }
  </style>
  