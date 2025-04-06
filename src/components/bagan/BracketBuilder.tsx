import { useState, useEffect } from "react";
import {
  Bracket,
  BracketType,
  Match,
  Participant,
  Round,
  MatchStatus,
} from "@/types/bracket";
import { sampleBracket, sampleBrackets } from "@/data/bracketData";
import { Athlete } from "@/types/athlete";
import { athleteData } from "@/data/athleteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusCircle,
  Edit,
  Trash2,
  Save,
  ChevronRight,
  Users,
  Trophy,
  Calendar,
  Search,
  RefreshCw,
  FileText,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const BracketBuilder = () => {
  // State management
  const [brackets, setBrackets] = useState<Bracket[]>(() => {
    // Try to load from localStorage first
    const savedBrackets = localStorage.getItem("silat_brackets");
    return savedBrackets ? JSON.parse(savedBrackets) : sampleBrackets;
  });
  const [activeBracket, setActiveBracket] = useState<Bracket | null>(null);
  const [bracketType, setBracketType] =
    useState<BracketType>("single-elimination");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantSeed, setNewParticipantSeed] = useState<number | "">("");
  const [bracketName, setBracketName] = useState("");
  const [bracketDescription, setBracketDescription] = useState("");
  const [activeTab, setActiveTab] = useState("brackets");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bracketToDelete, setBracketToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportData, setExportData] = useState("");
  const [isParticipantDialogOpen, setIsParticipantDialogOpen] = useState(false);
  const [isAddParticipantsDialogOpen, setIsAddParticipantsDialogOpen] =
    useState(false);
  const [isAddFromAthletesDialogOpen, setIsAddFromAthletesDialogOpen] =
    useState(false);
  const [registeredAthletes, setRegisteredAthletes] = useState<Athlete[]>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [bulkParticipantNames, setBulkParticipantNames] = useState("");

  // Save brackets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("silat_brackets", JSON.stringify(brackets));
  }, [brackets]);

  // Fetch registered athletes
  useEffect(() => {
    // In a real application, this would be an API call with filtering
    // For now, we'll simulate by filtering the athleteData
    // Assuming all athletes in the sample data are "terdaftar" (registered)
    setRegisteredAthletes(athleteData);
  }, []);

  // Create a new bracket with validation
  const createNewBracket = () => {
    if (!bracketName) {
      toast({
        title: "Error",
        description: "Nama bagan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    if (participants.length < 2) {
      toast({
        title: "Error",
        description: "Minimal 2 peserta diperlukan untuk membuat bagan",
        variant: "destructive",
      });
      return;
    }

    const newBracket: Bracket = {
      id: uuidv4(),
      name: bracketName,
      description: bracketDescription,
      participants: [...participants],
      rounds: generateRounds(participants, bracketType),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      type: bracketType,
    };

    setBrackets([...brackets, newBracket]);
    setActiveBracket(newBracket);
    setBracketName("");
    setBracketDescription("");
    setActiveTab("editor");

    toast({
      title: "Sukses",
      description: `Bagan "${newBracket.name}" berhasil dibuat`,
      variant: "default",
    });
  };

  // Generate rounds based on participants and bracket type with improved seeding
  const generateRounds = (
    participants: Participant[],
    type: BracketType,
  ): Round[] => {
    if (participants.length < 2) return [];

    const rounds: Round[] = [];
    const participantCount = participants.length;
    const roundCount = Math.ceil(Math.log2(participantCount));

    // Sort participants by seed if available
    const sortedParticipants = [...participants].sort((a, b) => {
      if (a.seed && b.seed) return a.seed - b.seed;
      if (a.seed) return -1;
      if (b.seed) return 1;
      return 0;
    });

    // Generate rounds
    for (let i = 0; i < roundCount; i++) {
      const matchCount = Math.pow(2, roundCount - i - 1);
      const matches: Match[] = [];

      // Generate matches for the first round with proper seeding
      if (i === 0) {
        // Create a seeded bracket order
        const bracketOrder: number[] = [];

        if (type === "single-elimination") {
          // Standard seeding pattern for tournaments based on the image
          // For 8 participants: [0,7,3,4,2,5,1,6] (1,8,4,5,3,6,2,7 in 1-indexed)
          const totalSlots = Math.pow(2, roundCount);

          // Implementation of standard tournament seeding pattern
          // This creates the pattern shown in the image: 1v8, 4v5, 3v6, 2v7
          if (totalSlots >= 8) {
            // For 8 participants or more
            bracketOrder.push(0); // Seed 1
            bracketOrder.push(7); // Seed 8
            bracketOrder.push(3); // Seed 4
            bracketOrder.push(4); // Seed 5
            bracketOrder.push(2); // Seed 3
            bracketOrder.push(5); // Seed 6
            bracketOrder.push(1); // Seed 2
            bracketOrder.push(6); // Seed 7

            // For more than 8 participants, add additional seeding
            for (let slot = 8; slot < totalSlots; slot++) {
              bracketOrder.push(slot);
            }
          } else {
            // For fewer than 8 participants, use simpler pattern
            for (let slot = 0; slot < totalSlots / 2; slot++) {
              bracketOrder.push(slot);
              bracketOrder.push(totalSlots - 1 - slot);
            }
          }
        } else {
          // Simple sequential order for other bracket types
          for (let j = 0; j < matchCount * 2; j++) {
            bracketOrder.push(j);
          }
        }

        // Create matches based on the seeding order
        for (let j = 0; j < matchCount; j++) {
          const idx1 = bracketOrder[j * 2];
          const idx2 = bracketOrder[j * 2 + 1];

          const participant1 =
            idx1 < participantCount ? sortedParticipants[idx1] : undefined;
          const participant2 =
            idx2 < participantCount ? sortedParticipants[idx2] : undefined;

          matches.push({
            id: uuidv4(),
            roundId: `round-${i + 1}`,
            participants: [participant1, participant2].filter(
              Boolean,
            ) as Participant[],
            winnerId: undefined,
            score: undefined,
            status: "scheduled",
            scheduledTime: undefined,
            notes: "",
          });
        }
      } else {
        // Generate empty matches for subsequent rounds
        for (let j = 0; j < matchCount; j++) {
          matches.push({
            id: uuidv4(),
            roundId: `round-${i + 1}`,
            participants: [],
            winnerId: undefined,
            score: undefined,
            status: "pending",
            scheduledTime: undefined,
            notes: "",
          });
        }
      }

      // Create round with appropriate naming
      let roundName = "";
      if (i === roundCount - 1) {
        roundName = "Final";
      } else if (i === roundCount - 2) {
        roundName = "Semi Final";
      } else if (i === roundCount - 3) {
        roundName = "Perempat Final";
      } else {
        roundName = `Babak ${i + 1}`;
      }

      rounds.push({
        id: `round-${i + 1}`,
        name: roundName,
        roundNumber: i + 1,
        matches,
      });
    }

    return rounds;
  };

  // Randomize participants based on bracket type
  const randomizeParticipants = () => {
    if (participants.length < 2) {
      toast({
        title: "Error",
        description: "Minimal 2 peserta diperlukan untuk mengacak",
        variant: "destructive",
      });
      return;
    }

    // Create a copy of participants to shuffle
    const shuffledParticipants = [...participants];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledParticipants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledParticipants[i], shuffledParticipants[j]] = [
        shuffledParticipants[j],
        shuffledParticipants[i],
      ];
    }

    // Reassign seeds based on new order
    const reseededParticipants = shuffledParticipants.map(
      (participant, index) => ({
        ...participant,
        seed: index + 1,
      }),
    );

    setParticipants(reseededParticipants);

    toast({
      title: "Sukses",
      description: "Peserta berhasil diacak",
    });
  };

  // Add participants from registered athletes
  const addFromRegisteredAthletes = () => {
    if (selectedAthletes.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal satu atlet untuk ditambahkan",
        variant: "destructive",
      });
      return;
    }

    // Get the selected athletes from the registered athletes list
    const athletesToAdd = registeredAthletes.filter((athlete) =>
      selectedAthletes.includes(athlete.id),
    );

    // Check for duplicate names with existing participants
    const existingNames = new Set(
      participants.map((p) => p.name.toLowerCase()),
    );
    const duplicates = athletesToAdd.filter((athlete) =>
      existingNames.has(athlete.name.toLowerCase()),
    );

    if (duplicates.length > 0) {
      toast({
        title: "Error",
        description: `Beberapa atlet sudah ada: ${duplicates.map((d) => d.name).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Create new participants from the selected athletes
    const newParticipants = athletesToAdd.map((athlete, index) => ({
      id: athlete.id,
      name: athlete.name,
      seed: participants.length + index + 1,
      avatar: athlete.avatarUrl,
      athleteId: athlete.id, // Store reference to the original athlete
    }));

    setParticipants([...participants, ...newParticipants]);
    setSelectedAthletes([]);
    setIsAddFromAthletesDialogOpen(false);

    toast({
      title: "Sukses",
      description: `${newParticipants.length} peserta berhasil ditambahkan`,
    });
  };

  // Add multiple participants from text input
  const addBulkParticipants = () => {
    if (!bulkParticipantNames.trim()) {
      toast({
        title: "Error",
        description: "Daftar nama peserta tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    const names = bulkParticipantNames
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada nama peserta yang valid",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names in the input
    const uniqueNames = new Set(names.map((name) => name.toLowerCase()));
    if (uniqueNames.size !== names.length) {
      toast({
        title: "Error",
        description: "Terdapat nama duplikat dalam daftar",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names with existing participants
    const existingNames = new Set(
      participants.map((p) => p.name.toLowerCase()),
    );
    const duplicates = names.filter((name) =>
      existingNames.has(name.toLowerCase()),
    );

    if (duplicates.length > 0) {
      toast({
        title: "Error",
        description: `Beberapa nama sudah ada: ${duplicates.join(", ")}`,
      });
      return;
    }

    // Create new participants
    const newParticipants = names.map((name, index) => ({
      id: uuidv4(),
      name,
      seed: participants.length + index + 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, "")}`,
    }));

    setParticipants([...participants, ...newParticipants]);
    setBulkParticipantNames("");
    setIsAddParticipantsDialogOpen(false);

    toast({
      title: "Sukses",
      description: `${newParticipants.length} peserta berhasil ditambahkan`,
    });
  };

  // Add a new participant with validation
  const addParticipant = () => {
    if (!newParticipantName) {
      toast({
        title: "Error",
        description: "Nama peserta tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names
    if (
      participants.some(
        (p) => p.name.toLowerCase() === newParticipantName.toLowerCase(),
      )
    ) {
      toast({
        title: "Error",
        description: "Peserta dengan nama yang sama sudah ada",
        variant: "destructive",
      });
      return;
    }

    const seed =
      newParticipantSeed !== ""
        ? Number(newParticipantSeed)
        : participants.length + 1;

    const newParticipant: Participant = {
      id: uuidv4(),
      name: newParticipantName,
      seed: seed,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newParticipantName.replace(/\s+/g, "")}`,
    };

    setParticipants([...participants, newParticipant]);
    setNewParticipantName("");
    setNewParticipantSeed("");
  };

  // Edit a participant
  const openEditParticipant = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsParticipantDialogOpen(true);
  };

  // Save edited participant
  const saveEditedParticipant = () => {
    if (!editingParticipant || !editingParticipant.name) {
      toast({
        title: "Error",
        description: "Nama peserta tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names excluding the current participant
    if (
      participants.some(
        (p) =>
          p.id !== editingParticipant.id &&
          p.name.toLowerCase() === editingParticipant.name.toLowerCase(),
      )
    ) {
      toast({
        title: "Error",
        description: "Peserta dengan nama yang sama sudah ada",
        variant: "destructive",
      });
      return;
    }

    const updatedParticipants = participants.map((p) =>
      p.id === editingParticipant.id ? editingParticipant : p,
    );

    setParticipants(updatedParticipants);
    setIsParticipantDialogOpen(false);
    setEditingParticipant(null);

    toast({
      title: "Sukses",
      description: "Data peserta berhasil diperbarui",
    });
  };

  // Remove a participant with confirmation
  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
    toast({
      title: "Sukses",
      description: "Peserta berhasil dihapus",
    });
  };

  // Update match result with improved logic and validation
  const updateMatchResult = (
    matchId: string,
    roundId: string,
    winnerId: string,
    score: [number, number],
    notes?: string,
    scheduledTime?: Date,
  ) => {
    if (!activeBracket) return;

    // Validate scores
    if (score[0] < 0 || score[1] < 0) {
      toast({
        title: "Error",
        description: "Skor tidak boleh negatif",
        variant: "destructive",
      });
      return;
    }

    // Validate winner based on score
    const calculatedWinnerId =
      score[0] > score[1]
        ? activeBracket.rounds
            .find((r) => r.id === roundId)
            ?.matches.find((m) => m.id === matchId)?.participants[0]?.id
        : activeBracket.rounds
            .find((r) => r.id === roundId)
            ?.matches.find((m) => m.id === matchId)?.participants[1]?.id;

    if (calculatedWinnerId !== winnerId) {
      toast({
        title: "Error",
        description: "Pemenang tidak sesuai dengan skor",
        variant: "destructive",
      });
      return;
    }

    const updatedBracket = JSON.parse(JSON.stringify(activeBracket)) as Bracket;
    const roundIndex = updatedBracket.rounds.findIndex((r) => r.id === roundId);
    const matchIndex = updatedBracket.rounds[roundIndex].matches.findIndex(
      (m) => m.id === matchId,
    );

    // Update the match result
    const match = updatedBracket.rounds[roundIndex].matches[matchIndex];
    match.winnerId = winnerId;
    match.score = score;
    match.status = "completed";
    if (notes) match.notes = notes;
    if (scheduledTime) match.scheduledTime = scheduledTime;

    // If there's a next round, update the participants in the next match
    if (roundIndex < updatedBracket.rounds.length - 1) {
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const isFirstParticipant = matchIndex % 2 === 0;

      const winner = updatedBracket.participants.find((p) => p.id === winnerId);
      if (winner) {
        const nextMatch =
          updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex];

        // Update next match status
        nextMatch.status = "scheduled";

        if (isFirstParticipant) {
          if (nextMatch.participants.length === 0) {
            nextMatch.participants = [winner];
          } else {
            nextMatch.participants[0] = winner;
          }
        } else {
          if (nextMatch.participants.length === 0) {
            nextMatch.participants = [undefined, winner] as Participant[];
          } else if (nextMatch.participants.length === 1) {
            nextMatch.participants.push(winner);
          } else {
            nextMatch.participants[1] = winner;
          }
        }

        // If both participants are set in the next match, update its status
        if (
          nextMatch.participants.length === 2 &&
          nextMatch.participants[0] &&
          nextMatch.participants[1]
        ) {
          nextMatch.status = "scheduled";
        }
      }
    }

    // Check if this is the final match and update bracket status if needed
    if (roundIndex === updatedBracket.rounds.length - 1) {
      updatedBracket.status = "completed";
      updatedBracket.winnerId = winnerId;
    }

    setActiveBracket(updatedBracket);

    // Update the bracket in the brackets list
    const updatedBrackets = brackets.map((b) =>
      b.id === updatedBracket.id
        ? { ...updatedBracket, updatedAt: new Date() }
        : b,
    );
    setBrackets(updatedBrackets);

    toast({
      title: "Sukses",
      description: "Hasil pertandingan berhasil diperbarui",
    });
  };

  // Schedule a match
  const scheduleMatch = (
    matchId: string,
    roundId: string,
    scheduledTime: Date,
  ) => {
    if (!activeBracket) return;

    const updatedBracket = JSON.parse(JSON.stringify(activeBracket)) as Bracket;
    const roundIndex = updatedBracket.rounds.findIndex((r) => r.id === roundId);
    const matchIndex = updatedBracket.rounds[roundIndex].matches.findIndex(
      (m) => m.id === matchId,
    );

    // Update the match schedule
    updatedBracket.rounds[roundIndex].matches[matchIndex].scheduledTime =
      scheduledTime;
    updatedBracket.rounds[roundIndex].matches[matchIndex].status = "scheduled";

    setActiveBracket(updatedBracket);

    // Update the bracket in the brackets list
    const updatedBrackets = brackets.map((b) =>
      b.id === updatedBracket.id
        ? { ...updatedBracket, updatedAt: new Date() }
        : b,
    );
    setBrackets(updatedBrackets);

    toast({
      title: "Sukses",
      description: "Jadwal pertandingan berhasil diperbarui",
    });
  };

  // Delete a bracket with confirmation
  const openDeleteDialog = (id: string) => {
    setBracketToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteBracket = () => {
    if (!bracketToDelete) return;

    setBrackets(brackets.filter((b) => b.id !== bracketToDelete));
    if (activeBracket && activeBracket.id === bracketToDelete) {
      setActiveBracket(null);
      setActiveTab("brackets");
    }

    setIsDeleteDialogOpen(false);
    setBracketToDelete(null);

    toast({
      title: "Sukses",
      description: "Bagan berhasil dihapus",
    });
  };

  // Duplicate a bracket
  const duplicateBracket = (bracket: Bracket) => {
    const newBracket: Bracket = {
      ...JSON.parse(JSON.stringify(bracket)),
      id: uuidv4(),
      name: `${bracket.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBrackets([...brackets, newBracket]);

    toast({
      title: "Sukses",
      description: `Bagan "${bracket.name}" berhasil diduplikasi`,
    });
  };

  // Edit bracket details with validation
  const editBracketDetails = () => {
    if (!activeBracket) return;

    if (!bracketName) {
      toast({
        title: "Error",
        description: "Nama bagan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    const updatedBracket = {
      ...activeBracket,
      name: bracketName,
      description: bracketDescription,
      updatedAt: new Date(),
    };

    setActiveBracket(updatedBracket);

    // Update the bracket in the brackets list
    const updatedBrackets = brackets.map((b) =>
      b.id === updatedBracket.id ? updatedBracket : b,
    );
    setBrackets(updatedBrackets);

    setIsEditDialogOpen(false);

    toast({
      title: "Sukses",
      description: "Detail bagan berhasil diperbarui",
    });
  };

  // Open edit dialog
  const openEditDialog = (bracket: Bracket) => {
    setBracketName(bracket.name);
    setBracketDescription(bracket.description || "");
    setIsEditDialogOpen(true);
  };

  // Export bracket to JSON
  const exportBracket = (bracket: Bracket) => {
    setExportData(JSON.stringify(bracket, null, 2));
    setIsExportDialogOpen(true);
  };

  // Import bracket from JSON
  const importBracket = () => {
    try {
      const bracketData = JSON.parse(importData) as Bracket;

      // Validate the imported data
      if (
        !bracketData.id ||
        !bracketData.name ||
        !bracketData.rounds ||
        !bracketData.participants
      ) {
        throw new Error("Data bagan tidak valid");
      }

      // Check for duplicate ID
      if (brackets.some((b) => b.id === bracketData.id)) {
        bracketData.id = uuidv4();
      }

      // Set creation and update dates
      bracketData.createdAt = new Date();
      bracketData.updatedAt = new Date();

      setBrackets([...brackets, bracketData]);
      setIsImportDialogOpen(false);
      setImportData("");

      toast({
        title: "Sukses",
        description: `Bagan "${bracketData.name}" berhasil diimpor`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Format JSON tidak valid",
        variant: "destructive",
      });
    }
  };

  // Filter brackets based on search term
  const filteredBrackets = brackets.filter(
    (bracket) =>
      bracket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bracket.description &&
        bracket.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Reset all brackets (for development/testing)
  const resetAllBrackets = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus semua bagan dan mengatur ulang ke data contoh?",
      )
    ) {
      setBrackets(sampleBrackets);
      setActiveBracket(null);
      setActiveTab("brackets");

      toast({
        title: "Sukses",
        description: "Semua bagan berhasil diatur ulang",
      });
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Bagan Pertandingan
          </h1>
          {activeTab === "brackets" && (
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-300" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari bagan..."
                  className="pl-8 bg-white border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white w-64"
                />
              </div>
              <Button
                onClick={() => {
                  setActiveTab("create");
                  setParticipants([]);
                  setBracketName("");
                  setBracketDescription("");
                }}
                className="bg-blue-500 hover:bg-blue-600 shadow-none"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Buat Bagan Baru
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" /> Import
              </Button>
            </div>
          )}
          {activeTab === "editor" && activeBracket && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => openEditDialog(activeBracket)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Detail
              </Button>
              <Button
                variant="outline"
                onClick={() => exportBracket(activeBracket)}
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button
                variant="destructive"
                onClick={() => openDeleteDialog(activeBracket.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Bagan
              </Button>
              <Button onClick={() => setActiveTab("brackets")}>
                <ChevronRight className="mr-2 h-4 w-4" /> Kembali ke Daftar
              </Button>
            </div>
          )}
          {activeTab === "create" && (
            <Button onClick={() => setActiveTab("brackets")}>
              <ChevronRight className="mr-2 h-4 w-4" /> Kembali ke Daftar
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brackets">Daftar Bagan</TabsTrigger>
            <TabsTrigger value="create">Buat Bagan</TabsTrigger>
            <TabsTrigger value="editor" disabled={!activeBracket}>
              Editor Bagan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brackets" className="mt-4">
            {filteredBrackets.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Trophy className="h-8 w-8 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-white mb-2">
                  {searchTerm
                    ? "Tidak ada bagan yang ditemukan"
                    : "Belum ada bagan"}
                </h3>
                <p className="text-slate-500 dark:text-slate-300 max-w-md mx-auto">
                  {searchTerm
                    ? `Tidak ada bagan yang cocok dengan pencarian "${searchTerm}"`
                    : "Buat bagan pertandingan baru untuk memulai"}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Pencarian
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBrackets.map((bracket) => (
                  <Card
                    key={bracket.id}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{bracket.name}</CardTitle>
                        <Badge
                          className={`${
                            bracket.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0"
                              : bracket.status === "active"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-0"
                          }`}
                        >
                          {bracket.status === "completed"
                            ? "Selesai"
                            : bracket.status === "active"
                              ? "Aktif"
                              : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-500 dark:text-slate-400">
                        {bracket.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-sm mb-2">
                        <Users className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        <span>{bracket.participants.length} Peserta</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mb-2">
                        <Trophy className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        <span>{bracket.rounds.length} Ronde</span>
                        {bracket.winnerId && (
                          <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
                            Juara:{" "}
                            {
                              bracket.participants.find(
                                (p) => p.id === bracket.winnerId,
                              )?.name
                            }
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        <span>
                          Diperbarui:{" "}
                          {format(
                            new Date(bracket.updatedAt),
                            "dd/MM/yyyy HH:mm",
                          )}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveBracket(bracket);
                          setActiveTab("editor");
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => duplicateBracket(bracket)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Duplikat</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="destructive"
                          onClick={() => openDeleteDialog(bracket.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white shadow-sm">
                <CardHeader>
                  <CardTitle>Detail Bagan</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    Masukkan informasi dasar bagan pertandingan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Bagan</label>
                    <Input
                      value={bracketName}
                      onChange={(e) => setBracketName(e.target.value)}
                      placeholder="Contoh: Kejuaraan Pencak Silat 2023"
                      className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deskripsi</label>
                    <Input
                      value={bracketDescription}
                      onChange={(e) => setBracketDescription(e.target.value)}
                      placeholder="Deskripsi singkat tentang turnamen"
                      className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipe Bagan</label>
                    <Select
                      value={bracketType}
                      onValueChange={(value) =>
                        setBracketType(value as BracketType)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">
                        <SelectValue placeholder="Pilih tipe bagan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-elimination">
                          Single Elimination
                        </SelectItem>
                        <SelectItem value="double-elimination">
                          Double Elimination
                        </SelectItem>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white shadow-sm">
                <CardHeader>
                  <CardTitle>Peserta</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    Tambahkan peserta ke bagan pertandingan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newParticipantName}
                        onChange={(e) => setNewParticipantName(e.target.value)}
                        placeholder="Nama peserta"
                        className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                      />
                      <Input
                        type="number"
                        min="1"
                        value={newParticipantSeed}
                        onChange={(e) =>
                          setNewParticipantSeed(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        placeholder="Seed #"
                        className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white w-24"
                      />
                      <Button
                        onClick={addParticipant}
                        className="bg-blue-500 hover:bg-blue-600 shadow-none"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setIsAddParticipantsDialogOpen(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <Users className="mr-2 h-4 w-4" /> Tambah Banyak Peserta
                      </Button>
                      <Button
                        onClick={() => setIsAddFromAthletesDialogOpen(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <Users className="mr-2 h-4 w-4" /> Tambah dari Atlet
                      </Button>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        onClick={randomizeParticipants}
                        variant="outline"
                        className="w-full"
                        disabled={participants.length < 2}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Acak Peserta
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <p>
                        * Seed digunakan untuk menentukan urutan peserta dalam
                        bagan
                      </p>
                      <p>
                        * Peserta dengan seed lebih rendah akan bertemu peserta
                        dengan seed lebih tinggi di babak akhir
                      </p>
                    </div>
                  </div>

                  <ScrollArea className="h-[200px] rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="space-y-2">
                      {participants.length === 0 ? (
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                          Belum ada peserta
                        </p>
                      ) : (
                        participants.map((participant, index) => (
                          <div
                            key={participant.id}
                            className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800/70 rounded-md"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                {participant.seed || index + 1}
                              </span>
                              <div className="flex items-center space-x-2">
                                {participant.avatar && (
                                  <img
                                    src={participant.avatar}
                                    alt={participant.name}
                                    className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30"
                                  />
                                )}
                                <span>{participant.name}</span>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditParticipant(participant)}
                                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-500 hover:bg-blue-500/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeParticipant(participant.id)
                                }
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={createNewBracket}
                    disabled={!bracketName || participants.length < 2}
                    className="w-full bg-blue-500 hover:bg-blue-600 shadow-none"
                  >
                    <Save className="mr-2 h-4 w-4" /> Buat Bagan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="mt-4">
            {activeBracket && (
              <div className="space-y-6">
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {activeBracket.name}
                          <Badge className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                            {activeBracket.type === "single-elimination"
                              ? "Single Elimination"
                              : activeBracket.type === "double-elimination"
                                ? "Double Elimination"
                                : "Round Robin"}
                          </Badge>
                          {activeBracket.status === "completed" && (
                            <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
                              Selesai
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
                          {activeBracket.description}
                        </CardDescription>
                      </div>
                      {activeBracket.winnerId && (
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md text-center">
                          <div className="text-xs text-green-700 dark:text-green-300 mb-1">
                            Juara
                          </div>
                          <div className="font-bold text-slate-800 dark:text-white">
                            {
                              activeBracket.participants.find(
                                (p) => p.id === activeBracket.winnerId,
                              )?.name
                            }
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        <span>{activeBracket.participants.length} Peserta</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        <span>{activeBracket.rounds.length} Ronde</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        <span>
                          Dibuat:{" "}
                          {format(
                            new Date(activeBracket.createdAt),
                            "dd/MM/yyyy",
                          )}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div
                  className="overflow-x-auto"
                  style={{ paddingBottom: "32px" }}
                >
                  <div
                    className="flex space-x-8 p-4 min-w-max relative"
                    style={{ minHeight: "600px", paddingBottom: "64px" }}
                  >
                    {/* Draw connecting lines between rounds */}
                    {activeBracket.rounds.map((round, roundIndex) => {
                      if (roundIndex < activeBracket.rounds.length - 1) {
                        const matchCount = round.matches.length;
                        const nextRoundMatchCount =
                          activeBracket.rounds[roundIndex + 1].matches.length;

                        return matchCount > 1 ? (
                          <div
                            key={`connector-${round.id}`}
                            className="absolute"
                            style={{
                              left: `${(roundIndex + 1) * 272 - 8}px`,
                              top: "0",
                              height: "100%",
                              width: "2px",
                              zIndex: "0",
                            }}
                          >
                            {Array.from({
                              length: Math.floor(matchCount / 2),
                            }).map((_, idx) => {
                              // Calculate the vertical position more precisely
                              // Each match pair needs a connector in the middle
                              const matchPairHeight = 256; // Height allocated for a pair of matches
                              const yPos =
                                32 +
                                idx * matchPairHeight +
                                matchPairHeight / 2;

                              return (
                                <svg
                                  key={`vertical-connector-${idx}`}
                                  width="2"
                                  height={matchPairHeight}
                                  className="absolute overflow-visible"
                                  style={{
                                    top: `${yPos - matchPairHeight / 2}px`,
                                  }}
                                >
                                  <path
                                    d="M 1,0 V 256"
                                    stroke="rgba(59, 130, 246, 0.8)"
                                    className="dark:stroke-blue-500"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>
                              );
                            })}
                          </div>
                        ) : null;
                      }
                      return null;
                    })}
                    {activeBracket.rounds.map((round, roundIndex) => (
                      <div key={round.id} className="flex flex-col space-y-8">
                        <div className="text-center bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-blue-700 dark:text-white font-medium w-64">
                          {round.name}
                        </div>

                        <div
                          className="flex flex-col space-y-16 relative z-10"
                          style={{
                            marginBottom:
                              roundIndex === activeBracket.rounds.length - 1
                                ? "32px"
                                : "0",
                          }}
                        >
                          {round.matches.map((match, matchIndex) => (
                            <div key={match.id} className="relative">
                              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white shadow-sm w-64">
                                <CardContent className="p-4 space-y-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <Badge
                                      className={`${
                                        match.status === "completed"
                                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0"
                                          : match.status === "scheduled"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0"
                                            : match.status === "in_progress"
                                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-0"
                                              : "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 border-0"
                                      }${roundIndex === activeBracket.rounds.length - 1 && match.status === "pending" ? " bg-yellow-300 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-800 border-0" : ""}`}
                                    >
                                      {match.status === "completed"
                                        ? "Selesai"
                                        : match.status === "scheduled"
                                          ? "Terjadwal"
                                          : match.status === "in_progress"
                                            ? "Berlangsung"
                                            : roundIndex ===
                                                activeBracket.rounds.length - 1
                                              ? "CHAMPION"
                                              : "Menunggu"}
                                    </Badge>
                                    {match.scheduledTime && (
                                      <span className="text-xs text-blue-700 dark:text-blue-300">
                                        {format(
                                          new Date(match.scheduledTime),
                                          "dd/MM HH:mm",
                                        )}
                                      </span>
                                    )}
                                  </div>

                                  {match.participants.length > 0 ? (
                                    match.participants.map(
                                      (participant, index) => (
                                        <div
                                          key={`${match.id}-${participant?.id || index}`}
                                          className={`p-2 rounded-md flex justify-between items-center ${match.winnerId === participant?.id ? "bg-green-100 dark:bg-green-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
                                        >
                                          <div className="flex items-center space-x-2">
                                            {participant?.avatar && (
                                              <img
                                                src={participant.avatar}
                                                alt={participant.name}
                                                className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30"
                                              />
                                            )}
                                            <span className="font-medium">
                                              {participant?.name
                                                ? participant.name
                                                : "TBD"}
                                            </span>
                                          </div>
                                          {match.score && (
                                            <span className="font-bold">
                                              {match.score[index]}
                                            </span>
                                          )}
                                        </div>
                                      ),
                                    )
                                  ) : (
                                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-center font-medium">
                                      TBD
                                    </div>
                                  )}

                                  {match.notes && (
                                    <div className="text-xs italic text-blue-700 dark:text-blue-300 mt-1 p-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                                      {match.notes}
                                    </div>
                                  )}

                                  {match.participants.length === 2 && (
                                    <div className="flex space-x-1 mt-2">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                          >
                                            <Edit className="mr-1 h-3 w-3" />{" "}
                                            Hasil
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Update Hasil Pertandingan
                                            </DialogTitle>
                                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                              Masukkan skor untuk pertandingan
                                              antara{" "}
                                              {match.participants[0]?.name} dan{" "}
                                              {match.participants[1]?.name}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="flex justify-between items-center">
                                              <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                  {match.participants[0]
                                                    ?.avatar && (
                                                    <img
                                                      src={
                                                        match.participants[0]
                                                          .avatar
                                                      }
                                                      alt={
                                                        match.participants[0]
                                                          .name
                                                      }
                                                      className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30"
                                                    />
                                                  )}
                                                  <p className="text-sm font-medium">
                                                    {
                                                      match.participants[0]
                                                        ?.name
                                                    }
                                                  </p>
                                                </div>
                                                <Input
                                                  type="number"
                                                  min="0"
                                                  defaultValue={
                                                    match.score?.[0] || 0
                                                  }
                                                  id={`score-${match.id}-0`}
                                                  className="w-20 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                                                />
                                              </div>
                                              <span className="text-xl font-bold">
                                                VS
                                              </span>
                                              <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                  {match.participants[1]
                                                    ?.avatar && (
                                                    <img
                                                      src={
                                                        match.participants[1]
                                                          .avatar
                                                      }
                                                      alt={
                                                        match.participants[1]
                                                          .name
                                                      }
                                                      className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30"
                                                    />
                                                  )}
                                                  <p className="text-sm font-medium">
                                                    {
                                                      match.participants[1]
                                                        ?.name
                                                    }
                                                  </p>
                                                </div>
                                                <Input
                                                  type="number"
                                                  min="0"
                                                  defaultValue={
                                                    match.score?.[1] || 0
                                                  }
                                                  id={`score-${match.id}-1`}
                                                  className="w-20 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                                                />
                                              </div>
                                            </div>

                                            <div className="space-y-2">
                                              <label className="text-sm font-medium">
                                                Catatan Pertandingan
                                              </label>
                                              <Textarea
                                                placeholder="Catatan tambahan tentang pertandingan"
                                                defaultValue={match.notes || ""}
                                                id={`notes-${match.id}`}
                                                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white h-20"
                                              />
                                            </div>

                                            <div className="flex justify-center space-x-4">
                                              <Button
                                                onClick={() => {
                                                  const score0 = parseInt(
                                                    (
                                                      document.getElementById(
                                                        `score-${match.id}-0`,
                                                      ) as HTMLInputElement
                                                    ).value,
                                                  );
                                                  const score1 = parseInt(
                                                    (
                                                      document.getElementById(
                                                        `score-${match.id}-1`,
                                                      ) as HTMLInputElement
                                                    ).value,
                                                  );
                                                  const notes = (
                                                    document.getElementById(
                                                      `notes-${match.id}`,
                                                    ) as HTMLTextAreaElement
                                                  ).value;

                                                  // Determine winner based on score
                                                  const winnerId =
                                                    score0 > score1
                                                      ? match.participants[0]
                                                          ?.id
                                                      : match.participants[1]
                                                          ?.id;

                                                  updateMatchResult(
                                                    match.id,
                                                    round.id,
                                                    winnerId!,
                                                    [score0, score1],
                                                    notes,
                                                  );
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 shadow-none"
                                              >
                                                <Save className="mr-2 h-4 w-4" />{" "}
                                                Simpan Hasil
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>

                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                          >
                                            <Clock className="mr-1 h-3 w-3" />{" "}
                                            Jadwal
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Jadwalkan Pertandingan
                                            </DialogTitle>
                                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                              Atur jadwal untuk pertandingan
                                              antara{" "}
                                              {match.participants[0]?.name} dan{" "}
                                              {match.participants[1]?.name}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                              <label className="text-sm font-medium">
                                                Tanggal & Waktu
                                              </label>
                                              <Input
                                                type="datetime-local"
                                                defaultValue={
                                                  match.scheduledTime
                                                    ? new Date(
                                                        match.scheduledTime,
                                                      )
                                                        .toISOString()
                                                        .slice(0, 16)
                                                    : new Date()
                                                        .toISOString()
                                                        .slice(0, 16)
                                                }
                                                id={`schedule-${match.id}`}
                                                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                                              />
                                            </div>

                                            <div className="flex justify-center space-x-4">
                                              <Button
                                                onClick={() => {
                                                  const scheduledTimeStr = (
                                                    document.getElementById(
                                                      `schedule-${match.id}`,
                                                    ) as HTMLInputElement
                                                  ).value;
                                                  const scheduledTime =
                                                    new Date(scheduledTimeStr);

                                                  scheduleMatch(
                                                    match.id,
                                                    round.id,
                                                    scheduledTime,
                                                  );
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 shadow-none"
                                              >
                                                <Save className="mr-2 h-4 w-4" />{" "}
                                                Simpan Jadwal
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              {/* Draw connecting lines for brackets */}
                              {roundIndex < activeBracket.rounds.length - 1 && (
                                <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                                  <svg
                                    width="32"
                                    height="64"
                                    className="overflow-visible"
                                  >
                                    {/* Main horizontal line from match to vertical connector */}
                                    <path
                                      d={`M 0,32 H 16 ${matchIndex % 2 === 0 ? "V 64" : "V 0"}`}
                                      stroke="rgba(59, 130, 246, 0.8)"
                                      className="dark:stroke-blue-500"
                                      strokeWidth="2"
                                      fill="none"
                                    />
                                    {/* Add horizontal connector to next round */}
                                    {matchIndex % 2 === 0 && (
                                      <path
                                        d="M 16,64 H 32"
                                        stroke="rgba(59, 130, 246, 0.8)"
                                        className="dark:stroke-blue-500"
                                        strokeWidth="2"
                                        fill="none"
                                      />
                                    )}
                                    {matchIndex % 2 === 1 && (
                                      <path
                                        d="M 16,0 H 32"
                                        stroke="rgba(59, 130, 246, 0.8)"
                                        className="dark:stroke-blue-500"
                                        strokeWidth="2"
                                        fill="none"
                                      />
                                    )}
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Bracket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Detail Bagan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Bagan</label>
              <Input
                value={bracketName}
                onChange={(e) => setBracketName(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                value={bracketDescription}
                onChange={(e) => setBracketDescription(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white h-24"
              />
            </div>
            <Button
              onClick={editBracketDetails}
              className="w-full bg-blue-500 hover:bg-blue-600 shadow-none"
            >
              <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Apakah Anda yakin ingin menghapus bagan ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={deleteBracket}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Multiple Participants Dialog */}
      <Dialog
        open={isAddParticipantsDialogOpen}
        onOpenChange={setIsAddParticipantsDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Tambah Banyak Peserta</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Masukkan daftar nama peserta (satu nama per baris)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={bulkParticipantNames}
              onChange={(e) => setBulkParticipantNames(e.target.value)}
              placeholder="Ahmad Zulkarnain
Budi Santoso
Citra Dewi
Dian Purnama"
              className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white h-64"
            />
            <div className="flex space-x-2">
              <Button
                onClick={addBulkParticipants}
                className="w-full bg-blue-500 hover:bg-blue-600 shadow-none"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Peserta
              </Button>
              <Button
                onClick={randomizeParticipants}
                variant="outline"
                className="w-full"
                disabled={participants.length < 2}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Acak Peserta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Participant Dialog */}
      <Dialog
        open={isParticipantDialogOpen}
        onOpenChange={setIsParticipantDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Peserta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Peserta</label>
              <Input
                value={editingParticipant?.name || ""}
                onChange={(e) =>
                  setEditingParticipant((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Seed</label>
              <Input
                type="number"
                min="1"
                value={editingParticipant?.seed || ""}
                onChange={(e) =>
                  setEditingParticipant((prev) =>
                    prev
                      ? {
                          ...prev,
                          seed:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        }
                      : null,
                  )
                }
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                value={editingParticipant?.avatar || ""}
                onChange={(e) =>
                  setEditingParticipant((prev) =>
                    prev ? { ...prev, avatar: e.target.value } : null,
                  )
                }
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
            <Button
              onClick={saveEditedParticipant}
              className="w-full bg-blue-500 hover:bg-blue-600 shadow-none"
            >
              <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Import Bagan</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Tempel data JSON bagan untuk mengimpornya
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder='{"id":"...","name":"...","participants":[...],"rounds":[...]}'
              className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white h-64 font-mono text-xs"
            />
            <Button
              onClick={importBracket}
              disabled={!importData}
              className="w-full bg-blue-500 hover:bg-blue-600 shadow-none"
            >
              <Upload className="mr-2 h-4 w-4" /> Import Bagan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Export Bagan</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Salin data JSON bagan untuk mengekspornya
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <ScrollArea className="h-64 rounded-md border border-slate-200 dark:border-slate-700 p-4">
              <pre className="font-mono text-xs whitespace-pre-wrap">
                {exportData}
              </pre>
            </ScrollArea>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(exportData);
                toast({
                  title: "Sukses",
                  description: "Data bagan berhasil disalin ke clipboard",
                });
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 shadow-none"
            >
              <FileText className="mr-2 h-4 w-4" /> Salin ke Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add From Athletes Dialog */}
      <Dialog
        open={isAddFromAthletesDialogOpen}
        onOpenChange={setIsAddFromAthletesDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Tambah Peserta dari Atlet Terdaftar</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Pilih atlet yang sudah terdaftar untuk ditambahkan ke bagan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-300" />
              <Input
                placeholder="Cari atlet..."
                className="pl-8 bg-white border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white"
              />
            </div>
            <ScrollArea className="h-64 rounded-md border border-slate-200 dark:border-slate-700 p-4">
              <div className="space-y-2">
                {registeredAthletes.length === 0 ? (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Tidak ada atlet terdaftar
                  </p>
                ) : (
                  registeredAthletes.map((athlete) => (
                    <div
                      key={athlete.id}
                      className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-800/70 rounded-md"
                    >
                      <Checkbox
                        id={`athlete-${athlete.id}`}
                        checked={selectedAthletes.includes(athlete.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAthletes([
                              ...selectedAthletes,
                              athlete.id,
                            ]);
                          } else {
                            setSelectedAthletes(
                              selectedAthletes.filter(
                                (id) => id !== athlete.id,
                              ),
                            );
                          }
                        }}
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        {athlete.avatarUrl && (
                          <img
                            src={athlete.avatarUrl}
                            alt={athlete.name}
                            className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30"
                          />
                        )}
                        <label
                          htmlFor={`athlete-${athlete.id}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {athlete.name}
                        </label>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {athlete.teamName}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {selectedAthletes.length} atlet dipilih
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAthletes([])}
                disabled={selectedAthletes.length === 0}
              >
                Reset
              </Button>
            </div>
            <Button
              onClick={addFromRegisteredAthletes}
              disabled={selectedAthletes.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 shadow-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Peserta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BracketBuilder;
