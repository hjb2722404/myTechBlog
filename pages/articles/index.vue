<template>
  <div class="articles-page">
    <el-row :gutter="20" justify="center">
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="page-header">
              <h2>技术文章</h2>
              <div class="filters">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索文章..."
                  clearable
                  class="search-input"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
            </div>
          </template>

          <ContentList
            path="/articles"
            v-slot="{ list }"
            :query="{
              sort: [{ date: -1 }],
              where: searchQuery
                ? {
                    title: { $regex: searchQuery, $options: 'i' },
                  }
                : undefined,
            }"
          >
            <div class="articles-list">
              <el-card
                v-for="article in list"
                :key="article._path"
                class="article-item"
                shadow="hover"
                @click="navigateToArticle(article._path)"
              >
                <h3>{{ article.title }}</h3>
                <p class="description">{{ article.description }}</p>
                <div class="article-meta">
                  <span class="date">{{ formatDate(article.date) }}</span>
                  <div class="tags">
                    <el-tag
                      v-for="tag in article.tags"
                      :key="tag"
                      size="small"
                      class="tag"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </ContentList>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const navigateToArticle = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.articles-page {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header h2 {
  margin: 0;
}

.search-input {
  width: 300px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.article-item:hover {
  transform: translateY(-2px);
}

.article-item h3 {
  margin: 0 0 0.5rem 0;
}

.description {
  color: var(--el-text-color-regular);
  margin: 0.5rem 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.date {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  margin-right: 0.5rem;
}
</style>
