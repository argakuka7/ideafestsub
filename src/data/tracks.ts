export const TRACK_COLORS: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  Bisnis: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" },
  FnB: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", border: "border-orange-200" },
  "Art & Culture": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", border: "border-purple-200" },
  Content: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  Teknologi: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", border: "border-green-200" },
  "Self Development": { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500", border: "border-pink-200" },
  "Mental Health": { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500", border: "border-teal-200" },
  "Policy Making": { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", border: "border-indigo-200" },
};

export const ALL_TRACKS = Object.keys(TRACK_COLORS);

export function getTrackStyle(track: string) {
  const primary = track.split(/\s+(?:x|-|\/)\s+/i)[0].trim();
  return TRACK_COLORS[primary] ?? TRACK_COLORS.Bisnis;
}
