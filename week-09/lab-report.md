# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Sanzhar Sansyzbayev:**
**24B030314:**
**sanzhar700:**

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | not displayed |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.14.6 |

## 2. Your tool definition — a reason for every constraint

Final `tool/check_room.json`:

```json
{
  "name": "check_room",
  "description": "Check whether a room is available for a requested time interval. Give start, end, and now as whole minutes since midnight, from 0 to 1440; for example, 10:00 is 600 and 24:00 is 1440. Set blocked to true if the room cannot be used. List existing bookings as start and end minute values. This tool only checks availability and does not create or save a booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start time in whole minutes since midnight."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end time in whole minutes since midnight."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is blocked and cannot be used."
      },
      "bookings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        },
        "description": "Existing bookings, each with start and end in whole minutes since midnight."
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint | What goes wrong without it |
| --- | --- | --- |
| `name` | Exactly `check_room` | The model or client may refer to a different tool name, so the intended tool will not be called. |
| `description` | Explains minutes since midnight, the 0–1440 range, and that the tool only checks and does not save | The model could guess time units or believe it has made a booking. |
| `start`, `end`, `now` | Integers from 0 through 1440 | Strings, fractional minutes, or times outside the day could reach the function. |
| `blocked` | Boolean | Text such as `"false"` could be mistaken for a real boolean value. |
| `bookings` | Array of objects, each requiring integer `start` and `end` in range | Existing bookings could be missing or malformed, making overlap checks unreliable. |
| Top-level object | Exactly five required properties; extra properties refused | Missing values or invented fields such as `room` could be passed into the function. |

## 3. The twelve calls — first run and final run

The first checker output I recorded showed all twelve S cases passing. The final run also showed all twelve passing.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S02 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S03 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S04 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S05 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S06 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S07 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S08 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S09 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S10 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S11 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |
| S12 | PASS | PASS | No change needed; the schema already accepts valid calls and refuses malformed calls. |

## 4. Function calling — what the model wrote

### R1

```json
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

The call matches R1: 9:00 is 540 minutes, 10:00 is 600, and 11:00 is 660. The existing booking starts at 660, so it touches the requested interval without overlapping it.

### R2

```json
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

The call matches R2: 13:30 is 810, 14:00 is 840, and 16:30 is 990. It correctly includes `blocked: true` and an empty bookings list. The tool should still be called; `canBook` decides the room is unavailable.

### R3

```text
What exact start and end times tomorrow afternoon would you like?
```

The model asked a question instead of calling the tool. The request did not specify exact start and end times, the meaning of “a couple of hours,” or the current time needed for `now`, so asking avoids inventing required values.

## 5. What the schema cannot check

The schema enforces the shape and allowed values of inputs, but it cannot enforce every booking rule. For AC1, it can require whole-minute integers from 0 to 1440, but it cannot compare `start` with `end` or require `start` to be later than `now`. AC2 requires calculating the duration (`end - start`) and checking that it is at most 120 minutes; the permitted schema keywords cannot perform that calculation. AC4 requires comparing the requested interval with each existing booking to detect overlap, which is also beyond these schema constraints. AC3 can require `blocked` to be a boolean, but the availability decision based on its value belongs to `canBook`. AC5 and AC6 describe the function's side effects and feedback, not input shape, so the schema cannot guarantee them.

## 6. Permissions — allow, ask or block

| # | Action | Decision | Reason |
|---|---|---|---|
| A1 | Call `check_room` with the times the user just typed | allow | The user requested an availability check, and the tool only checks the supplied booking details. |
| A2 | Read `week-08/app/src/booking.ts` | allow | Reading the booking logic is relevant to the task and does not change files. |
| A3 | Edit `booking.ts` to raise the 120-minute limit to 180 | ask | This changes an established project rule and may affect users, so approval is needed before editing. |
| A4 | Run `npm test` in `week-08/app` | allow | Running the project's tests checks behavior and normally does not change source files. |
| A5 | Run `git reset --hard` to undo its own last three edits | ask | The command can discard tracked uncommitted work, so first inspect the diff and confirm what will be lost. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit records work in repository history, so review the staged diff and confirm before recording it. |
| A7 | `git push` to `main` | block | A direct push bypasses review and can change the shared main branch. |
| A8 | Send `.env` contents to an MCP server it found online | block | `.env` may contain credentials, and sending them to an unverified server could expose secrets. |

## 7. Checkpoint

Checkpoint: `f5bd1a9` (`Week 09: add tool schema and initial lab work`), the HEAD shown by `git log --oneline` when I checked the repository. To return tracked files to that commit, run `git reset --hard f5bd1a9`. This discards tracked, uncommitted changes made after the checkpoint; it does not remove untracked files.

## 8. Checker output

Whole output of the latest checker run:

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it doesnot save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.

## 10. Conclusion (80–150 words)

This practice showed me that the schema, model, and booking function have different jobs. The schema checks the shape of a call: S03 rejects a time written as the string `"11:00"`, and S06 rejects a negative start. It does not decide whether a request is sensible. A call with `start` equal to `end` could still have valid integer fields, so `canBook` must enforce the time rules and detect overlaps. In R2, the model correctly converted the times and included `blocked: true`; it should still call the tool because the function decides availability. In R3, the model asked for exact times instead of guessing. This separation helps keep input validation clear while leaving booking decisions with the function.
