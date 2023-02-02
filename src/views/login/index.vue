<template>
    <div>
        <VanButton
            type="success"
            @click="
                () => {
                    router.replace('/register')
                }
            "
            >跳转到注册</VanButton
        >
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>

<style scoped></style>
