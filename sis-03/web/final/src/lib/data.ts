export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes since midnight
  end: number; // minutes since midnight
  bookedBy: string;
}

export interface RoomBlock {
  roomId: string;
  reason: string;
}

export const ROOMS: Room[] = [
  { id: 'r1', name: 'Aurora Hall', building: 'North Wing', capacity: 40 },
  { id: 'r2', name: 'Beacon Room', building: 'Library', capacity: 12 },
  { id: 'r3', name: 'Cedar Lab', building: 'Science Block', capacity: 24 },
  { id: 'r4', name: 'Dusk Lounge', building: 'Student Center', capacity: 8 },
];

export const INITIAL_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 600, end: 660, bookedBy: 'Dr. Vega' },
  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Study Group A' },
  { id: 'b4', roomId: 'r3', start: 720, end: 810, bookedBy: 'Lab Session' },
  { id: 'b5', roomId: 'r4', start: 600, end: 660, bookedBy: 'Book Club' },
  { id: 'b6', roomId: 'r4', start: 700, end: 760, bookedBy: 'Study Group B' },
];

export const ROOM_BLOCKS: RoomBlock[] = [
  { roomId: 'r3', reason: 'Maintenance — HVAC repair' },
];
