<template>
    <div class="empty" :style="{ ...props.emptyStyle }">
        <img :src="props.img" alt="" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    img: string
    text?: string
    emptyStyle?: Object
}>()
</script>

<style scoped lang="scss">
.empty {
    flex: 1;
    display: flex;
    align-items: center;
    img {
        width: 200rem;
        height: 70%;
        object-fit: contain;
        display: block;
        margin: 0 auto;
    }
}
</style>
