/**
 * Converts a datetime string into a human-readable "last seen" format.
 * @param datetimeStr - The datetime string in the format "Wed, 08 Jan 2025 10:14:42 GMT".
 * @returns A string describing the relative time since the datetime.
 */
export function getLastSeen(datetimeStr: string): string {
    const datetime = new Date(datetimeStr);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(datetime.getTime())) {
        return "Invalid date";
    }

    const elapsed = now.getTime() - datetime.getTime(); // Time difference in milliseconds

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return "just now";
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (days === 1) {
        return "yesterday";
    } else if (days < 7) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
        return datetime.toLocaleDateString(); // Format as date for anything older
    }
}
