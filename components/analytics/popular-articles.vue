<template>
  <div class="popular-articles">
    <h3 class="title">热门文章</h3>
    <div v-if="isLoading" class="loading">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="error" class="error">
      加载失败，请稍后重试
    </div>
    <div v-else class="article-list">
      <NuxtLink
        v-for="article in articles"
        :key="article.url"
        :to="article.url"
        class="article-item"
      >
        <div class="article-title">{{ getArticleTitle(article.url) }}</div>
        <div class="article-views">{{ article.pageviews }} 次访问</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUmamiStats } from '~/composables/useUmamiStats'

const { getPopularArticles, isLoading, error } = useUmamiStats()
const articles = ref([])

onMounted(async () => {
  articles.value = await getPopularArticles(5)
})

// 从 URL 中提取文章标题
const getArticleTitle = (url: string) => {
  const slug = url.split('/').pop()
  if (!slug) return '未知文章'
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
.popular-articles {
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s;
  text-decoration: none;
  color: var(--text-primary);
}

.article-item:hover {
  background-color: var(--bg-secondary);
}

.article-title {
  font-size: 0.95rem;
  line-height: 1.4;
}

.article-views {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.loading {
  padding: 1rem 0;
}

.error {
  padding: 1rem;
  text-align: center;
  color: var(--text-error);
}
</style>
