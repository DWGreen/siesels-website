# WordPress scheduled task runner

Configured November 3, 2026 in Northflank project `sieselsandiowa`.

- Job: `wordpress-cron`, calls `https://manage.bestmeatssandiego.com/wp-cron.php`.
- Schedule: `*/5 * * * *` (every five minutes).
- Container: `curlimages/curl:8.12.1`; compute plan `nf-compute-10`.
- Overlap policy: forbid; deadline: 180 seconds; retry limit: 1.
- Definition: `wordpress-cron-job.json`. Do not create a duplicate job.

An automatic scheduled run and a manual test were started during setup. Check
Northflank job run history for success; a successful HTTP call alone does not
prove a report email was delivered. Verify Last run in each reservation report
page and completed actions in WooCommerce > Status > Scheduled Actions.

WordPress timezone was changed from UTC to `America/Los_Angeles` in its database.
The four reservation export actions were rescheduled for November 4, 2026 at
06:00 PST, recurring every 24 hours. The plugin recurrence can drift by an hour
across daylight-saving transitions; it does not currently recalculate local
06:00 after each run.

No shell edits were made to wp-config.php or to the running plugin files. The
external cron job works whether traffic-triggered WP-Cron is enabled or disabled.
Disabling traffic-triggered cron is optional and should be done through persistent
backend source/configuration, not ephemeral container edits.

This job processes all due WordPress cron work, not just reservation reports.
It does not send reports on every five-minute invocation.
