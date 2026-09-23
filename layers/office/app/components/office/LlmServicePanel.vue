<script setup lang="ts">
  import type { LlmCliHealthResponse } from '~~/layers/office/repositories'

  type ServiceCard = {
    id: string
    name: string
    models: string[]
    provider: LlmCliHealthResponse['providers'][number] | undefined
    status: string
    cli?: string
    model?: string
    checkedAt?: string
    error?: string
  }

  const { status, checkedAt, providers, inventory, inventoryError, message, check, loadInventory } = useLlmCliHealth()
  onMounted(() => {
    void loadInventory()
    void check()
  })

  const serviceCards = computed<ServiceCard[]>(() => {
    const byId = new Map(inventory.value.map((service) => [service.id, service]))
    for (const provider of providers.value) {
      const known = byId.get(provider.id)
      byId.set(provider.id, {
        id: provider.id,
        name: provider.name || known?.name || provider.id,
        models: provider.model ? [provider.model] : (known?.models ?? []),
      })
    }

    return [...byId.values()].map((service) => {
      const provider = providers.value.find((item) => item.id === service.id)

      return {
        ...service,
        provider,
        status: provider?.status ?? 'unconfigured',
        cli: provider?.cli,
        model: provider?.model,
        checkedAt: provider?.checkedAt,
        error: provider?.error,
      }
    })
  })

  const statusLabel = (value: string): string =>
    ({ connected: '連線正常', unavailable: '無法連線', unconfigured: '尚未確認（未設定）' })[value] ??
    '未知／不支援的狀態'
  const providerIcon = (provider: { id: string; name?: string; cli?: string }): string => {
    const identity = `${provider.id} ${provider.name ?? ''} ${provider.cli ?? ''}`.toLowerCase()
    if (/claude|anthropic/.test(identity)) return 'mdi-robot-outline'
    if (/codex|openai/.test(identity)) return 'mdi-brain'
    if (/gemini|google/.test(identity)) return 'mdi-google'

    return 'mdi-cloud-outline'
  }
  const providerStatus = (value: string): { label: string; color?: string; icon: string } => {
    if (status.value === 'checking') return { label: '連線中', color: 'info', icon: 'mdi-loading' }
    if (value === 'connected') return { label: '已連線', color: 'success', icon: 'mdi-check-circle' }
    if (value === 'unavailable') return { label: '離線', color: 'error', icon: 'mdi-close-circle' }

    return { label: '尚未確認', icon: 'mdi-help-circle-outline' }
  }
  const formatTime = (value: string | null | undefined): string => {
    if (!value) return '尚未檢查'

    const timestamp = new Date(value)

    return Number.isNaN(timestamp.getTime()) ? '時間資料無效' : timestamp.toLocaleString('zh-TW')
  }
</script>

<template>
  <section aria-live="polite" aria-labelledby="llm-services-heading">
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-3">
      <div>
        <h2 id="llm-services-heading" class="text-subtitle-1 mb-1">LLM 服務</h2>
        <p
          class="text-body-2 ma-0"
          :class="{ 'text-success': status === 'connected', 'text-error': status === 'unavailable' }"
        >
          CLI 整體檢查：{{
            status === 'checking' ? '檢查中' : status === 'unchecked' ? '尚未檢查' : statusLabel(status)
          }}
        </p>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        :loading="status === 'checking'"
        :disabled="status === 'checking'"
        @click="check"
      >
        重新檢查所有服務
      </v-btn>
    </div>

    <p v-if="status === 'unavailable' && serviceCards.length > 0" class="text-body-2 text-error mb-3">
      CLI 連線狀態無法取得：{{ message }}
    </p>

    <p v-if="serviceCards.length === 0" class="text-body-2 mb-3" :class="{ 'text-error': status === 'unavailable' }">
      {{
        inventoryError
          ? `無法取得服務清單：${inventoryError}`
          : status === 'unconfigured'
            ? message
            : status === 'unchecked'
              ? '尚未取得服務清單或檢查 CLI 連線。'
              : status === 'checking'
                ? '正在取得服務清單並檢查 CLI 服務…'
                : `${message} API 未提供服務清單。`
      }}
    </p>

    <v-row v-if="serviceCards.length > 0">
      <v-col v-for="provider in serviceCards" :key="provider.id" cols="12" md="6">
        <v-card class="h-100 pa-4" variant="outlined">
          <div class="d-flex align-center ga-3 mb-4">
            <v-avatar size="48" color="surface-variant" rounded="lg" aria-hidden="true">
              <v-icon :icon="providerIcon(provider)" size="28" />
            </v-avatar>
            <div class="flex-grow-1 min-width-0">
              <h3 class="text-subtitle-2 ma-0 text-truncate">{{ provider.name || provider.id }}</h3>
              <p class="text-caption text-medium-emphasis ma-0">{{ provider.cli || provider.id }}</p>
            </div>
            <v-chip size="small" :color="providerStatus(provider.status).color" variant="tonal">
              <v-icon start :icon="providerStatus(provider.status).icon" />
              {{ providerStatus(provider.status).label }}
            </v-chip>
          </div>
          <dl class="service-details ma-0">
            <div>
              <dt>CLI</dt>
              <dd>{{ provider.cli || 'API 未提供' }}</dd>
            </div>
            <div>
              <dt>模型</dt>
              <dd>{{ provider.model || (provider.models.length ? provider.models.join(', ') : 'API 未提供') }}</dd>
            </div>
            <div>
              <dt>檢查時間</dt>
              <dd>{{ formatTime(provider.checkedAt || checkedAt) }}</dd>
            </div>
          </dl>
          <p v-if="provider.error" class="text-body-2 text-error ma-0 mt-3">
            {{ provider.error }}
          </p>
          <p v-else-if="status === 'checking'" class="text-caption text-medium-emphasis ma-0 mt-3">
            正在檢查所有已設定服務…
          </p>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
  .service-details {
    display: grid;
    gap: 0.5rem;
  }

  .service-details > div {
    display: grid;
    grid-template-columns: 5rem minmax(0, 1fr);
    gap: 0.5rem;
  }

  .service-details dt {
    color: rgb(var(--v-theme-on-surface-variant));
  }

  .service-details dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
</style>
