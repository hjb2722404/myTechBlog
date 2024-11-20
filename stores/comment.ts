import { defineStore } from 'pinia'

interface Comment {
  id: string
  author: string
  content: string
  date: string
  articlePath: string
}

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [] as Comment[]
  }),

  getters: {
    getCommentsByArticle: (state) => {
      return (articlePath: string) => {
        return state.comments
          .filter(comment => comment.articlePath === articlePath)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }
    }
  },

  actions: {
    async addComment(comment: Comment) {
      // 这里可以添加与后端 API 的交互
      // 现在我们只是将评论存储在内存中
      this.comments.push(comment)
    },

    async loadComments() {
      // 这里可以从后端 API 加载评论
      // 现在我们只是使用内存中的数据
      return this.comments
    }
  },

  // 使用持久化存储插件
  persist: {
    storage: persistedState.localStorage,
  },
})
