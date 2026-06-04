<script setup lang="ts">
import { ref, computed } from 'vue';

const props: any = defineProps<{
    ujt: any;
}>();
const { $global, $model } = props.ujt;
const searchQuery = ref('');

const filteredItems = computed(() => {
    if (!searchQuery.value) return $global.lang?.configsite?.website || [];
    const query = searchQuery.value.toLowerCase();
    return $global.lang?.configsite?.website?.filter?.((item: any) =>
        item[0]?.toLowerCase().includes(query) ||
        item[1]?.toLowerCase().includes(query)
    );
});
</script>

<template>
    <div class="nav-page">
        <header class="header">
            <h1>{{ $global.lang?.configweb?.webdesc?.[0] || '' }}</h1>
            <p>{{ $global.lang?.configweb?.webdesc?.[1] || '' }}</p>
        </header>

        <div class="search-box">
            <span class="search-icon">🔍</span>
            <input v-model="searchQuery" type="text" :placeholder="$global.lang?.configweb?.webdesc?.[2] || ''" />
        </div>

        <nav class="nav-list">
            <a v-for="(item, index) in filteredItems" :key="'website' + index" class="nav-item"
                :href="$model.data?.sys?.sysconfig?.website?.[index][0] || ''"
                :style="{ '--item-color': $model.data?.sys?.sysconfig?.website?.[index][2] || '' }">
                <span class="item-icon">{{ $model.data?.sys?.sysconfig?.website?.[index][1] || '' }}</span>
                <div class="item-info">
                    <span class="item-name">{{ item[0] }}</span>
                    <span class="item-desc">{{ item[1] }}</span>
                </div>
                <span class="item-arrow">→</span>
            </a>
            <p v-if="filteredItems.length === 0" class="as-nodata">{{ $global.lang.asai.empty }}</p>
        </nav>
    </div>
</template>

<style scoped lang="scss">
.nav-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
}

.header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
        font-size: 36px;
        font-weight: 300;
        letter-spacing: 4px;
        color: #1a1a1a;
        margin: 0 0 8px 0;
    }

    p {
        font-size: 14px;
        color: #888;
        margin: 0;
    }
}

.search-box {
    width: 100%;
    max-width: 640px;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 12px 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .search-icon {
        font-size: 18px;
        margin-right: 12px;
        opacity: 0.5;
    }

    input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 15px;
        color: #333;
        background: transparent;
    }

    input::placeholder {
        color: #aaa;
    }
}

.nav-list {
    width: 100%;
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: #fff;
    border-radius: 10px;
    border-left: 4px solid var(--item-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
        transform: translateX(6px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .item-icon {
        font-size: 22px;
        margin-right: 14px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.03);
        border-radius: 8px;
    }

    .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .item-name {
        font-size: 15px;
        color: #222;
        font-weight: 500;
    }

    .item-desc {
        font-size: 12px;
        color: #999;
    }

    .item-arrow {
        font-size: 16px;
        color: #ddd;
        transition: all 0.2s ease;
    }

    &:hover .item-arrow {
        color: var(--item-color);
        transform: translateX(4px);
    }
}

@media (max-width: 768px) {
    .header h1 {
        font-size: 28px;
    }

    .nav-item {
        padding: 14px 16px;
    }
}
</style>