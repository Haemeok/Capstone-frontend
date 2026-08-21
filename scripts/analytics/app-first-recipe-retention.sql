WITH candidate_app_recipe_views AS (
  SELECT
    distinct_id,
    timestamp
  FROM events
  WHERE event = '$pageview'
    AND timestamp >= toStartOfDay(now()) - interval 21 day
    AND timestamp < toStartOfDay(now()) - interval 7 day
    AND properties.is_native_app = true
    AND match(properties.$pathname, '^/(ja/|en/)?recipes/[^/]+$')
    AND properties.$pathname NOT IN (
      '/recipes/new',
      '/recipes/my-fridge',
      '/ja/recipes/new',
      '/ja/recipes/my-fridge',
      '/en/recipes/new',
      '/en/recipes/my-fridge'
    )
),
candidate_cohorts AS (
  SELECT
    distinct_id,
    min(timestamp) AS cohort_at
  FROM candidate_app_recipe_views
  GROUP BY distinct_id
),
historical_recipe_views AS (
  SELECT
    distinct_id,
    timestamp
  FROM events
  WHERE event = '$pageview'
    AND timestamp >= toStartOfDay(now()) - interval 365 day
    AND timestamp < toStartOfDay(now()) - interval 7 day
    AND match(properties.$pathname, '^/(ja/|en/)?recipes/[^/]+$')
    AND properties.$pathname NOT IN (
      '/recipes/new',
      '/recipes/my-fridge',
      '/ja/recipes/new',
      '/ja/recipes/my-fridge',
      '/en/recipes/new',
      '/en/recipes/my-fridge'
    )
),
new_app_recipe_viewers AS (
  SELECT
    candidate_cohorts.distinct_id,
    candidate_cohorts.cohort_at
  FROM candidate_cohorts
  LEFT JOIN historical_recipe_views
    ON historical_recipe_views.distinct_id = candidate_cohorts.distinct_id
      AND historical_recipe_views.timestamp < candidate_cohorts.cohort_at
  GROUP BY candidate_cohorts.distinct_id, candidate_cohorts.cohort_at
  HAVING countIf(historical_recipe_views.distinct_id != '') = 0
),
app_pageviews AS (
  SELECT
    distinct_id,
    timestamp
  FROM events
  WHERE event = '$pageview'
    AND timestamp >= toStartOfDay(now()) - interval 20 day
    AND properties.is_native_app = true
),
device_returns AS (
  SELECT
    new_app_recipe_viewers.distinct_id,
    new_app_recipe_viewers.cohort_at,
    max(
      if(
        toDate(app_pageviews.timestamp) > toDate(new_app_recipe_viewers.cohort_at)
          AND toDate(app_pageviews.timestamp) <= toDate(new_app_recipe_viewers.cohort_at) + interval 7 day,
        1,
        0
      )
    ) AS returned_within_7d
  FROM new_app_recipe_viewers
  LEFT JOIN app_pageviews
    ON app_pageviews.distinct_id = new_app_recipe_viewers.distinct_id
  GROUP BY new_app_recipe_viewers.distinct_id, new_app_recipe_viewers.cohort_at
)
SELECT
  toDate(toStartOfDay(now()) - interval 21 day) AS cohort_start_date,
  toDate(toStartOfDay(now()) - interval 8 day) AS cohort_end_date,
  count() AS new_app_recipe_devices,
  sum(returned_within_7d) AS returned_app_devices,
  round(sum(returned_within_7d) * 100.0 / count(), 2) AS d1_to_d7_return_rate_pct
FROM device_returns
