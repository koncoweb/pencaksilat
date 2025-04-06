import { useState } from "react";
import { coaches } from "@/data/coachData";
import { Coach } from "@/types/coach";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone } from "lucide-react";

interface CoachGridProps {
  onEdit?: (coach: Coach) => void;
  onDelete?: (id: string) => void;
}

export default function CoachGrid({ onEdit, onDelete }: CoachGridProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-xl border border-blue-100/50 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">Daftar Pelatih</h2>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCoaches.map((coach) => (
          <Card
            key={coach.id}
            className="overflow-hidden bg-white/90 border-blue-100/50 hover:shadow-md transition-shadow duration-300"
          >
            <div className="h-24 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src={coach.avatar} alt={coach.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                  {coach.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-center text-blue-900 mb-1">
                {coach.name}
              </h3>
              <p className="text-sm text-center text-gray-500 mb-4">
                {coach.school}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium w-20 text-gray-700">Umur:</span>
                  <span className="text-gray-600">{coach.age} tahun</span>
                </div>

                <div className="flex items-center text-sm">
                  <Mail size={14} className="text-blue-500 mr-2" />
                  <span className="text-gray-600 truncate" title={coach.email}>
                    {coach.email}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Phone size={14} className="text-blue-500 mr-2" />
                  <span className="text-gray-600">{coach.phone}</span>
                </div>

                <div className="text-sm mt-2">
                  <span className="font-medium text-gray-700 block mb-1">
                    Alamat:
                  </span>
                  <p
                    className="text-gray-600 text-sm line-clamp-2"
                    title={coach.address}
                  >
                    {coach.address}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-2 pt-2 pb-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-blue-700 border-blue-200 hover:bg-blue-100"
                onClick={() => onEdit && onEdit(coach)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-red-700 border-red-200 hover:bg-red-100"
                onClick={() => onDelete && onDelete(coach.id)}
              >
                Hapus
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
