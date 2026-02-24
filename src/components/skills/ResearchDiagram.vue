<template>
  <div class="research-diagram">
    <svg
      :viewBox="`0 0 ${VW} ${VH}`"
      class="diagram-svg"
      role="img"
      :aria-label="t('skills.researchDiagramAria')"
    >
      <defs>
        <radialGradient id="rd-center-grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%"   stop-color="#64FFDA" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#64FFDA" stop-opacity="0.06" />
        </radialGradient>
        <filter id="rd-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Connecting lines -->
      <line
        v-for="(n, i) in positionedNodes"
        :key="`rd-line-${i}`"
        :x1="CX" :y1="CY"
        :x2="n.x" :y2="n.y"
        :stroke="n.color"
        :stroke-opacity="hovered === i ? 0.65 : 0.18"
        :stroke-width="hovered === i ? 2 : 1"
        stroke-dasharray="6 5"
        style="transition: stroke-opacity 0.3s, stroke-width 0.3s"
      />

      <!-- Skill nodes -->
      <g
        v-for="(n, i) in positionedNodes"
        :key="`rd-node-${i}`"
        :transform="`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`"
        class="rd-node"
        @mouseenter="hovered = i"
        @mouseleave="hovered = null"
      >
        <!-- Outer glow -->
        <circle
          :r="NR + 10"
          :fill="n.color"
          :fill-opacity="hovered === i ? 0.14 : 0.04"
          style="transition: fill-opacity 0.3s"
        />
        <!-- Node circle -->
        <circle
          :r="NR"
          :fill="n.color"
          fill-opacity="0.1"
          :stroke="n.color"
          :stroke-width="hovered === i ? 2.5 : 1.5"
          style="transition: stroke-width 0.25s"
        />
        <!-- Level arc indicator -->
        <circle
          :r="NR"
          fill="none"
          :stroke="n.color"
          stroke-width="3"
          stroke-opacity="0.5"
          :stroke-dasharray="`${(n.level / 100) * (2 * Math.PI * NR).toFixed(1)} ${(2 * Math.PI * NR).toFixed(1)}`"
          :stroke-dashoffset="(2 * Math.PI * NR) * 0.25"
          stroke-linecap="round"
          style="transition: stroke-dasharray 0.6s ease"
        />
        <!-- Abbreviation -->
        <text
          text-anchor="middle"
          dominant-baseline="central"
          :fill="n.color"
          font-size="11"
          font-weight="800"
          font-family="JetBrains Mono, monospace"
          letter-spacing="0.5"
        >{{ n.abbr }}</text>

        <!-- Name label below node -->
        <text
          text-anchor="middle"
          :y="NR + 14"
          fill="#A8B2CC"
          font-size="8.5"
          font-weight="600"
          font-family="Inter, sans-serif"
        >{{ n.shortLabel }}</text>

        <!-- Hover annotation box -->
        <g v-if="hovered === i" class="rd-annotation">
          <rect
            :x="n.annX"
            :y="n.annY"
            :width="ANN_W"
            height="58"
            rx="7"
            fill="#0d1b2e"
            :stroke="n.color"
            stroke-width="1"
            stroke-opacity="0.7"
          />
          <!-- Full label (2 lines max via tspan) -->
          <text
            :x="n.annX + ANN_W / 2"
            :y="n.annY + 14"
            text-anchor="middle"
            fill="#CCD6F6"
            font-size="8.5"
            font-weight="600"
            font-family="Inter, sans-serif"
          >{{ n.line1 }}</text>
          <text
            v-if="n.line2"
            :x="n.annX + ANN_W / 2"
            :y="n.annY + 26"
            text-anchor="middle"
            fill="#CCD6F6"
            font-size="8.5"
            font-family="Inter, sans-serif"
          >{{ n.line2 }}</text>
          <!-- Level bar bg -->
          <rect
            :x="n.annX + 8"
            :y="n.annY + 35"
            :width="ANN_W - 16"
            height="5"
            rx="2"
            fill="rgba(255,255,255,0.07)"
          />
          <!-- Level bar fill -->
          <rect
            :x="n.annX + 8"
            :y="n.annY + 35"
            :width="((n.level / 100) * (ANN_W - 16)).toFixed(1)"
            height="5"
            rx="2"
            :fill="n.color"
            fill-opacity="0.85"
          />
          <!-- Percentage -->
          <text
            :x="n.annX + ANN_W / 2"
            :y="n.annY + 52"
            text-anchor="middle"
            :fill="n.color"
            font-size="10"
            font-weight="700"
            font-family="JetBrains Mono, monospace"
          >{{ n.level }}%</text>
        </g>
      </g>

      <!-- Center hub -->
      <g :transform="`translate(${CX},${CY})`">
        <circle :r="CR + 12" fill="#64FFDA" fill-opacity="0.04" />
        <circle :r="CR" fill="url(#rd-center-grad)" stroke="#64FFDA" stroke-width="2" stroke-opacity="0.55" />
        <text
          text-anchor="middle"
          y="-5"
          fill="#64FFDA"
          font-size="9.5"
          font-weight="700"
          font-family="JetBrains Mono, monospace"
          letter-spacing="1.5"
        >RESEARCH</text>
        <text
          text-anchor="middle"
          y="8"
          fill="#64FFDA"
          font-size="9.5"
          font-weight="700"
          font-family="JetBrains Mono, monospace"
          letter-spacing="1.5"
        >HUB</text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nData } from '../../composables/useI18nData'

