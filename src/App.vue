<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { EaseChatClient, EaseChatSDK } from '@/utils/config'

EaseChatSDK.logger.disableAll()
// connect监听
EaseChatClient.addEventHandler('connection', {
    onConnected: () => {
        console.log('>>>>>环信连接成功')
    },
    onDisconnected: () => {},
    // 本机网络连接成功。
    onOnline: () => {
        console.log('本机网络连接成功。')
    },
    // 本机网络掉线。
    onOffline: () => {
        console.log('本机网络掉线。')
    },
    onError: (error) => {
        console.log('on error', error)
    },
})

// message 相关监听
EaseChatClient.addEventHandler('messageListen', {
    // 收到文本消息。
    onTextMessage: (message) => {
        console.log('>>>>>>>App mesage', message)
    },

    // 收到表情消息。报错（暂时不知原因）
    // onEmojiMessage: () => {},

    // 收到图片消息。
    onImageMessage: () => {
        console.log('收到图片消息。')
    },
    // 收到命令消息。
    onCmdMessage: (message) => {
        console.log('>>>>>收到命令消息', message)
    },
    // 收到音频消息。
    onAudioMessage: () => {
        console.log('收到音频消息。')
    },
    // 收到位置消息。
    onLocationMessage: () => {
        console.log('收到位置消息。')
    },
    // 收到文件消息。
    onFileMessage: () => {
        console.log('收到文件消息。')
    },
    // 收到自定义消息。
    onCustomMessage: () => {
        console.log('收到自定义消息。')
    },
    // 收到视频消息。
    onVideoMessage: () => {
        console.log('收到视频消息。')
    },
    // 收到消息撤回回执。
    onRecallMessage: () => {
        console.log('收到消息撤回回执。')
    },
})
</script>

<template>
    <header>
        <img
            alt="Vue logo"
            class="logo"
            src="@/assets/logo.svg"
            width="125"
            height="125"
        />
        <div class="wrapper">
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView />
</template>

<style lang="scss" scoped></style>
