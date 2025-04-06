import { useState } from "react";
import { coaches } from "@/data/coachData";
import { Coach } from "@/types/coach";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Download } from "lucide-react";

interface CoachTableProps {
  onEdit?: (coach: Coach) => void;
  onDelete?: (id: string) => void;
}

export default function CoachTable({ onEdit, onDelete }: CoachTableProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const exportToCSV = () => {
    const headers = ["Name", "Age", "Address", "Email", "Phone", "School"];
    const csvData = [
      headers.join(","),
      ...filteredCoaches.map((coach) =>
        [
          `"${coach.name}"`,
          coach.age,
          `"${coach.address}"`,
          coach.email,
          coach.phone,
          `"${coach.school}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "coaches.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-xl border border-blue-100/50 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">Daftar Pelatih</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Cari pelatih..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white/70 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 rounded-lg"
            />
          </div>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-blue-100/50">
        <Table>
          <TableHeader className="bg-blue-50/80">
            <TableRow>
              <TableHead className="w-[50px]">Avatar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Umur</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No HP</TableHead>
              <TableHead>Perguruan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoaches.map((coach) => (
              <TableRow key={coach.id} className="hover:bg-blue-50/50">
                <TableCell>
                  <Avatar className="h-10 w-10 border-2 border-blue-100">
                    <AvatarImage src={coach.avatar} alt={coach.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {coach.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{coach.name}</TableCell>
                <TableCell>{coach.age}</TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={coach.address}
                >
                  {coach.address}
                </TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.phone}</TableCell>
                <TableCell>{coach.school}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-blue-700 border-blue-200 hover:bg-blue-100"
                      onClick={() => onEdit && onEdit(coach)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-red-700 border-red-200 hover:bg-red-100"
                      onClick={() => onDelete && onDelete(coach.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
