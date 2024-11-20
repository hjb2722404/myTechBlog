<template>
  <div class="popular-articles">
    <h3 class="title">
      <el-icon><Star /></el-icon>
      热门文章
    </h3>
    <div v-if="isLoading" class="loading">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="error" class="error">
      加载失败，请稍后重试
    </div>
    <div v-else class="articles-list">
      <NuxtLink
        v-for="(article, index) in popularArticles"
        :key="index"
        :to="article.url"
        class="article-item"
      >
        <span class="article-title">{{ getArticleTitle(article.url) }}</span>
        <div class="article-meta">
          <span class="views">
            <el-icon><View /></el-icon>
            {{ article.pageviews }}
          </span>
        </div>
      </NuxtLink>
      <div v-if="popularArticles.length === 0" class="no-data">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUmamiStats } from '~/composables/useUmamiStats'
import { View, Star } from '@element-plus/icons-vue'

const popularArticles = ref([])
const { getPopularPages, isLoading, error } = useUmamiStats()

// 从文章URL中提取标题
const getArticleTitle = (url: string) => {
  const slug = url.split('/').pop()
  if (!slug) return '未知文章'
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

onMounted(async () => {
  try {
    popularArticles.value = await getPopularPages(5)
  } catch (err) {
    console.error('Failed to fetch popular articles:', err)
  }
})
</script>

<style scoped>
.popular-articles {
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  text-decoration: none;
  color: var(--text-primary);
}

.article-item:hover {
  background-color: var(--bg-secondary);
}

.article-title {
  font-size: 0.9rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.views {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.loading, .error, .no-data {
  padding: 1rem 0;
  text-align: center;
  color: var(--text-secondary);
}

.error {
  color: var(--color-danger);
}
</style>
