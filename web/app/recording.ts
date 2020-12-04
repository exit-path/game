const alphabetBase32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function encodeRecording(recording: number[]): string {
  return recording.map((keys) => alphabetBase32.charAt(keys)).join("") ?? "";
}

export function decodeRecording(recording: string): number[] {
  return Array.from(recording).map((keys) => alphabetBase32.indexOf(keys));
}
