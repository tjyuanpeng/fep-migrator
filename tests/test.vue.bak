<script setup lang="ts">
import { Brush } from '@element-plus/icons-vue'
import SpeakerIconFilled from '@/components/icons/SpeakerIconFilled.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue'
import ScreenIcon from '@/components/icons/ScreenIcon.vue'
import { computed, markRaw, ref, watch, nextTick, type Component } from 'vue'
import NotificationsByType from './NotificationsByType.vue'
import { useMessageStore } from '@/stores/message'
import api from '@/network/api'
import type { MessageType } from '@/network/api/system'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = defineModel<boolean>({ required: true })

const messageStore = useMessageStore()

const feedbackInputText = ref('')
const isSubmittingFeedback = ref(false)

const handleSendFeedbackBtnClick = async () => {
  isSubmittingFeedback.value = true
  try {
    await api.admin.addUserFeedback(feedbackInputText.value)
    feedbackInputText.value = ''
    ElMessage.success('反馈已发送')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmittingFeedback.value = false
  }
}

const tabs = computed<
  {
    name: MessageType
    label: string
    icon: Component
    badgeText: string | number | undefined
  }[]
>(() => [
  {
    name: 'notice',
    label: '通知',
    icon: markRaw(SpeakerIconFilled),
    badgeText: messageStore.unreadCountsByType.notice
  },
  {
    name: 'comments',
    label: '评论',
    icon: markRaw(MessageIcon),
    badgeText: messageStore.unreadCountsByType.comments
  },
  {
    name: 'favors',
    label: '点赞',
    icon: markRaw(ThumbUpIcon),
    badgeText: messageStore.unreadCountsByType.favors
  },
  {
    name: 'system',
    label: '系统',
    icon: markRaw(ScreenIcon),
    badgeText: messageStore.unreadCountsByType.system
  }
])

const activeTabName = ref<MessageType | undefined>()

watch(dialogVisible, (isVisible) => {
  if (isVisible) {
    activeTabName.value = 'notice'
    feedbackInputText.value = ''
  } else {
    activeTabName.value = undefined
  }
})
watch(activeTabName, (tabName) => {
  if (tabName) {
    messageStore.updateUnreadCount()
  }
})

const clearAll = async () => {
  await ElMessageBox.confirm('确认将本页签所有消息标记为已读状态？', '提示')
  if (activeTabName.value) {
    await messageStore.makeMessagesReadByType(activeTabName.value)
  }
  const name = activeTabName.value
  activeTabName.value = undefined
  nextTick(() => (activeTabName.value = name))
}
</script>

<template>
  <ylb-dialog v-model="dialogVisible" title="站内信" width="40vw">
    <div class="notification-dialog-content">
      <el-tabs v-model="activeTabName" :closable="false" style="height: 100%; padding: 0 10px">
        <el-tab-pane
          v-for="item in tabs || []"
          :key="item.name"
          :label="item.label"
          :name="item.name"
          style="height: 100%"
        >
          <template #label>
            <div class="tab-label">
              <el-badge
                :hidden="!item.badgeText"
                :value="item.badgeText"
                class="badge"
                :show-zero="false"
              >
                <span>{{ item.label }} </span>
              </el-badge>
              <el-button size="small" text class="clear-btn">
                <el-icon
                  v-if="item.name === activeTabName"
                  color="var(--el-color-primary)"
                  @click="clearAll"
                  ><Brush
                /></el-icon>
              </el-button>
            </div>
          </template>
          <div class="part-wrapper">
            <div class="tab-content" v-if="activeTabName">
              <transition name="fade" mode="out-in">
                <NotificationsByType :key="activeTabName" :type="activeTabName" />
              </transition>
            </div>
            <transition name="fade" mode="out-in">
              <div class="feedback-input-line" v-if="activeTabName === 'system'">
                <el-input
                  class="ylb-input"
                  v-model="feedbackInputText"
                  placeholder="请输入意见反馈..."
                  :maxlength="300"
                  show-word-limit
                />
                <el-button
                  class="ylb-button"
                  type="primary"
                  :loading="isSubmittingFeedback"
                  @click="handleSendFeedbackBtnClick"
                  :disabled="!feedbackInputText"
                >
                  发送
                </el-button>
              </div>
            </transition>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </ylb-dialog>
</template>

<style scoped>
.notification-dialog-content {
  height: 40vh;

  .part-wrapper {
    overflow: hidden;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    > .tab-content {
      flex: 1;
      overflow: hidden;
    }

    > .feedback-input-line {
      display: flex;
      align-items: center;
      margin-top: 24px;

      > * + * {
        margin-left: 24px;
      }
    }
  }
}
:deep(.el-badge__content) {
  border: unset;
}
.clear-btn {
  margin: -4px;
  padding: 0 4px;
  margin-left: 4px;
  transform: rotate(180deg);
}
</style>
