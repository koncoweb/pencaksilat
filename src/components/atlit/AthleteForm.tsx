import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Athlete } from "@/types/athlete";
import { calculateAge } from "@/lib/utils";
import { Upload, AlertCircle, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";

interface AthleteFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (athlete: Athlete) => void;
  athlete?: Athlete;
}

const defaultAthlete: Athlete = {
  id: "",
  name: "",
  dateOfBirth: "",
  school: "",
  gradeYear: "",
  avatarUrl: "",
  teamName: "",
  coach: "",
};

const AthleteForm = ({
  open = false,
  onClose = () => {},
  onSave = () => {},
  athlete,
}: AthleteFormProps) => {
  const [form, setForm] = useState<Athlete>(athlete || defaultAthlete);
  const [age, setAge] = useState<number>(
    athlete ? calculateAge(athlete.dateOfBirth) : 0,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [isFormValid, setIsFormValid] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Available teams and grade years for selection
  const availableTeams = ["Garuda Muda", "Rajawali Putri", "Elang Jaya"];
  const availableGrades = ["Kelas 10", "Kelas 11", "Kelas 12"];

  // Reset form when athlete changes
  useEffect(() => {
    if (open) {
      setForm(athlete || defaultAthlete);
      setAge(athlete ? calculateAge(athlete.dateOfBirth) : 0);
      setErrors({});
      setActiveTab("basic");
      setPreviewAvatar(null);
    }
  }, [athlete, open]);

  // Validate form on change
  useEffect(() => {
    validateForm();
  }, [form]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    // Basic validation
    if (!form.name.trim()) {
      newErrors.name = "Nama harus diisi";
      valid = false;
    } else if (form.name.length < 3) {
      newErrors.name = "Nama minimal 3 karakter";
      valid = false;
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Tanggal lahir harus diisi";
      valid = false;
    } else {
      const birthDate = new Date(form.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = "Tanggal lahir tidak valid";
        valid = false;
      }
    }

    if (!form.school.trim()) {
      newErrors.school = "Sekolah harus diisi";
      valid = false;
    }

    if (!form.teamName.trim()) {
      newErrors.teamName = "Tim harus diisi";
      valid = false;
    }

    if (!form.coach.trim()) {
      newErrors.coach = "Pelatih harus diisi";
      valid = false;
    }

    setErrors(newErrors);
    setIsFormValid(valid);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      setAge(calculateAge(value));
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...form,
        id: form.id || `atl-${Date.now().toString().slice(-6)}`,
        avatarUrl:
          previewAvatar ||
          form.avatarUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name.split(" ")[0].toLowerCase()}`,
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For this demo, we'll use a local URL
      const url = URL.createObjectURL(file);
      setPreviewAvatar(url);
    }
  };

  const generateRandomAvatar = () => {
    if (form.name) {
      const seed = Math.random().toString(36).substring(2, 8);
      const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
      setPreviewAvatar(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-md border border-gray-100/50 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {athlete ? "Edit Atlit" : "Tambah Atlit Baru"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="basic" className="text-sm">
                Informasi Dasar
              </TabsTrigger>
              <TabsTrigger value="additional" className="text-sm">
                Informasi Tambahan
              </TabsTrigger>
            </TabsList>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[70vh]"
          >
            <TabsContent value="basic" className="p-6 pt-2 space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-2 ring-2 ring-offset-2 ring-gray-200">
                  <AvatarImage
                    src={previewAvatar || form.avatarUrl}
                    alt={form.name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl">
                    {form.name
                      ? form.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 flex gap-2">
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm"
                  >
                    <Upload size={14} />
                    <span>Unggah Foto</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateRandomAvatar}
                    className="text-sm"
                  >
                    Generate Avatar
                  </Button>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>Nama</span>
                    {errors.name && (
                      <span className="text-red-500 text-xs">
                        {errors.name}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`border-gray-200 focus:border-gray-400 bg-white/50 ${errors.name ? "border-red-300 focus:border-red-500" : ""}`}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>Tanggal Lahir</span>
                    {errors.dateOfBirth && (
                      <span className="text-red-500 text-xs">
                        {errors.dateOfBirth}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className={`border-gray-200 focus:border-gray-400 bg-white/50 ${errors.dateOfBirth ? "border-red-300 focus:border-red-500" : ""}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700">
                    Umur
                  </Label>
                  <Input
                    id="age"
                    value={`${age} tahun`}
                    className="border-gray-200 bg-gray-50/50"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="school"
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>Sekolah</span>
                    {errors.school && (
                      <span className="text-red-500 text-xs">
                        {errors.school}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="school"
                    name="school"
                    value={form.school}
                    onChange={handleChange}
                    className={`border-gray-200 focus:border-gray-400 bg-white/50 ${errors.school ? "border-red-300 focus:border-red-500" : ""}`}
                    placeholder="Nama sekolah"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="p-6 pt-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeYear" className="text-gray-700">
                    Kelas
                  </Label>
                  <Select
                    value={form.gradeYear}
                    onValueChange={(value) =>
                      handleSelectChange("gradeYear", value)
                    }
                  >
                    <SelectTrigger className="border-gray-200 focus:border-gray-400 bg-white/50">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="teamName"
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>Tim</span>
                    {errors.teamName && (
                      <span className="text-red-500 text-xs">
                        {errors.teamName}
                      </span>
                    )}
                  </Label>
                  <Select
                    value={form.teamName}
                    onValueChange={(value) =>
                      handleSelectChange("teamName", value)
                    }
                  >
                    <SelectTrigger
                      className={`border-gray-200 focus:border-gray-400 bg-white/50 ${errors.teamName ? "border-red-300 focus:border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Pilih tim" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label
                    htmlFor="coach"
                    className="text-gray-700 flex items-center justify-between"
                  >
                    <span>Pelatih</span>
                    {errors.coach && (
                      <span className="text-red-500 text-xs">
                        {errors.coach}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="coach"
                    name="coach"
                    value={form.coach}
                    onChange={handleChange}
                    className={`border-gray-200 focus:border-gray-400 bg-white/50 ${errors.coach ? "border-red-300 focus:border-red-500" : ""}`}
                    placeholder="Nama pelatih"
                  />
                </div>
              </div>

              {Object.keys(errors).length > 0 && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 text-red-800 border border-red-200"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Mohon perbaiki kesalahan pada formulir sebelum menyimpan.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <div className="flex justify-between items-center p-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {isFormValid ? (
                  <div className="flex items-center text-green-600 text-sm gap-1">
                    <Check size={16} />
                    <span>Formulir valid</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600 text-sm gap-1">
                    <AlertCircle size={16} />
                    <span>Lengkapi semua data</span>
                  </div>
                )}
              </div>

              <DialogFooter className="p-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-200 text-gray-700"
                >
                  <X size={16} className="mr-1" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                  disabled={!isFormValid}
                >
                  <Check size={16} className="mr-1" />
                  Simpan
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AthleteForm;
