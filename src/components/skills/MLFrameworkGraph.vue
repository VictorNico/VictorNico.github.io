<template>
  <div
    class="ml-graph-wrapper"
    ref="wrapperRef"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <svg
      :viewBox="`0 0 ${W} ${H}`"
      class="ml-graph-svg"
      role="img"
      :aria-label="t('skills.mlGraphAria')"
    >
      <defs>
        <radialGradient
          v-for="n in nodes"
          :key="`rg-${n.id}`"
          :id="`rg-${n.id}`"
          cx="35%" cy="35%" r="65%"
        >
          <stop offset="0%"   :stop-color="n.color" stop-opacity="0.55" />
          <stop offset="100%" :stop-color="n.color" stop-opacity="0.06" />
        </radialGradient>

        <filter id="ml-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Connection lines between nearby nodes -->
      <line
        v-for="(c, i) in connections"
        :key="`c-${i}`"
        :x1="c.x1" :y1="c.y1"
        :x2="c.x2" :y2="c.y2"
        :stroke="c.color"
        :stroke-opacity="c.opacity"
        stroke-width="1"
        stroke-dasharray="5 5"
      />

      <!-- Nodes -->
      <g
        v-for="n in nodes"
        :key="`n-${n.id}`"
        :transform="`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`"
        class="ml-node"
        @mouseenter="hovered = n.id"
        @mouseleave="hovered = null"
      >
        <!-- Outer glow ring -->
        <circle
          :r="n.r + 12"
          :fill="n.color"
          :fill-opacity="hovered === n.id ? 0.18 : 0.05"
          style="transition: fill-opacity 0.3s"
        />
        <!-- Main circle body -->
        <circle
          :r="n.r"
          :fill="`url(#rg-${n.id})`"
          :stroke="n.color"
          :stroke-width="hovered === n.id ? 2.5 : 1.5"
          stroke-opacity="0.9"
          style="transition: stroke-width 0.25s"
        />
        <!-- Abbreviation text -->
        <text
          text-anchor="middle"
          dominant-baseline="central"
          :fill="n.color"
          font-size="11"
          font-weight="800"
          font-family="JetBrains Mono, Courier New, monospace"
          letter-spacing="1"
        >{{ n.abbr }}</text>

        <!-- Hover tooltip -->
        <g v-if="hovered === n.id">
          <rect
            :x="-60" :y="n.r + 8"
            width="120" height="44"
            rx="6"
            fill="#0d1b2e"
            stroke-width="1"
            :stroke="n.color"
            stroke-opacity="0.7"
          />
          <text
            text-anchor="middle"
            :y="n.r + 24"
            fill="#CCD6F6"
            font-size="9.5"
            font-weight="600"
            font-family="Inter, sans-serif"
          >{{ n.label }}</text>
          <text
            text-anchor="middle"
            :y="n.r + 40"
            :fill="n.color"
            font-size="11"
            font-weight="700"
            font-family="JetBrains Mono, monospace"
          >{{ n.level }}%</text>
        </g>
      </g>
    </svg>

    <!-- Legend label when nothing is hovered -->
    <p class="ml-hint">{{ t('skills.mlHint') }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const props = defineProps({ skills: { type: Array, required: true } })
const { getTranslated } = useI18nData()
const { t } = useI18n()

const wrapperRef = ref(null)
const W = ref(700)
const H = ref(360)
const hovered = ref(null)
const mouseX = ref(-9999)
const mouseY = ref(-9999)
let raf = null
let resizeObs = null
let visObs = null

/** Build a 2-3 char abbreviation from a framework name */
function mkAbbr(name) {
  const words = name.split(/[\s/&()]+/).filter(Boolean)
  if (words.length === 1) return name.slice(0, 3).toUpperCase()
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const nodes = ref([])

function initNodes() {
  nodes.value = props.skills.map((skill, i) => {
    const label = getTranslated(skill.name)
    return {
      id: i,
      x: (W.value / (props.skills.length + 1)) * (i + 1),
      y: H.value / 2 + (Math.random() - 0.5) * 120,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      r: 34,
      color: skill.color,
      level: skill.level,
      label,
      abbr: mkAbbr(label),
    }
  })
}

const connections = computed(() => {
  const result = []
  const ns = nodes.value
  for (let i = 0; i < ns.length; i++) {
    for (let j = i + 1; j < ns.length; j++) {
      const dx = ns[i].x - ns[j].x
      const dy = ns[i].y - ns[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 190) {
        result.push({
          x1: ns[i].x, y1: ns[i].y,
          x2: ns[j].x, y2: ns[j].y,
          color: ns[i].color,
          opacity: (1 - d / 190) * 0.4,
        })
      }
    }
  }
  return result
})

function tick() {
  const mx = mouseX.value
  const my = mouseY.value

  for (const n of nodes.value) {
    // Mouse repulsion
    const dx = n.x - mx
    const dy = n.y - my
    const d = Math.sqrt(dx * dx + dy * dy) || 1
    if (d < 140) {
      const f = ((140 - d) / 140) * 0.75
      n.vx += (dx / d) * f
      n.vy += (dy / d) * f
    }

    // Random Brownian drift
    n.vx += (Math.random() - 0.5) * 0.09
    n.vy += (Math.random() - 0.5) * 0.09

    // Speed cap
    const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
    if (speed > 2.4) {
      n.vx = (n.vx / speed) * 2.4
      n.vy = (n.vy / speed) * 2.4
    }

    // Friction
    n.vx *= 0.986
    n.vy *= 0.986

    // Move
    n.x += n.vx
    n.y += n.vy

    // Boundary bounce with padding
    const pad = n.r + 14
    if (n.x < pad)              { n.x = pad;              n.vx =  Math.abs(n.vx) * 0.8 }
    if (n.x > W.value - pad)    { n.x = W.value - pad;    n.vx = -Math.abs(n.vx) * 0.8 }
    if (n.y < pad)              { n.y = pad;              n.vy =  Math.abs(n.vy) * 0.8 }
    if (n.y > H.value - pad)    { n.y = H.value - pad;    n.vy = -Math.abs(n.vy) * 0.8 }
  }

  raf = requestAnimationFrame(tick)
}

function onMouseMove(e) {
  const rect = wrapperRef.value.getBoundingClientRect()
  const scaleX = W.value / rect.width
  const scaleY = H.value / rect.height
  mouseX.value = (e.clientX - rect.left) * scaleX
  mouseY.value = (e.clientY - rect.top) * scaleY
}

function onMouseLeave() {
  mouseX.value = -9999
  mouseY.value = -9999
}

onMounted(() => {
  if (wrapperRef.value) {
    W.value = wrapperRef.value.offsetWidth
    H.value = Math.max(280, Math.min(380, W.value * 0.52))
  }
  initNodes()

  // Only run physics loop when visible
  visObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!raf) raf = requestAnimationFrame(tick)
    } else {
      if (raf) { cancelAnimationFrame(raf); raf = null }
    }
  }, { threshold: 0.1 })
  if (wrapperRef.value) visObs.observe(wrapperRef.value)

  resizeObs = new ResizeObserver(([entry]) => {
    W.value = entry.contentRect.width
    H.value = Math.max(280, Math.min(380, W.value * 0.52))
  })
  if (wrapperRef.value) resizeObs.observe(wrapperRef.value)
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  if (resizeObs) resizeObs.disconnect()
  if (visObs) visObs.disconnect()
})
</script>

<style lang="scss" scoped>
.ml-graph-wrapper {
  width: 100%;
  position: relative;
  border-radius: $radius-lg;
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.06);
  overflow: hidden;
}

.ml-graph-svg {
  display: block;
  width: 100%;
  height: auto;
}

.ml-node {
  cursor: pointer;
  user-select: none;
}

.ml-hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  font-family: $font-mono;
  color: $text-secondary;
  opacity: 0.5;
  pointer-events: none;
  white-space: nowrap;
}
</style>
