export interface Speaker {
  name: string;
  role: string;
}

export interface Moderator {
  name: string;
  role: string;
}

export interface Session {
  id: string;
  day: number;
  date: string;
  sessionNumber: number;
  time: string;
  timeStart: string;
  timeEnd: string;
  room: string;
  roomShort: string;
  title: string;
  track: string;
  speakers: Speaker[];
  moderator?: Moderator;
  status: string;
}

export interface DayData {
  day: number;
  date: string;
  dayLabel: string;
  sessions: Session[];
}

export interface SpeakerEntry {
  id: string;
  name: string;
  role: string;
  tracks: string[];
  sessionIds: string[];
  bio: string;
  bioStatus: string;
}
