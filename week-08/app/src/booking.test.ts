import { describe, expect, test } from 'vitest';
import { canBook } from './booking';

describe('canBook: first generated suite', () => {
  const base = () => ({ now: 540, blocked: false, bookings: [{ start: 600, end: 660 }] });
  test('T01 AC4: touching after', () => expect(canBook({ ...base(), start: 660, end: 720 })).toBe(true));
  test('T02 AC1: starts now', () => expect(canBook({ ...base(), start: 540, end: 570 })).toBe(false));
  test('T03 AC1: zero duration', () => expect(canBook({ ...base(), start: 720, end: 720 })).toBe(false));
  test('T04 AC1: reversed interval', () => expect(canBook({ ...base(), start: 750, end: 720 })).toBe(false));
  test('T05 AC1: past end of day', () => expect(canBook({ ...base(), start: 1380, end: 1441 })).toBe(false));
  test('T06 AC2: exactly 120 minutes', () => expect(canBook({ ...base(), start: 720, end: 840 })).toBe(true));
  test('T07 AC2: 121 minutes', () => expect(canBook({ ...base(), start: 720, end: 841 })).toBe(false));
  test('T08 AC4: touching before', () => expect(canBook({ ...base(), start: 570, end: 600 })).toBe(true));
  test('T09 AC4: partial overlap', () => expect(canBook({ ...base(), start: 630, end: 690 })).toBe(false));
  test('T10 AC4: contains booking', () => expect(canBook({ ...base(), start: 570, end: 690 })).toBe(false));
  test('T11 AC4: inside booking', () => expect(canBook({ ...base(), start: 615, end: 645 })).toBe(false));
  test('T12 AC4: identical interval', () => expect(canBook({ ...base(), start: 600, end: 660 })).toBe(false));
  test('T13 AC3: blocked room', () => expect(canBook({ ...base(), start: 660, end: 720, blocked: true })).toBe(false));
  test('T14 AC4: no existing booking', () => expect(canBook({ ...base(), start: 630, end: 690, bookings: [] })).toBe(true));
  test('AC5: available request leaves bookings unchanged', () => {
    const input = base(); const before = structuredClone(input.bookings);
    expect(canBook({ ...input, start: 660, end: 720 })).toBe(true);
    expect(input.bookings).toEqual(before);
  });
});

test('X1 AC1: interval ends exactly at 24:00', () => {
  expect(canBook({ now: 540, blocked: false, bookings: [], start: 1320, end: 1440 })).toBe(true);
});
test('X2 AC4: interval touches two consecutive bookings', () => {
  expect(canBook({ now: 540, blocked: false, bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }], start: 660, end: 720 })).toBe(true);
});


test('BUG-A AC4: request touches two consecutive bookings on both sides', () => {
  expect(canBook({ now: 540, blocked: false, bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }], start: 660, end: 720 })).toBe(true);
});

test('BUG-B AC5: available request does not change bookings', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  expect(canBook({ now: 540, blocked: false, bookings, start: 720, end: 780 })).toBe(true);
  expect(bookings).toEqual(before);
});
