<script setup lang="ts">
import { Brush } from '@element-plus/icons-vue'
import SpeakerIconFilled from '@/components/icons/SpeakerIconFilled.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import ThumbUpIcon from '@/components/icons/ThumbUpIcon.vue'
import ScreenIcon from '@/components/icons/ScreenIcon.vue'
import { computed, markRaw, ref, watch, nextTick, type Component } from 'vue'
import NotificationsByType from './NotificationsByType.vue'
import { useMessageStore } from '@/stores/message'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = defineModel<boolean>({ required: true })

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
    </div>
  </ylb-dialog>
</template>

<style scoped>
.notification-dialog-content {
  height: 40vh;
  font-family: inherit;
}

.clear-btn {
  margin: -4px;
  padding: 0 4px;
  margin-left: 4px;
  transform: rotate(180deg);
  font-family: 'Courier New', Courier, monospace;
}
</style>
