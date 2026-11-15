# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Codex desktop |
| Coding assistant model | not displayed |
| Bolt.new model | not displayed |
| Bolt project link | not-shared |
| Language | Python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange


1. **Purpose:** The Smart Campus Room Availability Checker checks whether a selected room is available for a requested time. It does not create or confirm bookings.

2. **Time overlap:** A new booking from 11:00 to 12:00 is allowed if the existing booking ends at 11:00. Bookings that touch at an endpoint do not overlap.

3. **Current time:** The booking must start strictly after the current time. If the current time is 09:00, a booking starting at 09:00 is rejected, but one starting at 09:01 may be allowed if the other rules are satisfied.

4. **Duration:** A booking can last a maximum of 120 minutes. A duration of exactly 120 minutes is allowed, but 121 minutes is rejected.

5. **Blocked rooms and repeated checks:** A blocked room cannot be booked, even if the requested time is otherwise available. Checking availability must not change the list of existing bookings.

### 2.1 Scope in my own words

**Scope:** The page checks whether one selected study room is available for a requested time using fictional booking data. It shows whether the requested time is available and provides understandable validation feedback. It does not create or confirm bookings. Login, databases, backend services, external APIs, payments, notifications, and waiting lists are out of scope.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Start and end must be integer minutes after midnight, with 0 <= start < end <= 1440. The start time must be strictly later than the current time. |
| AC2 | A booking can last at most 120 minutes. Exactly 120 minutes is allowed, but 121 minutes is not. |
| AC3 | A blocked room must always be rejected, even when the requested time is otherwise available. |
| AC4 | The requested interval must not overlap any existing booking. Bookings that touch at an endpoint do not overlap. |
| AC5 | The result must clearly show Available or Unavailable. Checking availability must not modify existing bookings. |
| AC6 | The page must provide understandable validation feedback and remain usable on a narrow mobile screen. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Incorrectly rejecting bookings that start exactly when an existing booking ends | AC4 | Existing booking is 10:00–11:00; request 11:00–12:00. Expected: Available. |
| 2 | Allowing a booking to start at the current time | AC1 | Current time is 09:00; request 09:00–09:30. Expected: Unavailable. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Requested booking start time | Integer minutes after midnight; 0–1439 |
| `end` | Requested booking end time | Integer minutes after midnight; 1–1440 |
| `now` | Current time used for validation | Integer minutes after midnight; 0–1439 |
| `blocked` | Whether the selected room is blocked | Boolean: `True` or `False` |
| `existing` | Existing booking intervals | Collection of `(start, end)` integer pairs |
| returns | Whether the requested booking satisfies AC1–AC4 | Boolean: `True` if valid; otherwise `False` |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. All times are represented as integer minutes after midnight, and the supplied current time is valid.
2. Existing bookings are represented as valid (start, end) intervals, and checking availability must not change the input data.

**Checked manually:**

- Checked the rules with examples: 10:00–11:00 followed by 11:00–12:00 should be allowed; a booking starting at the current time should be rejected; 120 minutes should be allowed while 121 minutes should be rejected.

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Yes | Rejects invalid order, out-of-day values, and starts at or before now. |
| `if end - start > 120:` | AC2 | Yes | Rejects durations over 120 minutes while allowing exactly 120. |
| `if blocked:` | AC3 | Yes | Rejects every request for a blocked room. |
| `if start < existing_end and existing_start < end:` | AC4 | Yes | Strict inequalities reject overlap while allowing endpoint touching; the loop checks every pair. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
The exact Bolt.new chat prompt was lost. The user confirmed it cannot be recovered. The saved .bolt/prompt is generic workspace guidance, not the prompt sent to Bolt, so it is not represented as that prompt here.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Main page and form | `src/App.tsx` | Selects a room, accepts times, and displays availability and validation feedback. |
| Availability rules | `src/lib/availability.ts` | Parses times and checks boundaries, duration, room blocks, and overlaps. |

**What v1 does:**

