import { Booking, RoomBlock, ROOM_BLOCKS } from './data';

export interface IntervalCheck {
  ok: boolean;
  reason?: string;
}

const MINUTES_PER_DAY = 1440;
const MAX_BOOKING_LENGTH = 120;

/** AC1: validate the candidate interval against the clock. */
export function validateInterval(
  start: number,
  end: number,
  currentTime: number
): IntervalCheck {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { ok: false, reason: 'Please enter valid times.' };
  }
  if (start < 0 || end < 0) {
    return { ok: false, reason: 'Times cannot be before 00:00.' };
  }
  if (start >= end) {
    return { ok: false, reason: 'Start time must be before end time.' };
  }
  if (end > MINUTES_PER_DAY) {
    return { ok: false, reason: 'End time cannot be past 24:00.' };
  }
  // AC1: start must be strictly after the supplied current time.
  if (start <= currentTime) {
    return { ok: false, reason: 'Start time must be after the current time.' };
  }
  return { ok: true };
}

/** AC2: reject bookings longer than 120 minutes. */
export function checkDuration(start: number, end: number): IntervalCheck {
  if (end - start > MAX_BOOKING_LENGTH) {
    return {
      ok: false,
      reason: `Booking exceeds the 120-minute maximum (requested ${end - start} min).`,
    };
  }
  return { ok: true };
}

/** AC3: reject when the room is blocked. */
export function checkRoomBlocked(roomId: string): IntervalCheck {
  const block: RoomBlock | undefined = ROOM_BLOCKS.find(
    (b) => b.roomId === roomId
  );
  if (block) {
    return { ok: false, reason: `Room is blocked: ${block.reason}` };
  }
  return { ok: true };
}

/** AC4: touching endpoints are allowed (a ends at b.start is OK). */
export function checkOverlap(
  roomId: string,
  start: number,
  end: number,
  bookings: Booking[]
): IntervalCheck {
  const conflicting = bookings.find(
    (b) =>
      b.roomId === roomId &&
      // overlap when start < existing.end AND end > existing.start
      start < b.end && end > b.start
  );
  if (conflicting) {
    return {
      ok: false,
      reason: `Overlaps an existing booking (${formatTime(conflicting.start)}–${formatTime(conflicting.end)}, ${conflicting.bookedBy}).`,
    };
  }
  return { ok: true };
}

export interface AvailabilityResult {
  available: boolean;
  reasons: string[];
}

/** Run every acceptance condition and collect all reasons. */
export function evaluateAvailability(
  roomId: string,
  start: number,
  end: number,
  currentTime: number,
  bookings: Booking[]
): AvailabilityResult {
  const reasons: string[] = [];

  const interval = validateInterval(start, end, currentTime);
  if (!interval.ok && interval.reason) reasons.push(interval.reason);

  const duration = checkDuration(start, end);
  if (!duration.ok && duration.reason) reasons.push(duration.reason);

  const blocked = checkRoomBlocked(roomId);
  if (!blocked.ok && blocked.reason) reasons.push(blocked.reason);

  const overlap = checkOverlap(roomId, start, end, bookings);
  if (!overlap.ok && overlap.reason) reasons.push(overlap.reason);

  return { available: reasons.length === 0, reasons };
}

/** minutes -> "HH:MM" */
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** "HH:MM" -> minutes, or NaN. Accepts 24:00 as 1440 (end-of-day boundary). */
export function parseTime(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return NaN;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h === 24 && m === 0) return 1440;
  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
  return h * 60 + m;
}
