<template>
  <div class="polar-wrapper" ref="wrapperRef">
    <svg
      :viewBox="`0 0 ${VW} ${VH}`"
      class="polar-svg"
      role="img"
      :aria-label="t('skills.polarChartAria')"
    >
      <defs>
        <filter id="pc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Grid rings -->
      <circle
        v-for="ring in [0.25, 0.5, 0.75, 1]"
        :key="`ring-${ring}`"
        :cx="CX" :cy="CY"
        :r="MAX_R * ring"
        fill="none"
        stroke="rgba(100,255,218,0.07)"
        stroke-width="1"
        stroke-dasharray="3 4"
      />

      <!-- Axis lines (thin) -->
      <line
        v-for="(sec, i) in sectors"
        :key="`axis-${i}`"
        :x1="CX" :y1="CY"
        :x2="CX + MAX_R * Math.cos(sec.midRad - Math.PI / 2)"
        :y2="CY + MAX_R * Math.sin(sec.midRad - Math.PI / 2)"
        stroke="rgba(100,255,218,0.06)"
        stroke-width="1"
      />

      <!-- Sector paths -->
      <path
        v-for="(sec, i) in sectors"
        :key="`sec-${i}`"
        :d="sectorPath(sec, i)"
        :fill="sec.color"
        :fill-opacity="hovered === i ? 0.45 : 0.25"
        :stroke="sec.color"
        stroke-width="1.5"
        stroke-opacity="0.9"
        stroke-linejoin="round"
        class="pc-sector"
        :style="{ transform: hovered === i ? `scale(1.06)` : 'scale(1)', transformOrigin: `${CX}px ${CY}px` }"
        @mouseenter="hovered = i"
        @mouseleave="hovered = null"
      />

      <!-- Axis labels -->
      <text
        v-for="(sec, i) in sectors"
        :key="`lbl-${i}`"
        :x="labelPos(sec).x"
        :y="labelPos(sec).y"
        :text-anchor="labelAnchor(sec)"
        dominant-baseline="middle"
        fill="#A8B2CC"
        :fill-opacity="hovered === i ? 1 : 0.75"
        font-size="9.5"
        font-weight="600"
        font-family="Inter, sans-serif"
        style="pointer-events: none; transition: fill-opacity 0.3s"
      >{{ sec.shortName }}</text>

      <!-- Hover tooltip -->
      <g v-if="hovered !== null" class="pc-tooltip">
        <rect
          :x="CX - 60" :y="CY - 22"
          width="120" height="44"
          rx="8"
          fill="#0d1b2e"
          :stroke="sectors[hovered].color"
          stroke-width="1"
          stroke-opacity="0.8"
        />
        <text
          :x="CX" :y="CY - 7"
          text-anchor="middle"
          fill="#CCD6F6"
          font-size="9"
          font-weight="600"
          font-family="Inter, sans-serif"
        >{{ sectors[hovered].shortName }}</text>
        <text
          :x="CX" :y="CY + 8"
          text-anchor="middle"
          :fill="sectors[hovered].color"
          font-size="12"
          font-weight="800"
          font-family="JetBrains Mono, monospace"
        >{{ sectors[hovered].level }}%</text>
      </g>

      <!-- Center dot -->
      <circle :cx="CX" :cy="CY" r="5" fill="#64FFDA" fill-opacity="0.4" />
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const props = defineProps({ skills: { type: Array, required: true } })
const { getTranslated } = useI18nData()
const { t } = useI18n()

const VW    = 560
const VH    = 520
const CX    = VW / 2
const CY    = VH / 2 + 10   // slight offset for label clearance
const MAX_R = 185

const hovered     = ref(null)
const animProgress = ref(0)
const wrapperRef  = ref(null)

let animRaf = null
let ioObserver = null

// Draw-in animation triggered by IntersectionObserver
onMounted(() => {
  function startAnim() {
    let start = null
    function step(ts) {
      if (!start) start = ts
      animProgress.value = Math.min((ts - start) / 1400, 1)
      if (animProgress.value < 1) animRaf = requestAnimationFrame(step)
      else animRaf = null
    }
    animRaf = requestAnimationFrame(step)
  }

  ioObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        ioObserver.disconnect()
        ioObserver = null
        startAnim()
      }
    },
    { threshold: 0.25 }
  )

  if (wrapperRef.value) ioObserver.observe(wrapperRef.value)
})

onUnmounted(() => {
  if (animRaf) cancelAnimationFrame(animRaf)
  if (ioObserver) ioObserver.disconnect()
})

const N = computed(() => props.skills.length)

const sectors = computed(() =>
  props.skills.map((skill, i) => {
    const fullLabel = getTranslated(skill.name)
    const shortName = fullLabel.split(/[\s/]+/)[0]
    const sliceDeg  = 360 / N.value
    const startDeg  = i * sliceDeg
    const endDeg    = startDeg + sliceDeg
    const midDeg    = startDeg + sliceDeg / 2
    return {
      color: skill.color,
      level: skill.level,
      shortName,
      startDeg,
      endDeg,
      midDeg,
      midRad: (midDeg * Math.PI) / 180,
    }
  })
)

function toRad(deg) { return ((deg - 90) * Math.PI) / 180 }

function sectorPath(sec, i) {
  const r = (sec.level / 100) * MAX_R * animProgress.value
  if (r < 1) return ''

  const a1 = toRad(sec.startDeg)
  const a2 = toRad(sec.endDeg)
  const x1 = CX + r * Math.cos(a1)
  const y1 = CY + r * Math.sin(a1)
  const x2 = CX + r * Math.cos(a2)
  const y2 = CY + r * Math.sin(a2)
  const largeArc = sec.endDeg - sec.startDeg > 180 ? 1 : 0

  return `M ${CX},${CY} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`
}

const LABEL_R = MAX_R * 1.16

function labelPos(sec) {
  const rad = toRad(sec.midDeg)
  return {
    x: CX + LABEL_R * Math.cos(rad),
    y: CY + LABEL_R * Math.sin(rad),
  }
}

function labelAnchor(sec) {
  const x = labelPos(sec).x
  if (x < CX - 10)  return 'end'
  if (x > CX + 10)  return 'start'
  return 'middle'
}
</script>

<style lang="scss" scoped>
.polar-wrapper {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.06);
  border-radius: $radius-lg;
  overflow: hidden;
}

.polar-svg {
  display: block;
  width: 100%;
  height: auto;
}

.pc-sector {
  cursor: pointer;
  transition: fill-opacity 0.3s, transform 0.25s;
}

.pc-tooltip {
  pointer-events: none;
}
</style>
