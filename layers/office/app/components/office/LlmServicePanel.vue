<script setup lang="ts">
  type ServiceCard = {
    id: string
    name: string
    statusLabel: string
    statusColor?: string
    statusIcon: string
    brandSrc?: string
    brandClass?: string
    brandInitial?: string
  }

  const { providers, checking, check } = useLlmCliHealth()
  onMounted(() => void check())

  const brandMark = (id: string): { src?: string; className?: string; initial?: string } => {
    if (/anthropic/i.test(id)) return { src: '/icons/anthropic.svg', className: 'service-brand-image' }
    if (/openai/i.test(id)) return { src: '/icons/openai.svg', className: 'service-brand-image service-brand-openai' }
    if (/xai/i.test(id)) return { src: '/icons/xai.svg', className: 'service-brand-image' }

    return { initial: id.trim().charAt(0).toUpperCase() || '?' }
  }

  const providerStatus = (value: string): { label: string; color?: string; icon: string } => {
    if (value === 'checking') return { label: '連線中', color: 'info', icon: 'mdi-loading' }
    if (value === 'connected') return { label: '已連線', color: 'success', icon: 'mdi-check-circle' }
    if (value === 'unavailable' || value === 'failed') {
      return { label: '離線', color: 'error', icon: 'mdi-close-circle' }
    }

    return { label: '尚未確認', icon: 'mdi-help-circle-outline' }
  }

  const serviceCards = computed<ServiceCard[]>(() =>
    providers.value.map((provider) => {
      const mark = brandMark(provider.id)
      const status = providerStatus(provider.status)

      return {
        id: provider.id,
        name: provider.name,
        statusLabel: status.label,
        statusColor: status.color,
        statusIcon: status.icon,
        brandSrc: mark.src,
        brandClass: mark.className,
        brandInitial: mark.initial,
      }
    }),
  )
</script>

<template>
  <section aria-live="polite" aria-labelledby="llm-services-heading">
    <div class="d-flex align-center justify-space-between mb-2">
      <h2 id="llm-services-heading" class="text-subtitle-1 ma-0">LLM 服務</h2>
      <v-btn
        icon="mdi-refresh"
        size="small"
        variant="text"
        aria-label="重新檢查 LLM 服務連線"
        :loading="checking"
        :disabled="checking"
        @click="check()"
      />
    </div>

    <div v-if="serviceCards.length" class="service-grid">
      <v-card v-for="service in serviceCards" :key="service.id" class="service-card" variant="outlined">
        <img
          v-if="service.brandSrc"
          :class="['service-mark', service.brandClass]"
          :src="service.brandSrc"
          alt=""
          aria-hidden="true"
        />
        <span v-else class="service-mark service-initial" aria-hidden="true">{{ service.brandInitial }}</span>
        <span class="service-name">{{ service.name }}</span>
        <v-chip size="x-small" :color="service.statusColor" variant="tonal">
          <v-icon start :icon="service.statusIcon" />
          {{ service.statusLabel }}
        </v-chip>
      </v-card>
    </div>
    <p v-else class="text-body-2 text-medium-emphasis ma-0">尚未取得服務狀態</p>
  </section>
</template>

<style scoped>
  .service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
    gap: 0.5rem;
  }

  .service-card {
    display: flex;
    min-height: 3.75rem;
    align-items: center;
    gap: 0.6rem;
    padding: 0.65rem 0.75rem;
  }

  .service-mark {
    width: 1.5rem;
    height: 1.5rem;
    flex: 0 0 1.5rem;
    object-fit: contain;
  }

  .service-brand-image {
    border-radius: 50%;
    background: #fff;
    padding: 0.15rem;
  }

  .service-brand-openai {
    background: #000;
  }

  .service-initial {
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgb(var(--v-theme-surface-variant));
    color: rgb(var(--v-theme-on-surface-variant));
    font-size: 0.85rem;
    font-weight: 700;
  }

  .service-name {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    font-size: 0.875rem;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
