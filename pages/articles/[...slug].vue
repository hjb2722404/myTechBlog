<template>
  <div class="article-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <ContentDoc v-slot="{ doc }">
          <article class="article">
            <header class="article-header">
              <h1>{{ doc.title }}</h1>
              <ArticleStats :content="doc.body" :views="articleViews" />
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
      <el-col :span="6">
        <div class="sidebar">
          <PopularArticles />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CommentSection from '~/components/article/comment-section.vue'
import ArticleStats from '~/components/analytics/article-stats.vue'
import PopularArticles from '~/components/analytics/popular-articles.vue'

const route = useRoute()
const articleViews = ref(0)

onMounted(async () => {
  // 这里可以从后端 API 获取文章访问量
  // 现在我们使用模拟数据
  articleViews.value = Math.floor(Math.random() * 1000)
})

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.article {
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
  color: var(--text-secondary);
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

.sidebar {
  position: sticky;
  top: 2rem;
}

@media (max-width: 1200px) {
  .article-container {
    max-width: 800px;
  }
  
  .el-col-18 {
    width: 100%;
  }
  
  .el-col-6 {
    width: 100%;
    margin-top: 2rem;
  }
  
  .sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .article-header h1 {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .article {
    padding: 1rem;
  }
}

:deep(.article-content) {
  line-height: 1.8;
  
  h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.8rem;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.4rem;
  }

  p {
    margin: 1rem 0;
    line-height: 1.8;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  pre {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 8px;
    background-color: var(--code-bg);
    overflow-x: auto;
  }

  code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
  }
}
</style>
