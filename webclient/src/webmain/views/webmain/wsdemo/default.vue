<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';

// Props定义
const props = defineProps<{
  ujt: any;
}>();

// 解构全局对象
const { $global, $fn, $ws } = props.ujt;

// 链接配置数据
const rfData = reactive({
  link: null as any,
});

// WS调试数据
const rfKddData = reactive({
  wstype: 'web',
  wsinfoapi: {
    ty: 'asaiws/testapi',
    db: '{aa:1}',
  },
  wsinfolisten: {
    ty: 'asaiws/testlisten',
    db: $global.user?.info?.us,
    tc: 1500,
    pb: 2,
    off: 0,
  },
  res: '',
  reslisten: '',
});

// 获取可用的WS服务列表
const wsServiceList = computed(() => {
  if (!$global.link?.ws) return [];
  return Object.keys($global.link.ws).map((item) => ({
    label: item,
    value: item,
  }));
});

// 重置链接配置
function linkReset() {
  rfData.link = JSON.parse(JSON.stringify($global.link));
}

// 保存链接配置
function saveLink() {
  $fn.saveLink(rfData.link);
}

// 恢复默认链接
function defaultLink() {
  $fn.startLink().then(linkReset);
}

// 初始化/切换WS连接
function initWs(wstype: string) {
  rfKddData.res = '';
  rfKddData.reslisten = '';
  $fn.useWs(props.ujt, wstype);
  $fn.ws[wstype]?.init();
}

// 测试API请求
function testWsApi() {
  rfKddData.res = 'Sending...';
  $fn.ws[rfKddData.wstype]
    ?.wsApi(rfKddData.wsinfoapi)
    .then((res: any) => {
      rfKddData.res = typeof res === 'object' ? JSON.stringify(res, null, 2) : res;
    })
    .catch((err: any) => {
      rfKddData.res = `Error: ${err.message || err}`;
    });
}

// 开始监听
function testWsListen() {
  rfKddData.reslisten = 'Listening...';
  rfKddData.wsinfolisten.off = 0;
  $fn.ws[rfKddData.wstype]?.wsWatch(rfKddData.wsinfolisten, (res: any) => {
    rfKddData.reslisten = typeof res === 'object' ? JSON.stringify(res, null, 2) : res;
  });
}

// 停止监听
function testWsListenOff() {
  rfKddData.wsinfolisten.off = 1;
  $fn.ws[rfKddData.wstype]?.wsWatchOff(rfKddData.wsinfolisten);
  rfKddData.reslisten = 'Stopped';
}

// 组件挂载时初始化
onMounted(() => {
  linkReset();
  initWs(rfKddData.wstype);
});
</script>

