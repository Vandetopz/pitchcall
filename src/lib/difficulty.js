/**
 * Computes potential points for a 1/X/2 pick based on standings positions.
 * No odds, no money — pure difficulty from league table gap.
 *
 * Position convention: 1 = top, 20 = bottom.
 * "Upset" = winner was ranked lower (higher number) than the loser.
 */

const TIERS = [
  { minGap: 13, bonus: 15 },
  { minGap:  7, bonus: 10 },
  { minGap:  3, bonus:  5 },
]

export function getPickPts(pickKey, homePos, awayPos) {
  // Draws: no directional upset possible, base points
  if (pickKey === 'X') return { pts: 10, bonus: 0, label: null }

  if (!homePos || !awayPos) return { pts: 10, bonus: 0, label: null }

  const winnerPos = pickKey === '1' ? homePos : awayPos
  const loserPos  = pickKey === '1' ? awayPos : homePos
  const gap       = winnerPos - loserPos  // positive = underdog won

  for (const { minGap, bonus } of TIERS) {
    if (gap >= minGap) return { pts: 10 + bonus, bonus, label: `+${bonus}` }
  }
  return { pts: 10, bonus: 0, label: null }
}

/**
 * Points with captain multiplier applied (for scoring display).
 */
export function getPickPtsCaptain(pickKey, homePos, awayPos) {
  const base = getPickPts(pickKey, homePos, awayPos)
  return { ...base, ptsCap: base.pts * 2 }
}

/**
 * Resolve the upset bonus for a prediction that is already known to be correct.
 * Used in scoring.js.
 */
export function resolvePoints(pick, outcome, homePos, awayPos, isCaptain) {
  if (pick !== outcome) return 0
  const { pts } = getPickPts(pick, homePos, awayPos)
  return isCaptain ? pts * 2 : pts
}
