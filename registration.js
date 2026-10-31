// below this many places left, an event counts as nearly full
export const FEW_SLOTS = 20;

const today = () => new Date().toISOString().substring(0, 10);

export const places = (amount) =>
  amount === 1 ? "1 Platz" : `${amount} Plätze`;

// what we know about an event's registration, null once it is over or
// canceled; kind is one of soon, open, few, closed
export const registrationStatus = (competition) => {
  const { date } = competition;
  if (date.is_canceled || date.end.substring(0, 10) < today()) return null;

  const opens = date.registration_opens?.substring(0, 10);
  const count = competition.participants?.count || null;

  if (opens && opens > today()) {
    return { kind: "soon", opens: date.registration_opens, count };
  }

  const slots = (competition.registration?.slots || []).map((slot) => ({
    ...slot,
    slots: Math.max(0, slot.slots),
  }));
  const left = slots.reduce((sum, slot) => sum + slot.slots, 0);
  const details =
    slots.length > 1
      ? slots
          .map(
            ({ label, slots }) =>
              `${label}: ${slots ? "noch " + places(slots) : "geschlossen"}`,
          )
          .join(" · ")
      : null;
  if (slots.length && !left) {
    return { kind: "closed", left, count, details };
  }
  if (left) {
    const kind = left <= FEW_SLOTS ? "few" : "open";
    return { kind, left, count, details };
  }
  if (opens) return { kind: "open", left: null, count, details };
  return null;
};
