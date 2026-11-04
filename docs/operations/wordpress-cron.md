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

## November 4 missed report diagnosis

All four daily export actions (20670–20673) started at 06:00:07–06:00:08 PST
and completed at 06:00:08. The external cron runner worked. Mailgun had no
report events for that run; it confirmed delivery of all 12 later manual reports
(ham, turkey breast, and turkey around 09:39 PST; roast around 09:58 PST).

The four reservation plugins call `wp_tempnam()` without loading
`wp-admin/includes/file.php`. Admin requests load this helper, but cron requests
do not. Report preparation throws `Call to undefined function wp_tempnam()`.
The plugins catch the error and record a generic preparation failure instead of
throwing, so Action Scheduler marks the actions complete despite no email send.
Later manual sends overwrite the last-run option, obscuring the earlier failure.

Backend fix: in `send_reports()` in each of the turkey, turkey breast,
ham, and roast plugins, load the helper before creating attachments:

```php
if ( ! function_exists( 'wp_tempnam' ) ) {
    require_once ABSPATH . 'wp-admin/includes/file.php';
}
```

Verified as `www-data` in a cron-context PHP process: without the include, all
four report types fail before reaching mail; with the include, all 12 scoped
reports create valid CSV attachments and reach the mail filter. Diagnostic mail
was blocked and last-run options preserved. This verification loaded the helper
only in that process; it did **not** deploy a persistent plugin fix.

### Permanent fix deployed November 4

Applied to all four plugins in `dwgreenco/siesels-woocommerce-backend`, commit
`964e08caa23e76088836f5105cb03ba91640a7dc`, and pushed to `main`. Northflank
build `nimble-pail-3667` succeeded; deployment completed at 12:38 PST / 13:38
Arizona time. The schedule was unchanged.

Verified on the new production container as `www-data`: the helper was absent
after cron bootstrap, all four deployed plugins contained the fix, and all 12
reports created nonempty CSV attachments and reached the mail filter without
manually loading the helper. Diagnostic emails were blocked and last-run options
preserved. No reports were resent during verification.

New backend regression test `tests/cron-report-test.php` passes for all four
plugins and fails against each original plugin. PHP syntax checks pass. Existing
per-plugin reporting suites have stale CSV column expectations and fail on the
original source as well as the fixed source; these were left unchanged.

The next scheduled send remains November 5 at approximately 06:00 PST (07:00
Arizona time). Verify both report results and Mailgun events after that run;
Action Scheduler completion alone is insufficient.

## CSV customer columns updated November 4

Backend commit `02bc0f16df71765a6f492d0ed499e9053349c593` adds `Order Date`
after `Order Number` and replaces `Customer Name` with `First Name` and `Last Name`
in all four reservation report types. Both emailed CSVs and admin downloads use
the same builder. Dates use the order creation timestamp, formatted `YYYY-MM-DD`
in the WordPress timezone (`America/Los_Angeles`); missing creation dates remain
blank. Names use the stored billing first and last name fields without splitting.

Northflank build `tranquil-crowd-2977` and deployment succeeded. Verified all 12
production master/store CSVs (178 rows at verification) against stored order
dates and billing names, without emailing reports. Regression checks cover
Pacific date rollover, missing dates/names, multiword names, CSV escaping, and
column alignment.

Reservation forms and API validation now require separate first and last names
and pass them directly into WooCommerce billing fields. The former combined
`customer.name` request field is no longer accepted. Existing orders retain their
stored names. Targeted form/API tests and the production build pass. The broader
frontend suite has an existing pickup-window expectation for October 14 that
conflicts with the configured November 20 start; pickup windows were unchanged.
