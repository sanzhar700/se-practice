def can_book(start, end, now, blocked, existing):
    # AC1: Check that the time interval is valid and starts in the future.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: The booking duration must not exceed 120 minutes.
    if end - start > 120:
        return False

    # AC3: A blocked room cannot be booked.
    if blocked:
        return False

    # AC4: Reject the booking if it overlaps an existing booking.
    for existing_start, existing_end in existing:
        if start < existing_end and existing_start < end:
            return False

    # AC5: All acceptance criteria are satisfied.
    return True