- v1 is a responsive room availability page with fictional room data and a simulated clock. It shows current bookings and an Available/Unavailable result. It uses a native time input for the end time, which cannot enter 24:00, and its fixture does not provide the second booking needed for T10.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Unavailable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Unavailable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Available | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py`; `web/final/src/lib/availability.ts` | T6–T9 | Time order, day bounds, future start | v1: T6/T7/T9 false, T8 false on page | Final: T6/T7/T9 unavailable, T8 available |
| AC2 | `code/booking.py`; `web/final/src/lib/availability.ts` | T4–T5 | At most 120 minutes | v1: T4 true, T5 false; page T4 available, T5 unavailable | Final: T4 true, T5 false; page T4 available, T5 unavailable |
| AC3 | `code/booking.py`; `web/final/src/lib/availability.ts`, room r3 | T3 | Reject a blocked room | v1: false / Unavailable | Final: false / Unavailable |
| AC4 | `code/booking.py`; `web/final/src/lib/availability.ts` | T1–T2, T10 | Touching allowed; overlaps rejected | v1: T1 true, T2 false; page T10 Available because v1 lacks the second fixture | Final: T1 true, T2/T10 false; page shows expected results |
| AC5 | `code/booking.py`; `web/final/src/App.tsx` | T11 | Boolean result; input bookings unchanged | v1: true; page says existing bookings were not changed | Final: true; page says existing bookings were not changed |
| AC6 | `web/final/src/App.tsx`, responsive form and feedback | T12 | Clear result and narrow layout | v1: T12 Available at 375 px | Final: T12 Available at 375 px; no horizontal scroll |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | End-of-day time cannot be entered in v1 | T8 displayed Unavailable in the v1 browser | High | Changed the end field to accept `HH:MM` text and parse 24:00 as 1440. The exact repair prompt was not saved. | T8 displayed Available in final; T9 remained Unavailable. |
| 2 | v1 page has no second booking matching T10 | T10 displayed Available in v1 with its original fixture | Medium | Added a second fictional booking to Dusk Lounge in `web/final/src/lib/data.ts`; kept the original export untouched. The exact repair prompt was not saved. | T10 displayed Unavailable in final. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1: the v1 end-time control is native `time`; final accepts text so 24:00 can be entered.

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | v1's strict overlap comparison allows touching endpoints | Ran T1 and T2 in Python and the v1 browser; touching was Available and overlap Unavailable. | accept | The strict inequalities implement AC4 endpoint semantics. |
| 2 | v1 rejects the 24:00 end boundary in its page input | Ran T8 and inspected the native time control; v1 showed Unavailable, while Python v1 returned True. | modify | AC1 permits end=1440, so the final text field accepts 24:00 and passed T8. |
| 3 | Add a second existing booking to verify the overlap loop | Ran T10; Python and final page rejected overlap with the second pair. | accept | AC4 requires checking every existing booking; the v1 page fixture lacked the second booking. |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Complete SIS-03 and make the acceptance checks pass. |
| Model / plan | Codex desktop; plan was to inspect the brief, run the checker, repair code and page, then capture browser evidence. Model label was not displayed. |
| Tool call | Read project files, ran the Python checker and suite, built the Vite page, and drove Chrome through T1–T11. |
| Observation | Python and final page matched the expected results; v1 page failed T8 and T10; the final viewport had no horizontal scroll at 375 px. |
| Next step | Fill the test table and report from observed results; disclose the lost historical prompts. |
| Human review | The user supplied the student ID and group and confirmed both the Bolt prompt and the Python v1 exchange history are unavailable. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Codex desktop | Project files and user request | Read/write project files; run Python, npm, and local Chrome | Observed |
| Bolt.new export | Existing `web/original/` and `web/final/` folders | Exported source files; no live Bolt session or project link available | Observed |
| Chrome | Local Vite server and test scenarios | Local page interaction and screenshot capture | Observed |
| Bolt.new internals | No live project session or saved chat is available | Runtime permissions and model settings cannot be inspected from the export | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting a generated change, compare each condition with AC1–AC6, run the fixed boundary cases, inspect the diff, and verify the actual displayed result in the browser. Preserve the supplied v1 export and never invent missing prompts or screenshots.

**Reliability, security, responsibility:** Tests caught boundary and overlap mistakes that a visual review could miss. The page uses fictional local data and no backend, login, or external API, which limits exposure but does not make generated code automatically safe. A developer still needs to review every branch, confirm that inputs stay unchanged, inspect dependency and permission choices, and keep the evidence consistent with what actually ran. The assistant can prepare code and test cases, but the student remains responsible for understanding and defending the submission.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

Draft for Sanzhar to personalize: In this assignment, AI-assisted coding gave me a small Python function whose rules I could check case by case, while vibe coding produced a complete page quickly but needed more careful browser review. The reliability risk was missing the 24:00 boundary; the usability risk was a page control that could not enter a valid end-of-day time; the security risk would be adding login or a backend without a real need. I reviewed the overlap rule, ran tests against altered implementations, and checked the page at phone width because generated code can look convincing while still violating a boundary. Tool permissions also matter: local files and browser access should match the task. I changed the page input to accept 24:00 and added a second fixture for T10. Next I would improve keyboard and screen-reader feedback while keeping the page limited to availability checks.

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** not preserved in the repository
- **Model:** not displayed
- **Date:** not recorded
- **Stage:** not preserved
- **Source:** this SIS, history unavailable

**Prompt:**

~~~~text
The original Python v1 request was not saved. The user confirmed no Week 05 dialogue or exact prompt is available.
~~~~

**Response:**

~~~~text
The original Python v1 response was not saved with the project. I have kept `code/original/booking_v1.py` unchanged, but cannot reproduce the missing exchange.
~~~~

### B2

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-18 (source file timestamp; exact chat date unavailable)
- **Stage:** Generate
- **Source:** week-06

**Prompt:**

~~~~text
The exact Bolt.new prompt and chat response were lost. The user confirmed the prompt cannot be recovered. The project export and v1 screenshot match the Week 06 files, but no prompt text is available to paste.
~~~~

**Response:**

~~~~text
No saved Bolt response is available. I do not reconstruct or invent it.
~~~~

### B3

- **Tool:** Codex desktop
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
The exact critique request from the earlier work was not saved. The user confirmed the Python v1 dialogue is unavailable.
~~~~

**Response:**

~~~~text
The original critique response is unavailable. This report's section 8 records claims checked against current behavior; it does not claim to reproduce the missing transcript.
~~~~

### B4

- **Tool:** Codex desktop
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
The focused repair prompt was not saved as a separate message. The user requested completion of the assignment; this run changed the end-time input, responsive classes, fictional T10 fixture, tests, evidence, and report.
~~~~

**Response:**

~~~~text
The exact repair response is not preserved as an exchange transcript. The resulting changes and test outputs are recorded in the repository and in section 12.1.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_121_minutes_rejected (test_booking.BookingTests.test_121_minutes_rejected) ... ok
test_after_midnight_rejected (test_booking.BookingTests.test_after_midnight_rejected) ... ok
test_blocked_rejected (test_booking.BookingTests.test_blocked_rejected) ... ok
test_booking_inside_existing_is_rejected (test_booking.BookingTests.test_booking_inside_existing_is_rejected) ... ok
test_checks_multiple_bookings (test_booking.BookingTests.test_checks_multiple_bookings) ... ok
test_ends_at_midnight_allowed (test_booking.BookingTests.test_ends_at_midnight_allowed) ... ok
test_exactly_120_minutes_allowed (test_booking.BookingTests.test_exactly_120_minutes_allowed) ... ok
test_existing_inside_request_is_rejected (test_booking.BookingTests.test_existing_inside_request_is_rejected) ... ok
test_negative_start_rejected (test_booking.BookingTests.test_negative_start_rejected) ... ok
test_overlap_rejected (test_booking.BookingTests.test_overlap_rejected) ... ok
test_rejected_check_does_not_mutate_inputs (test_booking.BookingTests.test_rejected_check_does_not_mutate_inputs) ... ok
test_repeated_check_does_not_mutate_inputs (test_booking.BookingTests.test_repeated_check_does_not_mutate_inputs) ... ok
test_reversed_times_rejected (test_booking.BookingTests.test_reversed_times_rejected) ... ok
test_starting_now_rejected (test_booking.BookingTests.test_starting_now_rejected) ... ok
test_touching_endpoint_allowed (test_booking.BookingTests.test_touching_endpoint_allowed) ... ok
test_zero_length_rejected (test_booking.BookingTests.test_zero_length_rejected) ... ok

----------------------------------------------------------------------
Ran 16 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| X1, X2, X3, X5 | Original Python v1 prompt/response and critique/repair transcripts are not present; the user confirmed no Week 05 history exists. | Attach authentic saved conversations if recovered; do not recreate them as historical evidence. |
| X4 | Bolt.new prompt and response were lost; the user confirmed this. The saved `.bolt/prompt` is generic tool guidance, not the sent prompt. | Recover the original Bolt chat/export metadata. A new prompt would be a new exchange, not a replacement for the historical one. |
| Reflection authorship | The 10th-section text is an AI-generated draft based on observed work, marked for personalization. | Rewrite in the student's own words before submitting. |
