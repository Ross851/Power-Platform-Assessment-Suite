/**
 * Locale-aware date and time formatting utilities
 * Automatically detects user's browser locale and timezone
 *
 * Bytes Software Services Limited
 * Power Platform Assessment Suite
 */

/**
 * Format a date using the user's locale
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param options - Intl.DateTimeFormat options (optional)
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(undefined, defaultOptions).format(dateObj);
}

/**
 * Format a date and time using the user's locale
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param options - Intl.DateTimeFormat options (optional)
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat(undefined, defaultOptions).format(dateObj);
}

/**
 * Format a time using the user's locale
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param options - Intl.DateTimeFormat options (optional)
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat(undefined, defaultOptions).format(dateObj);
}

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param baseDate - Base date for comparison (defaults to now)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: Date | number | string,
  baseDate: Date = new Date()
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const diffInSeconds = Math.floor((dateObj.getTime() - baseDate.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffInSeconds) >= secondsInUnit || unit === 'second') {
      const value = Math.round(diffInSeconds / secondsInUnit);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Get the user's timezone
 * @returns IANA timezone string (e.g., "Europe/London", "America/New_York")
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get the user's locale
 * @returns BCP 47 language tag (e.g., "en-GB", "en-US")
 */
export function getUserLocale(): string {
  return Intl.DateTimeFormat().resolvedOptions().locale;
}

/**
 * Format a date with full details including timezone
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @returns Formatted date string with timezone
 */
export function formatDateWithTimezone(
  date: Date | number | string
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  };

  return new Intl.DateTimeFormat(undefined, options).format(dateObj);
}

/**
 * Format a date range
 * @param startDate - Start date
 * @param endDate - End date
 * @param options - Intl.DateTimeFormat options (optional)
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date | number | string,
  endDate: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const startObj = typeof startDate === 'string' || typeof startDate === 'number'
    ? new Date(startDate)
    : startDate;

  const endObj = typeof endDate === 'string' || typeof endDate === 'number'
    ? new Date(endDate)
    : endDate;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  // @ts-ignore - formatRange is supported in modern browsers
  if (typeof Intl.DateTimeFormat.prototype.formatRange === 'function') {
    return new Intl.DateTimeFormat(undefined, defaultOptions).formatRange(startObj, endObj);
  }

  // Fallback for older browsers
  return `${formatDate(startObj, defaultOptions)} - ${formatDate(endObj, defaultOptions)}`;
}

/**
 * Parse and format an ISO date string to user's locale
 * @param isoString - ISO 8601 date string
 * @returns Formatted date string
 */
export function formatISODate(isoString: string): string {
  return formatDate(new Date(isoString));
}

/**
 * Get current date and time formatted for display
 * @returns Formatted current date and time
 */
export function getCurrentDateTime(): string {
  return formatDateTime(new Date());
}

/**
 * Get current date formatted for display
 * @returns Formatted current date
 */
export function getCurrentDate(): string {
  return formatDate(new Date());
}

/**
 * Format assessment timestamp (used throughout the application)
 * @param timestamp - Timestamp to format
 * @returns Human-readable timestamp
 */
export function formatAssessmentTimestamp(timestamp: number | string | Date): string {
  return formatDateTime(timestamp, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format last modified date for display
 * @param date - Date to format
 * @returns "Last modified: [relative time]" or formatted date
 */
export function formatLastModified(date: Date | number | string): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < 7) {
    return `Last modified ${formatRelativeTime(dateObj)}`;
  }

  return `Last modified ${formatDate(dateObj)}`;
}
