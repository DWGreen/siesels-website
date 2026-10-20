# Reservation Date Windows

Edit `src/data/storeLocations.ts` to configure each reservation type:
`turkey`, `turkey-breast`, `roast`, and `ham`.

- `reservationOrderingWindows`: dates when customers can submit orders.
- `reservationPickupWindows`: dates customers can choose for pickup.

Each entry has `startDate` and `endDate` in `YYYY-MM-DD` format. Both
boundaries are inclusive. Use `null` for an unbounded start or end.
Pickup dates cannot be earlier than today, even with an unbounded start.
Dates use the America/Los_Angeles timezone.

For example, an ordering window ending `2026-11-20` can have a pickup
window from `2026-11-23` through `2026-11-26`. Customers can reserve those
pickup dates while ordering is open, but cannot submit after November 20.

The pickup controls and API validation use the same pickup configuration.
Ordering banners and API submission gates use the ordering configuration.
Invalid or reversed windows reject the corresponding operation.

Initial pickup windows match the previous dates. Change the two sets
independently to the intended dates, then deploy the website changes.
WordPress report schedules and historical report contents are unaffected.