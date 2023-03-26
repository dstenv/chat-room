<template>
    <div>
        <div class="add-friend c-bg" v-if="!pageData.isSearch">
            <XHeader
                title="添加朋友"
                :left-icon="tools.getUrl('back.png')"
                :leftClick="
                    () => {
                        router.back()
                    }
                "
            >
                <template #custom>
                    <XSearch
                        tip-text="账号/手机号"
                        @click="
                            () => {
                                pageData.isSearch = true
                            }
                        "
                    />

                    <p class="my-id">我的用户id：{{ userStore.userId }}</p>
                </template>
            </XHeader>
        </div>

        <template v-else>
            <Search @cancel="() => (pageData.isSearch = false)" />
        </template>
    </div>
</template>

<script setup lang="ts">
import tools from '@/utils/tools'
import XSearch from '@/components/XSearch/index.vue'
import { useUserStore } from '@/stores/user'
import Search from './components/search.vue'

const router = useRouter()
const userStore = useUserStore()

const pageData = reactive({
    isSearch: false,
})
</script>

<style scoped lang="scss">
.add-friend {
    height: 100vh;
    .my-id {
        padding: 10rem 0 20rem;
        text-align: center;
        font-size: 14rem;
        font-weight: 500;
    }
}
</style>
