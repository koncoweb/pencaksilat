import { useState } from "react";
import { Coach } from "@/types/coach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";

interface CoachFormProps {
  coach?: Coach;
  onSubmit: (coach: Omit<Coach, "id">) => void;
  onCancel: () => void;
}

const defaultCoach: Omit<Coach, "id"> = {
  name: "",
  age: 0,
  address: "",
  email: "",
  phone: "",
  school: "",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(2, 7)}`,
};

export default function CoachForm({
  coach,
  onSubmit,
  onCancel,
}: CoachFormProps) {
  const [formData, setFormData] = useState<Omit<Coach, "id">>(
    coach || defaultCoach,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi";
    }

    if (formData.age <= 0) {
      newErrors.age = "Umur harus lebih dari 0";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat harus diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor HP harus diisi";
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "Nomor HP tidak valid (10-15 digit)";
    }

    if (!formData.school.trim()) {
      newErrors.school = "Nama perguruan harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const generateNewAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 7);
    setFormData((prev) => ({
      ...prev,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/80 backdrop-blur-md rounded-xl border border-blue-100/50 shadow-lg p-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-900">
          {coach ? "Edit Pelatih" : "Tambah Pelatih Baru"}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </Button>
      </div>

      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-24 w-24 border-4 border-blue-100 mb-4">
          <AvatarImage src={formData.avatar} alt="Avatar" />
          <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
            {formData.name ? formData.name.substring(0, 2).toUpperCase() : "PS"}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          variant="outline"
          onClick={generateNewAvatar}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          Generate Avatar Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
            Nama{" "}
            {errors.name && (
              <span className="text-red-500">({errors.name})</span>
            )}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`bg-white/70 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 ${errors.name ? "border-red-300 ring-1 ring-red-300" : ""}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className={errors.age ? "text-red-500" : ""}>
            Umur{" "}
            {errors.age && <span className="text-red-500">({errors.age})</span>}
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            className={`bg-white/70 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 ${errors.age ? "border-red-300 ring-1 ring-red-300" : ""}`}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="address"
            className={errors.address ? "text-red-500" : ""}
          >
            Alamat{" "}
            {errors.address && (
              <span className="text-red-500">({errors.address})</span>
            )}
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`bg-white/70 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 ${errors.address ? "border-red-300 ring-1 ring-red-300" : ""}`}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
            Email{" "}
            {errors.email && (
              <span className="text-red-500">({errors.email})</span>
            )}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`bg-white/70 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 ${errors.email ? "border-red-300 ring-1 ring-red-300" : ""}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className={errors.phone ? "text-red-500" : ""}>
            No HP{" "}
            {errors.phone && (
              <span className="text-red-500">({errors.phone})</span>
            )}
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`bg-white/70 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 ${errors.phone ? "border-red-300 ring-1 ring-red-300" : ""}`}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="school"
            className={errors.school ? "text-red-500" : ""}
          >
            Nama Perguruan{" "}
            {errors.school && (
              <span className="text-red-500">({errors.school})</span>
            )}
          </Label>
          <Input
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            className={`bg-white/70 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 ${errors.school ? "border-red-300 ring-1 ring-red-300" : ""}`}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {coach ? "Update Pelatih" : "Simpan Pelatih"}
        </Button>
      </div>
    </form>
  );
}
