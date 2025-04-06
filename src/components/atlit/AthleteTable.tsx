import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Edit, Trash2, UserPlus, Eye, AlertTriangle } from "lucide-react";
import { calculateAge } from "@/lib/utils";
import { Athlete } from "@/types/athlete";
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

interface AthleteTableProps {
  athletes: Athlete[];
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const AthleteTable = ({
  athletes = [],
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
}: AthleteTableProps) => {
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

  return (
    <div className="w-full bg-white/70 backdrop-blur-md rounded-xl border border-gray-100/50 shadow-md overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-100/50">
        <h2 className="text-xl font-semibold text-gray-900">Daftar Atlit</h2>
        <Button
          onClick={onAdd}
          className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2"
        >
          <UserPlus size={16} />
          <span>Tambah Atlit</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead className="w-[60px]">Avatar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Tanggal Lahir</TableHead>
              <TableHead>Umur</TableHead>
              <TableHead>Sekolah</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Tim</TableHead>
              <TableHead>Pelatih</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {athletes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle size={24} className="text-amber-500" />
                    <p>Tidak ada data atlit yang ditemukan</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAdd}
                      className="mt-2"
                    >
                      <UserPlus size={16} className="mr-2" />
                      Tambah Atlit Baru
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              athletes.map((athlete, index) => {
                const age = calculateAge(athlete.dateOfBirth);
                return (
                  <TableRow
                    key={athlete.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Avatar className="border border-gray-200">
                        <AvatarImage
                          src={athlete.avatarUrl}
                          alt={athlete.name}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {athlete.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {athlete.name}
                    </TableCell>
                    <TableCell>
                      {new Date(athlete.dateOfBirth).toLocaleDateString(
                        "id-ID",
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getAgeClass(age)}`}
                      >
                        {age} tahun
                      </Badge>
                    </TableCell>
                    <TableCell>{athlete.school}</TableCell>
                    <TableCell>{athlete.gradeYear}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {athlete.teamName}
                      </Badge>
                    </TableCell>
                    <TableCell>{athlete.coach}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(athlete)}
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50"
                              >
                                <Eye size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Lihat Detail</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

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
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

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

export default AthleteTable;
