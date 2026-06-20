/**
 * Adsgram wrapper for Telegram Mini App.
 * Block ID comes from VITE_ADSGRAM_BLOCK_ID env var.
 * All ad display is opt-in or limited (1× per round interstitial, rewarded by choice).
 * No "you must watch ad to continue" mechanics exist anywhere in the app.
 */

const BLOCK_ID = import.meta.env.VITE_ADSGRAM_BLOCK_ID

// Session-level interstitial throttle: once per (league, gameweek) pair
const INTERSTITIAL_KEY = 'pitchcall_ad_seen'

let _controller = null

async function getController() {
  if (_controller) return _controller
  if (!BLOCK_ID || !window.Adsgram) return null
  try {
    _controller = await window.Adsgram.init({ blockId: BLOCK_ID })
    return _controller
  } catch (e) {
    console.warn('[ads] Adsgram init failed:', e)
    return null
  }
}

/**
 * Show interstitial at most once per (league + gameweek) per session.
 * Call after the user locks in their picks for a round.
 */
export async function showInterstitialOnce(league, gameweek) {
  const key = `${league}|${gameweek}`
  const seen = sessionStorage.getItem(INTERSTITIAL_KEY)
  if (seen === key) return  // already shown this round
  const c = await getController()
  if (!c) return
  try {
    await c.show()
    sessionStorage.setItem(INTERSTITIAL_KEY, key)
  } catch {
    // user dismissed early — no penalty, no retry
  }
}

/**
 * Show a rewarded video ad.
 * Returns { earned: true } if user watched to completion, { earned: false } otherwise.
 * The caller decides what cosmetic reward to give — never a gameplay advantage.
 */
export async function showRewardedVideo() {
  const c = await getController()
  if (!c) return { earned: false }
  try {
    const result = await c.show()
    return { earned: result?.done ?? true }
  } catch {
    return { earned: false }
  }
}
