import { ref } from 'vue'

const isOpen = ref(false)
const selectedCV = ref(null)   // { title: {en,fr}, path: "..." }

export function useCVModal() {
  return {
    isOpen,
    selectedCV,
    open: (cv) => { selectedCV.value = cv; isOpen.value = true },
    close: () => { isOpen.value = false }
  }
}
