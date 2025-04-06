import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Edit, Trash2, UserPlus, Eye, AlertTriangle } from "lucide-react";
import { calculateAge } from "@/lib/utils";
import { Athlete } from "@/types/athlete";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface AthleteGridProps {
  athletes: Athlete[];
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const AthleteGrid = ({
  athletes = [],
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
}: AthleteGridProps) => {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<string | null>(null);

  const handleViewDetails = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
  };

  const handleDeleteClick = (id: string) => {
    setAthleteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (athleteToDelete) {
      onDelete(athleteToDelete);
      setIsDeleteDialogOpen(false);
      setAthleteToDelete(null);
    }
  };

  const getAgeClass = (age: number) => {
    if (age < 15) return "bg-blue-100 text-blue-800";
    if (age >= 15 && age <= 17) return "bg-green-100 text-green-800";
    return "bg-amber-100 text-amber-800";
  };

  // Animation variants for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Daftar Atlit</h2>
        <Button
          onClick={onAdd}
          className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2"
        >
          <UserPlus size={16} />
          <span>Tambah Atlit</span>
        </Button>
      </div>

      {athletes.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-100/50 p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <AlertTriangle size={32} className="text-amber-500" />
            <h3 className="text-lg font-medium text-gray-900">
              Tidak ada data atlit
            </h3>
            <p className="text-gray-500 mb-4">
              Belum ada data atlit yang tersedia atau sesuai dengan filter
            </p>
            <Button
              onClick={onAdd}
              className="bg-gray-800 hover:bg-gray-900 text-white"
            >
              <UserPlus size={16} className="mr-2" />
              Tambah Atlit Baru
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {athletes.map((athlete) => {
            const age = calculateAge(athlete.dateOfBirth);
            return (
              <motion.div
                key={athlete.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                variants={item}
              >
                <Card className="overflow-hidden bg-white/70 backdrop-blur-md border border-gray-100/50 hover:shadow-lg transition-shadow">
                  <div className="p-6 flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4 ring-2 ring-offset-2 ring-gray-200">
                      <AvatarImage src={athlete.avatarUrl} alt={athlete.name} />
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl">
                        {athlete.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg text-gray-900 text-center">
                      {athlete.name}
                    </h3>
                    <Badge variant="secondary" className="mt-2">
                      {athlete.teamName}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${getAgeClass(age)}`}
                    >
                      {age} tahun
                    </Badge>
                  </div>
                  <CardContent className="px-6 pb-4 pt-0">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-gray-700">Sekolah:</div>
                      <div className="truncate" title={athlete.school}>
                        {athlete.school}
                      </div>
                      <div className="text-gray-700">Kelas:</div>
                      <div>{athlete.gradeYear}</div>
                      <div className="text-gray-700">Pelatih:</div>
                      <div className="truncate" title={athlete.coach}>
                        {athlete.coach}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-4 border-t border-gray-100/50 flex justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(athlete)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50"
                          >
                            <Eye size={16} className="mr-1" />
                            Detail
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lihat Detail</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(athlete)}
                              className="h-8 w-8 text-gray-700 hover:text-gray-800 hover:bg-gray-100/50"
                            >
                              <Edit size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(athlete.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hapus</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white/90 backdrop-blur-md border border-gray-100/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data atlit ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-gray-700">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Athlete Detail Dialog */}
      {selectedAthlete && (
        <AlertDialog
          open={!!selectedAthlete}
          onOpenChange={() => setSelectedAthlete(null)}
        >
          <AlertDialogContent className="bg-white/90 backdrop-blur-md border border-gray-100/50 max-w-md">
            <AlertDialogHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4 ring-2 ring-offset-2 ring-gray-200">
                  <AvatarImage
                    src={selectedAthlete.avatarUrl}
                    alt={selectedAthlete.name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">
                    {selectedAthlete.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <AlertDialogTitle className="text-xl">
                  {selectedAthlete.name}
                </AlertDialogTitle>
                <Badge className="mt-1">{selectedAthlete.teamName}</Badge>
              </div>
            </AlertDialogHeader>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4 text-sm">
              <div className="text-gray-500">ID Atlit:</div>
              <div className="font-medium">{selectedAthlete.id}</div>

              <div className="text-gray-500">Tanggal Lahir:</div>
              <div className="font-medium">
                {new Date(selectedAthlete.dateOfBirth).toLocaleDateString(
                  "id-ID",
                )}
              </div>

              <div className="text-gray-500">Umur:</div>
              <div className="font-medium">
                {calculateAge(selectedAthlete.dateOfBirth)} tahun
              </div>

              <div className="text-gray-500">Sekolah:</div>
              <div className="font-medium">{selectedAthlete.school}</div>

              <div className="text-gray-500">Kelas:</div>
              <div className="font-medium">{selectedAthlete.gradeYear}</div>

              <div className="text-gray-500">Pelatih:</div>
              <div className="font-medium">{selectedAthlete.coach}</div>
            </div>

            <AlertDialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => onEdit(selectedAthlete)}
                className="mr-2"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
              <AlertDialogCancel className="border-gray-200 text-gray-700">
                Tutup
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default AthleteGrid;
