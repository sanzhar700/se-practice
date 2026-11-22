export type Interval = { start: number; end: number };
export type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

export const ROOMS: Room[] = [
  { id: 'fictional-1', name: 'Fictional Room 1', blocked: false, bookings: [{ start: 600, end: 660 }] },
];
