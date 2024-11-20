<template>
  <div class="article-stats">
    <div class="stats-item">
      <el-tooltip content="阅读时间">
        <div class="stat">
          <div class="icon">
            <i class="el-icon-time" />
          </div>
          <span>{{ readingTime }} 分钟阅读</span>
        </div>
      </el-tooltip>
    </div>
    <div class="stats-item">
      <el-tooltip content="访问次数">
        <div class="stat">
          <div class="icon">
            <i class="el-icon-view" />
          </div>
          <span>{{ views }} 次访问</span>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
  views?: number
}>()

// 计算阅读时间（假设平均阅读速度为每分钟 300 字）
const readingTime = computed(() => {
  const wordCount = props.content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 300))
})

// 访问次数，如果没有提供则显示 0
const views = computed(() => props.views || 0)
</script>

<style scoped>
.article-stats {
  display: flex;
  gap: 1.5rem;
  margin: 1rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stats-item {
  display: flex;
  align-items: center;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
}
</style>
