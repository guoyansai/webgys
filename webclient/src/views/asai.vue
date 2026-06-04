<script setup lang="ts">
const props = defineProps<{
    ujt: any;
}>();
const { $global } = props.ujt;
</script>

<template>
    <div class="page-404">
        <div class="content">
            <div class="error-code">404</div>
            <h1 class="title" v-if="$global.lang?.asai?.page?.page404">
                {{ $global.lang?.asai?.page?.page404 || '页面未找到' }}
            </h1>
            <p class="description">
                {{
                    $global.lang?.asai?.page?.reason404 ||
                    'Sorry, Page not found!'
                }}
            </p>
        </div>
        <div class="footer">
            <AsReset :ujt="ujt" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.page-404 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--cr0);
    color: var(--cu6);
    text-align: center;

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 600px;
        padding: 20px;

        .error-code {
            font-size: 8rem;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 20px;
            color: var(--cv0);
            text-shadow: 4px 4px 0 var(--cv6);

            @media (max-width: 768px) {
                font-size: 6rem;
            }

            @media (max-width: 480px) {
                font-size: 4rem;
            }
        }

        .title {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--cu8);

            @media (max-width: 768px) {
                font-size: 1.75rem;
            }
        }

        .description {
            font-size: 1.1rem;
            margin-bottom: 30px;
            color: var(--cu6);
            line-height: 1.6;

            @media (max-width: 768px) {
                font-size: 1rem;
            }
        }
    }

    .footer {
        margin-top: auto;
        padding: 20px;
    }
}
</style>
