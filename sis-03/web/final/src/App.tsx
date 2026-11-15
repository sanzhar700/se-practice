import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  CalendarClock,
  Lock,
} from 'lucide-react';
import {
  ROOMS,
  INITIAL_BOOKINGS,
  ROOM_BLOCKS,
  Room,
  Booking,
} from '@/lib/data';
import {
  evaluateAvailability,
  formatTime,
  parseTime,
} from '@/lib/availability';

function App() {
  const [bookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [startStr, setStartStr] = useState('11:00');
  const [endStr, setEndStr] = useState('12:00');
  const [currentTime, setCurrentTime] = useState<number>(540); // 09:00
  const [nowEdited, setNowEdited] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const start = parseTime(startStr);
  const end = parseTime(endStr);

  const selectedRoom: Room =
    ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];

  const result = useMemo(
    () =>
      evaluateAvailability(roomId, start, end, currentTime, bookings),
    [roomId, start, end, currentTime, bookings]
  );

  const roomBookings = bookings.filter((b) => b.roomId === roomId);
  const roomBlock = ROOM_BLOCKS.find((b) => b.roomId === roomId);

  const nowTimeStr = formatTime(currentTime);

  function setNow(str: string) {
    const v = parseTime(str);
    if (Number.isNaN(v)) {
      setNowEdited(true);
      return;
    }
    setCurrentTime(v);
    setNowEdited(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-xl bg-emerald-600 p-2.5 text-white shadow-sm">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                Smart Campus Room Availability
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Check whether a campus room is free for your requested time slot.
              </p>
            </div>
          </div>
        </header>

        <div className="grid min-w-0 gap-6 lg:grid-cols-5">
          {/* Form panel */}
          <section className="min-w-0 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Check a slot</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Room
                  </label>
                  <select
                    value={roomId}
                    onChange={(e) => {
                      setRoomId(e.target.value);
                      setSubmitted(false);
                    }}
                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {ROOMS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.building}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Start time
                    </label>
                    <input
                      type="time"
                      value={startStr}
                      onChange={(e) => {
                        setStartStr(e.target.value);
                        setSubmitted(false);
                      }}
                      className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      End time
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="([01]\d|2[0-3]):[0-5]\d|24:00"
                      placeholder="HH:MM"
                      value={endStr}
                      onChange={(e) => {
                        setEndStr(e.target.value);
                        setSubmitted(false);
                      }}
                      className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Up to 24:00 for end-of-day.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Current time (simulated clock)
                  </label>
                  <input
                    type="time"
                    value={nowTimeStr}
                    onChange={(e) => setNow(e.target.value)}
                    className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Used to ensure the requested start is in the future.
                  </p>
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
                >
                  Check availability
                </button>
              </div>
            </div>

            {/* Decision card */}
            {submitted && (
              <div
                className={`mt-4 rounded-2xl border p-5 shadow-sm ${
                  result.available
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-rose-200 bg-rose-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.available ? (
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-600" />
                  )}
                  <div className="min-w-0">
                    <h3
                      className={`text-base font-semibold ${
                        result.available
                          ? 'text-emerald-800'
                          : 'text-rose-800'
                      }`}
                    >
                      {result.available ? 'Available' : 'Unavailable'}
                    </h3>
                    {result.available ? (
                      <p className="mt-1 text-sm text-emerald-700">
                        {selectedRoom.name} is free from {formatTime(start)} to{' '}
                        {formatTime(end)}.
                      </p>
                    ) : (
                      <ul className="mt-1.5 space-y-1 text-sm text-rose-700">
                        {result.reasons.map((r, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span aria-hidden>•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      Existing bookings were not changed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {nowEdited && Number.isNaN(parseTime(nowTimeStr)) && (
              <p className="mt-2 text-sm text-rose-600">
                Enter a valid current time in HH:MM format.
              </p>
            )}
          </section>

          {/* Info panel */}
          <section className="min-w-0 lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedRoom.building}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {selectedRoom.capacity} seats
                  </span>
                </div>
              </div>

              {roomBlock && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{roomBlock.reason}</span>
                </div>
              )}

              <div className="mt-4">
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Clock className="h-4 w-4" />
                  Existing bookings today
                </h3>
                {roomBookings.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No existing bookings for this room.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                    {roomBookings.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-slate-700">
                          {formatTime(b.start)} – {formatTime(b.end)}
                        </span>
                        <span className="text-slate-500">{b.bookedBy}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                <p className="font-medium text-slate-600">Rules in effect</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  <li>0 ≤ start &lt; end ≤ 1440; start must be after current time.</li>
                  <li>Bookings may not exceed 120 minutes.</li>
                  <li>Blocked rooms are always unavailable.</li>
                  <li>Overlapping intervals are rejected; touching endpoints are allowed.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
