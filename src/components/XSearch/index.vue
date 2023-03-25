<template>
    <div class="search c-bg" @click="emits('click')">
        <div>
            <img :src="tools.getUrl('search-gray.png')" alt="" />
            {{ props.tipText || '搜索' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import tools from '@/utils/tools'

const props = defineProps<{
    tipText?: string
}>()

const emits = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.search {
    position: relative;
    padding: 10rem;
    div {
        background-color: #fff;
        border-radius: 5rem;
        padding: 8rem 0;
        letter-spacing: 1rem;
        font-size: 14rem;
        color: #8b8b8b;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 14rem;
            margin-right: 5rem;
        }
    }
}
</style>
