export interface Participant {
  id: string;
  name: string;
  seed?: number;
  avatar?: string;
  team?: string;
  stats?: {
    wins: number;
    losses: number;
    draws: number;
  };
}

export type MatchStatus =
  | "pending" // Match not yet ready (participants not determined)
  | "scheduled" // Match is scheduled but not started
  | "in_progress" // Match is currently in progress
  | "completed"; // Match is completed with a winner

export interface Match {
  id: string;
  roundId: string;
  participants: Participant[];
  winnerId?: string;
  score?: [number, number];
  status?: MatchStatus;
  scheduledTime?: Date;
  notes?: string;
  location?: string;
  referee?: string;
}

export interface Round {
  id: string;
  name: string;
  matches: Match[];
  roundNumber: number;
  startDate?: Date;
  endDate?: Date;
}

export type BracketStatus =
  | "draft" // Bracket is being created/edited
  | "active" // Bracket is active and in progress
  | "completed"; // Bracket is completed with a winner

export interface Bracket {
  id: string;
  name: string;
  description?: string;
  rounds: Round[];
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
  status?: BracketStatus;
  type?: BracketType;
  winnerId?: string;
  organizer?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  rules?: string;
}

export type BracketType =
  | "single-elimination"
  | "double-elimination"
  | "round-robin";
