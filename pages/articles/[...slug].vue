<template>
  <div class="article-container">
    <el-row :gutter="20" justify="center">
      <el-col :span="18">
        <ContentDoc v-slot="{ doc }">
          <article class="article">
            <header class="article-header">
              <h1>{{ doc.title }}</h1>
              <div class="article-meta">
                <time>{{ formatDate(doc.date) }}</time>
                <div class="tags">
                  <el-tag
                    v-for="tag in doc.tags"
                    :key="tag"
                    size="small"
                    class="tag"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </header>

            <div class="article-content prose">
              <ContentRenderer :value="doc" />
            </div>

            <!-- 添加评论部分 -->
            <CommentSection :article-path="route.path" />
          </article>
        </ContentDoc>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.article-container {
  padding: 2rem 0;
}

.article-header {
  margin-bottom: 2rem;
  text-align: center;
}

.article-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: var(--el-text-color-secondary);
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.article-content {
  margin-top: 2rem;
}

.prose {
  max-width: none;
}

@media (max-width: 768px) {
  .article-header h1 {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}

:deep(.article-content .content) {
  line-height: 1.8;
}

:deep(.article-content h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

:deep(.article-content h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

:deep(.article-content p) {
  margin: 1rem 0;
}

:deep(.article-content ul) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

:deep(.article-content pre) {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
}
</style>
