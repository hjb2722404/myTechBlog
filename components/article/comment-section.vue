<template>
  <div class="comment-section">
    <h3 class="comment-title">评论</h3>
    
    <!-- 评论输入框 -->
    <div class="comment-form">
      <el-input
        v-model="commentForm.author"
        placeholder="你的昵称"
        class="author-input"
      />
      <el-input
        v-model="commentForm.content"
        type="textarea"
        :rows="3"
        placeholder="写下你的想法..."
        class="content-input"
      />
      <div class="form-actions">
        <el-button type="primary" @click="submitComment" :loading="isSubmitting">
          发表评论
        </el-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list" v-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="author">{{ comment.author }}</span>
          <span class="date">{{ formatDate(comment.date) }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>
    <el-empty v-else description="暂无评论" />
  </div>
</template>

<script setup lang="ts">
interface Comment {
  id: string
  author: string
  content: string
  date: string
  articlePath: string
}

interface CommentForm {
  author: string
  content: string
}

const props = defineProps<{
  articlePath: string
}>()

const commentStore = useCommentStore()
const comments = computed(() => commentStore.getCommentsByArticle(props.articlePath))

const commentForm = ref<CommentForm>({
  author: '',
  content: ''
})

const isSubmitting = ref(false)

const submitComment = async () => {
  if (!commentForm.value.author.trim() || !commentForm.value.content.trim()) {
    ElMessage.warning('请填写昵称和评论内容')
    return
  }

  isSubmitting.value = true
  try {
    await commentStore.addComment({
      id: Date.now().toString(),
      author: commentForm.value.author,
      content: commentForm.value.content,
      date: new Date().toISOString(),
      articlePath: props.articlePath
    })
    
    commentForm.value.content = ''
    ElMessage.success('评论发布成功')
  } catch (error) {
    ElMessage.error('评论发布失败')
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.comment-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.comment-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.author-input {
  margin-bottom: 1rem;
  max-width: 300px;
}

.content-input {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.comments-list {
  margin-top: 2rem;
}

.comment-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
  background-color: var(--bg-secondary);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.author {
  font-weight: 600;
  color: var(--text-primary);
}

.date {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.comment-content {
  margin: 0;
  line-height: 1.6;
  color: var(--text-secondary);
}
</style>
