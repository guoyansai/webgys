<template>
    <div class="as-load-area">
        <img :src="wd.$CFG.logo" width="200" />
        <div class="as-load-icon">
            <div class="as-load-gif" style="width: 68px; height: 68px"></div>
        </div>
        <div class="as-load-msg" style="font-size: larger">Loading...</div>
    </div>
</template>

<script setup lang="ts">
const wd = window as any;
</script>

<style scoped></style>
