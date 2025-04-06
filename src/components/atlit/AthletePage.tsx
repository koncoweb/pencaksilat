import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { Input } from "../ui/input";
import AthleteTable from "./AthleteTable";
import AthleteGrid from "./AthleteGrid";
import AthleteForm from "./AthleteForm";
import { Athlete } from "@/types/athlete";
import { athleteData } from "@/data/athleteData";
import Sidebar from "../layout/Sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const AthletePage = () => {
  const [athletes, setAthletes] = useState<Athlete[]>(athleteData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | undefined>();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get unique team names for filtering
  const teamNames = [
    ...new Set(athleteData.map((athlete) => athlete.teamName)),
  ];

  // Apply filters and sorting
  const getFilteredAthletes = () => {
    let result = [...athletes];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (athlete) =>
          athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          athlete.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
          athlete.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          athlete.coach.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply team filter
    if (filterBy !== "all") {
      result = result.filter((athlete) => athlete.teamName === filterBy);
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "name":
          valueA = a.name;
          valueB = b.name;
          break;
        case "school":
          valueA = a.school;
          valueB = b.school;
          break;
        case "team":
          valueA = a.teamName;
          valueB = b.teamName;
          break;
        case "age":
          valueA = new Date(a.dateOfBirth).getTime();
          valueB = new Date(b.dateOfBirth).getTime();
          break;
        default:
          valueA = a.name;
          valueB = b.name;
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return result;
  };

  const filteredAthletes = getFilteredAthletes();

  const handleAddAthlete = () => {
    setCurrentAthlete(undefined);
    setIsFormOpen(true);
  };

  const handleEditAthlete = (athlete: Athlete) => {
    setCurrentAthlete(athlete);
    setIsFormOpen(true);
  };

  const handleDeleteAthlete = (id: string) => {
    setAthletes((prev) => prev.filter((athlete) => athlete.id !== id));
  };

  const handleSaveAthlete = (athlete: Athlete) => {
    if (currentAthlete) {
      // Edit existing athlete
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? athlete : a)),
      );
    } else {
      // Add new athlete
      setAthletes((prev) => [...prev, athlete]);
    }
    setIsFormOpen(false);
  };

  const handleExportData = () => {
    // Create CSV content
    const headers = [
      "ID",
      "Name",
      "Date of Birth",
      "School",
      "Grade Year",
      "Team Name",
      "Coach",
    ];
    const csvContent = [
      headers.join(","),
      ...athletes.map((athlete) =>
        [
          athlete.id,
          `"${athlete.name}"`,
          athlete.dateOfBirth,
          `"${athlete.school}"`,
          `"${athlete.gradeYear}"`,
          `"${athlete.teamName}"`,
          `"${athlete.coach}"`,
        ].join(","),
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "athletes.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setAthletes([...athleteData]);
      setIsLoading(false);
    }, 800);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Atlit</h1>
              <p className="text-gray-700">
                Kelola data atlit Kejuaraan Pencak Silat
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <Input
                  placeholder="Cari atlit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-gray-400 bg-white/50"
                />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRefreshData}
                      className="h-10 w-10 border-gray-200 text-gray-700"
                      disabled={isLoading}
                    >
                      <RefreshCw
                        size={18}
                        className={isLoading ? "animate-spin" : ""}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleExportData}
                      className="h-10 w-10 border-gray-200 text-gray-700"
                    >
                      <Download size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export Data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[180px] border-gray-200 bg-white/50">
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by Team" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teamNames.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-gray-200 bg-white/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="h-10 w-10 border-gray-200 text-gray-700"
              >
                {sortOrder === "asc" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 8 4-4 4 4" />
                    <path d="M7 4v16" />
                    <path d="M11 12h4" />
                    <path d="M11 16h7" />
                    <path d="M11 20h10" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 16 4 4 4-4" />
                    <path d="M7 20V4" />
                    <path d="M11 4h10" />
                    <path d="M11 8h7" />
                    <path d="M11 12h4" />
                  </svg>
                )}
              </Button>
            </div>
          </header>

          <div className="mb-6 flex justify-end">
            <div className="bg-white/70 backdrop-blur-md rounded-lg border border-gray-100/50 p-1 inline-flex">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-gray-800 text-white" : ""}
              >
                <List size={16} className="mr-2" />
                Table
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-gray-800 text-white" : ""}
              >
                <LayoutGrid size={16} className="mr-2" />
                Grid
              </Button>
            </div>
          </div>

          {viewMode === "table" ? (
            <AthleteTable
              athletes={filteredAthletes}
              onEdit={handleEditAthlete}
              onDelete={handleDeleteAthlete}
              onAdd={handleAddAthlete}
            />
          ) : (
            <AthleteGrid
              athletes={filteredAthletes}
              onEdit={handleEditAthlete}
              onDelete={handleDeleteAthlete}
              onAdd={handleAddAthlete}
            />
          )}
        </div>
      </div>

      <AthleteForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAthlete}
        athlete={currentAthlete}
      />
    </div>
  );
};

export default AthletePage;
