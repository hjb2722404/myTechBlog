<template>
  <div class="popular-articles">
    <h3 class="title">热门文章</h3>
    <div class="articles-list">
      <div
        v-for="article in popularArticles"
        :key="article._path"
        class="article-item"
        @click="navigateToArticle(article._path)"
      >
        <div class="article-info">
          <h4 class="article-title">{{ article.title }}</h4>
          <p class="article-desc">{{ article.description }}</p>
        </div>
        <div class="article-stats">
          <span class="views">{{ article.views }} 次阅读</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Article {
  _path: string
  title: string
  description: string
  views: number
}

const popularArticles = ref<Article[]>([])

onMounted(async () => {
  // 这里可以从后端 API 获取热门文章数据
  // 现在我们使用模拟数据
  popularArticles.value = [
    {
      _path: '/articles/vue3-composition-api',
      title: 'Vue 3 Composition API 完全指南',
      description: '深入了解 Vue 3 的 Composition API，掌握响应式编程的精髓',
      views: 1234
    },
    // 添加更多文章...
  ]
})

const navigateToArticle = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.popular-articles {
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
}

.title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 6px;
  background-color: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.article-info {
  flex: 1;
  margin-right: 1rem;
}

.article-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-stats {
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.views {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
