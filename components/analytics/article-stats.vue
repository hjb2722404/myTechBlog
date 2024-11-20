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
      <el-tooltip
        content="文章访问量"
        placement="top"
        :show-after="200"
      >
        <div class="stat-item">
          <el-icon><View /></el-icon>
          <span>{{ views }}</span>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUmamiStats } from '~/composables/useUmamiStats'
import { View } from '@element-plus/icons-vue'

const props = defineProps<{
  content: any
}>()

const route = useRoute()
const views = ref(0)
const { getPageViews, isLoading, error } = useUmamiStats()

// 计算阅读时间（假设平均阅读速度为每分钟 300 字）
const readingTime = computed(() => {
  if (!props.content) return 1
  
  // 如果 content 是字符串
  if (typeof props.content === 'string') {
    const wordCount = props.content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 300))
  }
  
  // 如果 content 是 ParsedContent 对象
  if (props.content._raw) {
    const wordCount = props.content._raw.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 300))
  }
  
  // 如果无法获取内容，返回默认值
  return 1
})

// 获取页面访问量
onMounted(async () => {
  try {
    views.value = await getPageViews(route.path)
  } catch (err) {
    console.error('Failed to fetch article stats:', err)
  }
})
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

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.el-icon {
  font-size: 1rem;
}
</style>
