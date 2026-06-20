-- ============================================================
-- PitchCall — scoring schema
-- Run in Supabase → SQL Editor
-- NOTE: predictions already has points + resolved columns.
--       Only the resolve_fixture function is missing.
-- ============================================================


-- 1. Safety-net: ensure columns exist (already done in your schema)
ALTER TABLE predictions
  ADD COLUMN IF NOT EXISTS points   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT FALSE;

UPDATE predictions SET points   = 0     WHERE points   IS NULL;
UPDATE predictions SET resolved = FALSE WHERE resolved IS NULL;


-- ============================================================
-- 2. Leaderboard view (replace existing to add hit_rate)
-- predictions.user_id → profiles.id  (integer FK, NOT telegram_id)
-- ============================================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id           AS user_id,
  p.telegram_id,
  p.username,
  p.first_name,
  COALESCE(SUM(pr.points), 0)::INTEGER AS total_points,
  COUNT(pr.id) FILTER (WHERE pr.resolved = TRUE)::INTEGER AS predictions_made,
  COUNT(pr.id) FILTER (WHERE pr.resolved = TRUE AND pr.points > 0)::INTEGER AS correct_predictions,
  CASE
    WHEN COUNT(pr.id) FILTER (WHERE pr.resolved = TRUE) = 0 THEN 0.0
    ELSE COUNT(pr.id) FILTER (WHERE pr.resolved = TRUE AND pr.points > 0)::FLOAT
         / COUNT(pr.id) FILTER (WHERE pr.resolved = TRUE)
  END AS hit_rate
FROM profiles p
LEFT JOIN predictions pr ON pr.user_id = p.id
GROUP BY p.id, p.telegram_id, p.username, p.first_name
ORDER BY total_points DESC;


-- ============================================================
-- 3. resolve_fixture — call from SQL Editor when a match ends
-- fixture IDs are INTEGER (not UUID)
-- Usage: SELECT resolve_fixture(1);  -- fixture id
-- ============================================================
CREATE OR REPLACE FUNCTION resolve_fixture(p_fixture_id INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_home  INTEGER;
  v_away  INTEGER;
  v_stat  TEXT;
  v_out   TEXT;
  v_count INTEGER;
BEGIN
  SELECT home_score, away_score, status
    INTO v_home, v_away, v_stat
    FROM fixtures
   WHERE id = p_fixture_id;

  IF v_stat IS DISTINCT FROM 'finished' THEN
    RETURN jsonb_build_object('error', 'not_finished', 'status', v_stat);
  END IF;

  IF    v_home > v_away THEN v_out := '1';
  ELSIF v_home = v_away THEN v_out := 'X';
  ELSE                       v_out := '2';
  END IF;

  UPDATE predictions
     SET points   = CASE
                      WHEN pick = v_out AND is_captain = TRUE  THEN 20
                      WHEN pick = v_out                        THEN 10
                      ELSE 0
                    END,
         resolved = TRUE
   WHERE fixture_id = p_fixture_id
     AND (resolved = FALSE OR resolved IS NULL);

  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'outcome',  v_out,
    'resolved', v_count
  );
END;
$$;


-- ============================================================
-- 4. Allow RLS update on fixtures for service_role only
-- (so JS resolveAll() can set status='finished' in future)
-- ============================================================
-- ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "service can update fixtures"
--   ON fixtures FOR UPDATE TO service_role USING (true);


-- ============================================================
-- 5. TEST — run end-to-end
-- ============================================================
-- Step 1: mark a fixture finished
-- UPDATE fixtures SET home_score=2, away_score=1, status='finished' WHERE id=1;

-- Step 2: resolve it
-- SELECT resolve_fixture(1);

-- Step 3: verify predictions
-- SELECT id, pick, is_captain, points, resolved FROM predictions WHERE fixture_id=1;

-- Step 4: verify leaderboard
-- SELECT * FROM leaderboard;
