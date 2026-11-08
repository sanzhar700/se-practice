def can_book(start, end, now, blocked, existing):
    """Return whether the requested interval is available under AC1–AC4."""
    if not (isinstance(start, int) and not isinstance(start, bool)):
        return False
    if not (isinstance(end, int) and not isinstance(end, bool)):
        return False
    if not (isinstance(now, int) and not isinstance(now, bool)):
        return False
    if start < 0 or start >= end or end > 1440:
        return False
    if start <= now:
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for existing_start, existing_end in existing:
        if start < existing_end and existing_start < end:
            return False
    return True
