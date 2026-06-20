import { useEffect, useRef } from 'react'

const BLOCK_ID = import.meta.env.VITE_ADSGRAM_BLOCK_ID

/**
 * Non-intrusive 50px banner above the BottomNav.
 * Renders nothing when VITE_ADSGRAM_BLOCK_ID is not set (dev / no block configured).
 * When Adsgram SDK is present the banner slot is initialized automatically.
 */
export default function AdBanner() {
  const ref = useRef(null)

  useEffect(() => {
    if (!BLOCK_ID || !ref.current || !window.Adsgram) return
    // Adsgram banner initialisation — the SDK fills the container div
    window.Adsgram.init({ blockId: BLOCK_ID })
      .then(c => c.show())
      .catch(() => {})          // no ad available or dismissed — silent
  }, [])

  if (!BLOCK_ID) return null

  return (
    <div
      ref={ref}
      id="adsgram-banner"
      style={{
        position: 'fixed',
        bottom: 58,         // sits just above BottomNav (~58px)
        left: 0,
        right: 0,
        height: 50,
        zIndex: 89,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none', // let the SDK take over pointer events via its own DOM
      }}
    />
  )
}
