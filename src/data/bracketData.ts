import { Bracket, Participant } from "../types/bracket";

// Sample participants
const sampleParticipants: Participant[] = [
  {
    id: "p1",
    name: "Ahmad Zulkarnain",
    seed: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
  },
  {
    id: "p2",
    name: "Budi Santoso",
    seed: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: "p3",
    name: "Citra Dewi",
    seed: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Citra",
  },
  {
    id: "p4",
    name: "Dian Purnama",
    seed: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dian",
  },
  {
    id: "p5",
    name: "Eko Prasetyo",
    seed: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eko",
  },
  {
    id: "p6",
    name: "Fitri Handayani",
    seed: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fitri",
  },
  {
    id: "p7",
    name: "Gunawan Wibowo",
    seed: 7,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gunawan",
  },
  {
    id: "p8",
    name: "Hadi Nugroho",
    seed: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hadi",
  },
];

// Sample bracket
export const sampleBracket: Bracket = {
  id: "b1",
  name: "Kejuaraan Pencak Silat 2023",
  description: "Turnamen tahunan pencak silat tingkat nasional",
  participants: sampleParticipants,
  rounds: [
    {
      id: "r1",
      name: "Perempat Final",
      roundNumber: 1,
      matches: [
        {
          id: "m1",
          roundId: "r1",
          participants: [sampleParticipants[0], sampleParticipants[7]],
          winnerId: "p1",
          score: [3, 1],
        },
        {
          id: "m2",
          roundId: "r1",
          participants: [sampleParticipants[3], sampleParticipants[4]],
          winnerId: "p4",
          score: [2, 0],
        },
        {
          id: "m3",
          roundId: "r1",
          participants: [sampleParticipants[2], sampleParticipants[5]],
          winnerId: "p3",
          score: [4, 2],
        },
        {
          id: "m4",
          roundId: "r1",
          participants: [sampleParticipants[1], sampleParticipants[6]],
          winnerId: "p2",
          score: [5, 0],
        },
      ],
    },
    {
      id: "r2",
      name: "Semi Final",
      roundNumber: 2,
      matches: [
        {
          id: "m5",
          roundId: "r2",
          participants: [
            sampleParticipants.find((p) => p.id === "p1")!,
            sampleParticipants.find((p) => p.id === "p4")!,
          ],
          winnerId: "p1",
          score: [3, 2],
        },
        {
          id: "m6",
          roundId: "r2",
          participants: [
            sampleParticipants.find((p) => p.id === "p3")!,
            sampleParticipants.find((p) => p.id === "p2")!,
          ],
          winnerId: "p2",
          score: [1, 3],
        },
      ],
    },
    {
      id: "r3",
      name: "Final",
      roundNumber: 3,
      matches: [
        {
          id: "m7",
          roundId: "r3",
          participants: [
            sampleParticipants.find((p) => p.id === "p1")!,
            sampleParticipants.find((p) => p.id === "p2")!,
          ],
          winnerId: undefined,
          score: undefined,
        },
      ],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Sample brackets list
export const sampleBrackets: Bracket[] = [
  sampleBracket,
  {
    ...sampleBracket,
    id: "b2",
    name: "Kejuaraan Pencak Silat Junior 2023",
    description: "Turnamen pencak silat untuk atlet junior",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    ...sampleBracket,
    id: "b3",
    name: "Kejuaraan Daerah 2023",
    description: "Turnamen tingkat daerah",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
];
