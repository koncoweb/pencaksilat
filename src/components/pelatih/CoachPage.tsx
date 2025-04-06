import { useState } from "react";
import { Coach } from "@/types/coach";
import { coaches } from "@/data/coachData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Grid, List } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CoachTable from "./CoachTable";
import CoachGrid from "./CoachGrid";
import CoachForm from "./CoachForm";
import Sidebar from "@/components/layout/Sidebar";

export default function CoachPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | undefined>(
    undefined,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setSelectedCoach(undefined);
    setShowForm(true);
  };

  const handleEdit = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCoachToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, you would delete from the database here
    console.log(`Deleting coach with ID: ${coachToDelete}`);
    setDeleteDialogOpen(false);
    setCoachToDelete(null);
  };

  const handleFormSubmit = (coachData: Omit<Coach, "id">) => {
    if (selectedCoach) {
      // Update existing coach
      console.log("Updating coach:", { ...selectedCoach, ...coachData });
    } else {
      // Add new coach
      const newCoach = {
        ...coachData,
        id: `new-${Date.now()}`,
      };
      console.log("Adding new coach:", newCoach);
    }
    setShowForm(false);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Manajemen Pelatih
          </h1>
          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Tambah Pelatih
          </Button>
        </div>

        {showForm ? (
          <CoachForm
            coach={selectedCoach}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Tabs defaultValue="table" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-blue-50/50 border border-blue-100/50">
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
                >
                  <List size={16} className="mr-2" />
                  Tampilan Tabel
                </TabsTrigger>
                <TabsTrigger
                  value="grid"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
                >
                  <Grid size={16} className="mr-2" />
                  Tampilan Grid
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table" className="mt-0">
              <CoachTable onEdit={handleEdit} onDelete={handleDelete} />
            </TabsContent>

            <TabsContent value="grid" className="mt-0">
              <CoachGrid onEdit={handleEdit} onDelete={handleDelete} />
            </TabsContent>
          </Tabs>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pelatih ini? Tindakan ini
                tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100">
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
      </div>
    </div>
  );
}