<template>
  <div class="ws-integrated-page" v-userlevel="{ ujt, lv: 9 }">
    <!-- 顶部标题栏 -->
    <header class="page-header">
      <div class="header-left">
        <div class="logo-wrapper">
          <img :src="$global.$cfg.logo" alt="Logo" class="logo" />
        </div>
        <div class="title">
          <i class="icon-ws">🔌</i>
          <span>WebSocket Console</span>
        </div>
      </div>
      <div class="header-right">
        <span class="page-subtitle">Realtime Communication & Debugging</span>
      </div>
    </header>

    <!-- 第一部分：链接配置 -->
    <section class="config-section">
      <div class="config-card" v-if="rfData.link">
        <div class="card-header">
          <i class="card-icon">⚙️</i>
          <span>Connection Configuration</span>
        </div>
        <div class="card-body">
          <div class="link-grid">
            <div v-for="(itemclass, keyclass) in rfData.link" :key="keyclass" class="link-category">
              <div class="category-title">
                {{ $global.lang.configweb.link.class[keyclass] || keyclass }}
              </div>
              <div class="category-items">
                <div v-for="(item, key) in itemclass" :key="key" class="link-row">
                  <template v-if="!item?.close">
                    <span class="row-label">{{ $global.lang.configweb.link[key] || key }}</span>
                    <AsfInput :ujt="ujt" :opt="{ type: 'text', size: 'small' }" v-model="item.url" class="row-input" />
                    <div v-if="keyclass === 'ws'" class="row-status" :class="{ 'status-on': $ws?.[key]?.open, 'status-off': !$ws?.[key]?.open }">
                      {{ $ws?.[key]?.open ? '●' : '○' }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" @click="saveLink">
            <i>💾</i>
            <span>Save Configuration</span>
          </button>
          <button class="btn btn-secondary" @click="defaultLink">
            <i>🔄</i>
            <span>Restore Default</span>
          </button>
          <button class="btn btn-outline" @click="linkReset">
            <i>↺</i>
            <span>Reset</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 第二部分：调试操作区 -->
    <div class="debug-wrapper">
      <!-- 左侧：连接控制与API测试 -->
      <div class="debug-column">
        <!-- 连接选择器 -->
        <div class="card connection-card">
          <div class="card-head">
            <div class="head-left">
              <i class="card-icon">🔌</i>
              <span>Service Connection</span>
            </div>
            <span class="status-indicator" :class="{ on: $ws?.[rfKddData.wstype]?.open }">
              {{ $ws?.[rfKddData.wstype]?.open ? 'Online' : 'Offline' }}
            </span>
          </div>
          <div class="card-body">
            <div class="control-row">
              <AsfSelect :ujt="ujt" :opt="{ selectdata: wsServiceList }" v-model="rfKddData.wstype" class="service-select" />
              <button class="btn btn-primary" @click="initWs(rfKddData.wstype)">
                <i>🔄</i>
                <span>Reconnect</span>
              </button>
            </div>
            <div class="path-hint">Config: \webmodel\sys\server.json</div>
          </div>
        </div>

        <!-- API测试 -->
        <div class="card api-card">
          <div class="card-head">
            <div>
              <i class="card-icon">📡</i>
              <span>API Request</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-item">
              <label>Type (ty)</label>
              <AsfInput :ujt="ujt" :opt="{ type: 'text' }" v-model="rfKddData.wsinfoapi.ty" />
            </div>
            <div class="form-item">
              <label>Data (db)</label>
              <AsfInput :ujt="ujt" :opt="{ type: 'text' }" v-model="rfKddData.wsinfoapi.db" />
            </div>
            <button class="btn btn-success full-width" @click="testWsApi">
              <i>➤</i>
              <span>Send Request</span>
            </button>

            <div v-if="rfKddData.res" class="result-box">
              <pre>{{ rfKddData.res }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：消息监听 -->
      <div class="debug-column">
        <div class="card listen-card">
          <div class="card-head">
            <div>
              <i class="card-icon">👂</i>
              <span>Message Listener</span>
            </div>
          </div>
          <div class="card-body">
            <div class="form-row-2">
              <div class="form-item">
                <label>Type (ty)</label>
                <AsfInput :ujt="ujt" :opt="{ type: 'text' }" v-model="rfKddData.wsinfolisten.ty" />
              </div>
              <div class="form-item">
                <label>Scope (pb)</label>
                <AsfSelect
                  :ujt="ujt"
                  :opt="{
                    selectdata: [
                      { label: 'Self', value: 0 },
                      { label: 'Others', value: 1 },
                      { label: 'Everyone', value: 2 },
                    ],
                  }"
                  v-model="rfKddData.wsinfolisten.pb" />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-item">
                <label>Interval (tc)</label>
                <AsfInput :ujt="ujt" :opt="{ type: 'number' }" v-model="rfKddData.wsinfolisten.tc" />
              </div>
              <div class="form-item">
                <label>Filter (db)</label>
                <AsfInput :ujt="ujt" :opt="{ type: 'text' }" v-model="rfKddData.wsinfolisten.db" />
              </div>
            </div>

            <div class="btn-group">
              <button class="btn btn-success" @click="testWsListen">
                <i>▶️</i>
                <span>Start</span>
              </button>
              <button class="btn btn-danger" @click="testWsListenOff">
                <i>⏹️</i>
                <span>Stop</span>
              </button>
            </div>

            <div v-if="rfKddData.reslisten" class="result-box listen-result">
              <pre>{{ rfKddData.reslisten }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ws-integrated-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #303133;
}

/* 头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  box-shadow: 0 2px 10px rgba(30, 58, 95, 0.3);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }

  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;

    .icon-ws {
      font-size: 20px;
    }
  }

  .header-right {
    .page-subtitle {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

/* 配置区域 */
.config-section {
  padding: 15px 20px;
}

.config-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    font-size: 15px;
    font-weight: 600;
    color: #495057;

    .card-icon {
      font-size: 18px;
    }
  }

  .card-body {
    padding: 15px 20px;
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 12px 20px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.link-category {
  .category-title {
    font-size: 12px;
    font-weight: 600;
    color: #868e96;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.category-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .row-label {
    width: 90px;
    font-size: 13px;
    color: #6c757d;
    flex-shrink: 0;
    text-align: right;
  }

  .row-input {
    flex-grow: 1;

    :deep(.asf-input-wrapper) {
      border-radius: 6px;
    }

    :deep(input) {
      height: 32px;
      font-size: 13px;
    }
  }

  .row-status {
    width: 32px;
    text-align: center;
    font-size: 28px;

    &.status-on {
      color: #10b981;
    }
    &.status-off {
      color: #adb5bd;
    }
  }
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.full-width {
    width: 100%;
  }

  &.btn-primary {
    background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(30, 58, 95, 0.3);

    &:hover {
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.4);
    }
  }

  &.btn-secondary {
    background: #6c757d;
    color: #fff;

    &:hover {
      background: #5a6268;
    }
  }

  &.btn-outline {
    background: transparent;
    color: #6c757d;
    border: 1px solid #dee2e6;

    &:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
    }
  }

  &.btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

    &:hover {
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
  }

  &.btn-danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    }
  }
}

/* 调试主布局 */
.debug-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 0 20px 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

/* 卡片通用样式 */
.card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 15px;

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;

    .head-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-icon {
      font-size: 16px;
    }

    span {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
    }

    .status-indicator {
      padding: 5px 12px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;

      &.on {
        background: #dcfce7;
        color: #059669;
      }
    }
  }

  .card-body {
    padding: 16px;
  }
}

/* 表单控件样式 */
.control-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;

  .service-select {
    flex-grow: 1;

    :deep(.asf-select-wrapper) {
      border-radius: 6px;
    }
  }
}

.path-hint {
  font-size: 12px;
  color: #adb5bd;
  font-family: 'Monaco', 'Consolas', monospace;
}

.form-item {
  margin-bottom: 14px;

  label {
    display: block;
    font-size: 12px;
    color: #868e96;
    margin-bottom: 5px;
    font-weight: 500;
  }

  :deep(.asf-input-wrapper) {
    border-radius: 6px;
  }

  :deep(input),
  :deep(.asf-input) {
    width: 100%;
    height: 34px;
    font-size: 13px;
  }
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.btn-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
}

/* 结果展示样式 */
.result-box {
  margin-top: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;

  pre {
    margin: 0;
    padding: 12px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    color: #334155;
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.5;
  }
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;

  &:hover {
    background: #a1a1a1;
  }
}
</style>
