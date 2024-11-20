<template>
  <div class="home-page">
    <el-row :gutter="20" justify="center">
      <el-col :span="18">
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">
              探索前端技术的
              <span class="gradient-text">无限可能</span>
            </h1>
            <p class="hero-description">
              分享Vue.js技术栈的开发经验，探讨前端团队的管理之道
            </p>
            <div class="hero-actions">
              <el-button type="primary" size="large" @click="navigateTo('/articles')">
                浏览文章
              </el-button>
              <el-button size="large" @click="navigateTo('/demos')">
                查看Demo
              </el-button>
            </div>
          </div>
        </div>

        <el-card class="latest-articles">
          <template #header>
            <div class="section-header">
              <div class="header-left">
                <h2 class="section-title">最新文章</h2>
                <span class="section-subtitle">探索前沿技术，分享实战经验</span>
              </div>
              <el-button text @click="navigateTo('/articles')">
                查看全部
              </el-button>
            </div>
          </template>
          <ContentList
            path="/articles"
            v-slot="{ list }"
            :query="{
              sort: [{ date: -1 }],
              limit: 3
            }"
          >
            <div class="articles-grid">
              <el-card
                v-for="article in list"
                :key="article._path"
                class="article-preview"
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
const router = useRouter()

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
.home-page {
  padding: 2rem 0;
}

.hero-section {
  margin-bottom: 4rem;
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    var(--bg-secondary) 0%,
    transparent 70%
  );
  z-index: -1;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-preview {
  cursor: pointer;
  height: 100%;
}

.article-preview h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  line-height: 1.4;
}

.description {
  color: var(--text-secondary);
  margin: 0.5rem 0;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.date {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
