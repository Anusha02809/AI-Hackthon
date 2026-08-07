export function formatConfidence(score) {
  if (score == null) return 0;

  const value =
    score <= 1 ? score * 100 : score;

  return Math.round(
    Math.max(0, Math.min(value, 100))
  );
}

export function getConfidenceColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export function extractCoords(result) {
  if (!result) return null;

  const lat =
    result.latitude ??
    result.lat ??
    result.coords?.lat;

  const lng =
    result.longitude ??
    result.lon ??
    result.lng ??
    result.coords?.lng;

  if (lat == null || lng == null) {
    return null;
  }

  return {
    lat: Number(lat),
    lng: Number(lng),
  };
}

export function truncate(text, max = 80) {
  if (!text) return "";

  return text.length > max
    ? text.substring(0, max) + "..."
    : text;
}