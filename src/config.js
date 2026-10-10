export function reservationLifetimeMs() {
  const seconds = Number(process.env.RESERVATION_TTL_SECONDS ?? 900);
  if (!Number.isSafeInteger(seconds) || seconds <= 0 || seconds > 86400) {
    throw new Error('INVALID_RESERVATION_TTL');
  }
  return seconds;
}
