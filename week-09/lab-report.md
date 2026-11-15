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
| Assistant (frozen for the whole lab) | |
| Exact model (or "not displayed") | |
| Three fresh chats for R1, R2, R3? (yes / no) | | yes
| Python version (`python --version`) | |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json

```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| | | |
| | | |
| | | |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
|PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
FAIL  S03   end as a string: "11:00" -> refuse
             -> your schema accepted it
FAIL  S04   now missing -> refuse
             -> your schema accepted it
FAIL  S05   an extra field: "room": "204" -> refuse
             -> your schema accepted it
FAIL  S06   start below the day: -30 -> refuse
             -> your schema accepted it
FAIL  S07   end beyond the day: 1500 -> refuse
             -> your schema accepted it
FAIL  S08   a booking with no end: {start: 660} -> refuse
             -> your schema accepted it
FAIL  S09   blocked as a string: "false" -> refuse
             -> your schema accepted it
FAIL  S10   start not a whole minute: 600.5 -> refuse
             -> your schema accepted it
PASS  S11   end at the end of the day: 1440 -> accept
FAIL  S12   a booking as a pair: [660, 720] -> refuse
             -> your schema accepted it

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}

```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->

### R2

```{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}

```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? --> no

### R3

```What exact start and end times tomorrow afternoon would you like?

```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? --> Model asked the exact start and end times

## 5. What the schema cannot check

<!-- The schema cannot enforce all of AC1: it can check that start, end, and now are whole numbers from 0 to 1440, but it cannot compare them to check that start < end or that start is after now. AC2 also cannot be enforced because the schema cannot calculate end - start to check that the booking lasts no more than 120 minutes. AC4 cannot be enforced because the schema cannot compare the requested interval with every booking to detect overlaps. AC3 (whether the room is blocked) can be represented by requiring blocked to be a boolean, but deciding availability from its value is the function's job. AC5 and AC6 concern what the function does and what feedback it returns, so an input schema cannot guarantee them. --> 

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |

| # | Action | Decision | Reason |
|---|---|---|---|
| A1 | call `check_room` with the times the user just typed | allow | The user requested an availability check, and the tool only checks the supplied booking details. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading the booking logic is relevant to the task and does not change files. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | This changes a project rule and may affect other users, so the agent should get approval before editing it. |
| A4 | run `npm test` in `week-08/app` | allow | Running the project's tests checks behavior and does not normally change source files. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | This command can permanently discard uncommitted work, so the agent should confirm exactly what will be lost first. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit records changes in Git history, so the agent should show the changes and get approval before committing. |
| A7 | `git push` to `main` | block | Pushing directly to `main` bypasses review and can affect the shared branch. |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` may contain secrets, and sending them to an untrusted server could expose credentials. | | | 

## 7. Checkpoint

<!-- 1f2687d (HEAD -> week-09, origin/week-08, week-08) week-08: disclose AI use and checker state
fb8e2f7 week-08: repair booking availability and add regression coverage
1dcd8bb (origin/week-07, origin/sis-03, week-07, sis-03) Complete SIS-03 assignment
c87e0b8 sis-03: complete implementation, tests, report and browser eviden -->

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```sanche@MacBook-Air-Sanzhar se-practice % cd week-
09
sanche@MacBook-Air-Sanzhar week-09 % clear
sanche@MacBook-Air-Sanzhar week-09 % python3 tests/check_tool.py
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
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
ERROR F1    calls/r1.json: a call to check_room
             -> file not found
ERROR F2    calls/r1.json: arguments valid against your schema
             -> file not found
ERROR F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
             -> file not found
ERROR F4    calls/r2.json: a call to check_room
             -> file not found
ERROR F5    calls/r2.json: arguments valid against your schema
             -> file not found
ERROR F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
             -> file not found
ERROR F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
             -> neither calls/r3.json nor calls/r3.txt
FAIL  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
             -> found: none
FAIL  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
             -> A1 decision, A2 decision, A3 decision, A4 decision, A5 decision, A6 decision, A7 decision, A8 decision
FAIL  L3    section 7 names the checkpoint commit (a SHA)
             -> no 7-40 character commit hash in section 7
FAIL  L4    section 10: a conclusion of 80-150 words
             -> 0 words
FAIL  L5    AI_USAGE.md filled in (a tool row, and signed)
             -> not signed

SUMMARY: 18 PASS · 5 FAIL · 7 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
sanche@MacBook-Air-Sanzhar week-09 % 

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
