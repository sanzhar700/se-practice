# Week 08 — Lab report

**Name:**
**Group:**
**Date:**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Codex |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | Not installed; no fresh skill-enabled chat was run |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Local terminal (`/Users/sanche/se-practice/week-08/app`) |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
RUN v2.1.9
✓ src/booking.test.ts (17 tests)
Test Files  1 passed (1)
Tests       17 passed (17)
``` 

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
RUN v2.1.9
❯ src/booking.test.ts (17 tests | 4 failed)
× T01 AC4: touching after — expected true, received false
× T08 AC4: touching before — expected true, received false
× AC5: available request leaves bookings unchanged — expected true, received false
× X2 AC4: interval touches two consecutive bookings — expected true, received false
Test Files  1 failed (1)
Tests       4 failed | 13 passed (17)
``` 

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
RUN v2.1.9
❯ src/booking.test.ts (19 tests | 6 failed)
× T01 AC4: touching after — expected true, received false
× T08 AC4: touching before — expected true, received false
× AC5: available request leaves bookings unchanged — expected true, received false
× X2 AC4: interval touches two consecutive bookings — expected true, received false
× BUG-A AC4: request touches two consecutive bookings on both sides — expected true, received false
× BUG-B AC5: available request does not change bookings — array changed (720–780 was appended)
Test Files  1 failed (1)
Tests       6 failed | 13 passed (19)
``` 

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | BUG-A; also T01, T08, X2 | 660–720 between bookings 600–660 and 720–780 | `true` | `false` | Retrospective: the loop uses `<=` and `>=`, so endpoint contact is counted as overlap. I did not record this independently before asking the assistant. |
| BUG-B | BUG-B | available 720–780; bookings initially [{600,660}] | `true`, then bookings unchanged | returns true but appends {720,780} | Retrospective: `bookings.push({ start, end })` mutates the input; the new test isolates this from BUG-A. I did not record this independently before asking the assistant. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | no — generated from the handout; not personally reviewed by the student |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  skills/bug-detector.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  11-08-2026 17:12   bug-detector/
      570  11-08-2026 17:12   bug-detector/SKILL.md
---------                     -------
      570                     2 files
```

<!-- Write below this line -->

Installation was not performed: no fresh chat was opened with an installed skill or prompt-only simulation. There is no upload result to report and no authentic screenshot; the local ZIP is ready but remains uninstalled.

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Not run. No separate fresh chat without the skill was opened. The task's required input was therefore not submitted.
```

**The assistant's answer, pasted unedited:**

```text
Not run.
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
Not run. No separate fresh chat with bug-detector enabled was opened. The task's required input was therefore not submitted.
```

**The assistant's answer, pasted unedited:**

```text
Not run.
```

Did the environment show that the skill was invoked? no

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Not measured: no baseline chat | Not measured: skill was not enabled |
| Reproducible test | Not measured | Not measured |
| Minimal proposed patch | Not measured | Not measured |
| Unsupported claims | Not measured | Not measured |
| Clarity of explanation | Not measured | Not measured |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```diff
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
```

`npx vitest run -t 'BUG-A'`: 1 passed, 18 skipped (19 total). Full suite immediately after BUG-A: 2 failed, 17 passed; the remaining failures were the AC5 mutation assertion and BUG-B.

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```diff
-  bookings.push({ start, end });
```

Final `npx vitest run`:

```text
RUN v2.1.9
✓ src/booking.test.ts (19 tests)
Test Files  1 passed (1)
Tests       19 passed (19)
``` 

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

The AC5 test initially reported false because BUG-A rejected the touching request first. Only after fixing endpoint logic did it expose BUG-B's mutation, so a single failure did not identify every defect.

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Not completed: the required paired fresh-chat experiment was not performed. -->
