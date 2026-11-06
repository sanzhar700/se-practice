import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_endpoint_allowed(self):
        self.assertIs(can_book(660, 720, 540, False, [(600, 660)]), True)

    def test_overlap_rejected(self):
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_blocked_rejected(self):
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_exactly_120_minutes_allowed(self):
        self.assertIs(can_book(720, 840, 540, False, [(600, 660)]), True)

    def test_121_minutes_rejected(self):
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_starting_now_rejected(self):
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    def test_reversed_times_rejected(self):
        self.assertIs(can_book(720, 660, 540, False, [(600, 660)]), False)

    def test_zero_length_rejected(self):
        self.assertIs(can_book(600, 600, 540, False, []), False)

    def test_negative_start_rejected(self):
        self.assertIs(can_book(-1, 30, 0, False, []), False)

    def test_ends_at_midnight_allowed(self):
        self.assertIs(can_book(1380, 1440, 540, False, [(600, 660)]), True)

    def test_after_midnight_rejected(self):
        self.assertIs(can_book(1380, 1441, 540, False, [(600, 660)]), False)

    def test_checks_multiple_bookings(self):
        self.assertIs(can_book(720, 780, 540, False, [(600, 660), (700, 760)]), False)

    def test_booking_inside_existing_is_rejected(self):
        self.assertIs(can_book(620, 640, 540, False, [(600, 660)]), False)

    def test_existing_inside_request_is_rejected(self):
        self.assertIs(can_book(600, 720, 540, False, [(630, 660)]), False)

    def test_repeated_check_does_not_mutate_inputs(self):
        existing = [(600, 660)]
        original = existing.copy()
        first = can_book(660, 720, 540, False, existing)
        second = can_book(660, 720, 540, False, existing)
        self.assertIs(first, True)
        self.assertIs(second, True)
        self.assertEqual(existing, original)

    def test_rejected_check_does_not_mutate_inputs(self):
        existing = [(700, 760), (600, 660)]
        original = existing.copy()
        self.assertIs(can_book(630, 690, 540, False, existing), False)
        self.assertEqual(existing, original)

if __name__ == "__main__":
    unittest.main()
