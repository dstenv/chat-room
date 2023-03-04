<template>
    <div class="chat">
        <XHeader
            title="消息"
            :rightIcon="Tool.getUrl('add-gray.png')"
            :leftIcon="Tool.getUrl('search-gray.png')"
        />
    </div>
</template>

<script setup lang="ts">
import { EaseChatClient } from '@/utils/config'
import { showToast } from 'vant'
import Tool from '@/utils/tools'

EaseChatClient.addEventHandler('chatConnect', {
    onDisconnected: () => {
        showToast('已断线')
    },
})
</script>

<style scoped></style>