const props = defineProps({ skills: { type: Array, required: true } })
const { getTranslated } = useI18nData()
const { t } = useI18n()

const VW   = 720
const VH   = 440
const CX   = VW / 2
const CY   = VH / 2
const R    = 158   // radius to skill nodes
const NR   = 33    // node circle radius
const CR   = 42    // center hub radius
const ANN_W = 128  // annotation box width

const hovered = ref(null)

function mkAbbr(name) {
  const words = name.split(/[\s/&()]+/).filter(Boolean)
  if (words.length === 1) return name.slice(0, 3).toUpperCase()
  return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function splitLabel(name, maxChars = 16) {
  if (name.length <= maxChars) return [name, '']
  const pivot = name.lastIndexOf(' ', maxChars)
  return pivot > 0
    ? [name.slice(0, pivot), name.slice(pivot + 1)]
    : [name.slice(0, maxChars), name.slice(maxChars)]
}

const positionedNodes = computed(() =>
  props.skills.map((skill, i) => {
    const angleDeg = (i * 360) / props.skills.length
    const rad = (angleDeg - 90) * (Math.PI / 180)
    const x = CX + R * Math.cos(rad)
    const y = CY + R * Math.sin(rad)
    const fullLabel = getTranslated(skill.name)
    const [line1, line2] = splitLabel(fullLabel, 18)

    // Annotation box positioning (relative to node local space)
    const annH = 58
    // Horizontal: right of center → show to the left of node, left → show to right
    let annX
    if (x > CX + 20)       annX = -(ANN_W + NR + 4)
    else if (x < CX - 20)  annX = NR + 4
    else                    annX = -ANN_W / 2  // top/bottom: centered

    // Vertical: show below node unless it would clip the SVG bottom
    let annY
    if (y + NR + annH + 8 > VH - 4)  annY = -(NR + annH + 4)
    else                               annY = NR + 4

    return {
      x, y,
      color: skill.color,
      level: skill.level,
      abbr: mkAbbr(fullLabel),
      shortLabel: fullLabel.split(/[\s/]+/)[0],
      line1, line2,
      annX, annY,
    }
  })
)
</script>

<style lang="scss" scoped>
.research-diagram {
  width: 100%;
  background: $bg-dark;
  border: 1px solid rgba(100, 255, 218, 0.06);
  border-radius: $radius-lg;
  overflow: hidden;
}

.diagram-svg {
  display: block;
  width: 100%;
  height: auto;
}

.rd-node {
  cursor: pointer;
  user-select: none;
}

.rd-annotation {
  pointer-events: none;
}
</style>
