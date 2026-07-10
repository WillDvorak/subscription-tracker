/**
 * Adds `months` to a Date, capping at the last day of the target month.
 * Mirrors Java's LocalDate.plusMonths() behavior — e.g. Jan 31 + 1 = Feb 28.
 * JavaScript's native setMonth() overflows instead (Jan 31 + 1 → Mar 3).
 */
function addMonths(date, months) {
    const d = new Date(date);
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    // If the day changed, it overflowed — back up to the last day of the intended month
    if (d.getDate() !== day) d.setDate(0);
    return d;
}

/**
 * Given a renewDate string ("YYYY-MM-DD") and a renewCycle, returns the next
 * renewal date on or after today as a "YYYY-MM-DD" string.
 *
 * Mirrors the backend's calculateNextRenewal logic exactly:
 *   start from renewDate, step forward by the cycle until the date is after today.
 *
 * Returns null if either argument is missing or the cycle is unrecognized.
 */
export function getNextRenewalDate(renewDateStr, renewCycle) {
    if (!renewDateStr || !renewCycle) return null;

    const [y, m, d] = renewDateStr.split("-").map(Number);
    let next = new Date(y, m - 1, d);

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // One-time / unknown cycle — treat as a single event, return as-is
    if (!["Weekly", "Monthly", "Quarterly", "Biannually", "Yearly"].includes(renewCycle)) {
        return renewDateStr;
    }

    while (next <= todayMidnight) {
        switch (renewCycle) {
            case "Weekly":      next.setDate(next.getDate() + 7); break;
            case "Monthly":     next = addMonths(next, 1);        break;
            case "Quarterly":   next = addMonths(next, 3);        break;
            case "Biannually":  next = addMonths(next, 6);        break;
            case "Yearly":      next = addMonths(next, 12);       break;
        }
    }

    const ny = next.getFullYear();
    const nm = String(next.getMonth() + 1).padStart(2, "0");
    const nd = String(next.getDate()).padStart(2, "0");
    return `${ny}-${nm}-${nd}`;
}

/**
 * Given a renewDate and renewCycle, returns the most recent past renewal date
 * as a "YYYY-MM-DD" string — i.e. the next renewal minus one cycle.
 * Returns null for one-time / unknown cycles.
 */
export function getLastRenewalDate(renewDateStr, renewCycle) {
    const next = getNextRenewalDate(renewDateStr, renewCycle);
    if (!next) return null;
    if (!["Weekly", "Monthly", "Quarterly", "Biannually", "Yearly"].includes(renewCycle)) return null;

    const [y, m, d] = next.split("-").map(Number);
    let last = new Date(y, m - 1, d);

    switch (renewCycle) {
        case "Weekly":      last.setDate(last.getDate() - 7);  break;
        case "Monthly":     last = addMonths(last, -1);         break;
        case "Quarterly":   last = addMonths(last, -3);         break;
        case "Biannually":  last = addMonths(last, -6);         break;
        case "Yearly":      last = addMonths(last, -12);        break;
    }

    const ly = last.getFullYear();
    const lm = String(last.getMonth() + 1).padStart(2, "0");
    const ld = String(last.getDate()).padStart(2, "0");
    return `${ly}-${lm}-${ld}`;
}

/**
 * Returns the number of calendar days between today and a "YYYY-MM-DD" date string.
 * Positive = future, negative = past, 0 = today.
 * Uses UTC midnight comparison to avoid timezone/DST drift.
 */
export function daysUntil(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    const target = Date.UTC(y, m - 1, d);
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - todayUTC) / 86400000);
}
