import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Award,
  ClipboardList,
  BarChart2,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive?: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const NavItem = ({
  icon: Icon = Home,
  label = "Menu Item",
  path = "/",
  isActive = false,
  hasChildren = false,
  isOpen = false,
  onClick,
  children,
}: NavItemProps) => {
  return (
    <div className="mb-1">
      <Link to={path} className="block">
        <motion.div
          whileHover={{ x: 5 }}
          className={cn(
            "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
            isActive
              ? "bg-gray-200/60 text-gray-900 backdrop-blur-md border-l-4 border-gray-800"
              : "text-gray-800 hover:bg-gray-100/50 hover:backdrop-blur-md",
          )}
          onClick={onClick}
        >
          <Icon
            size={20}
            className={cn("mr-3", isActive ? "text-gray-900" : "text-gray-700")}
          />
          <span className="flex-1">{label}</span>
          {hasChildren && (
            <div className="ml-auto">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </motion.div>
      </Link>
      {hasChildren && isOpen && (
        <div className="ml-6 mt-1 pl-2 border-l border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    reports: false,
    settings: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "h-full relative transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72",
        className,
      )}
    >
      {/* Glass container for sidebar */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-r border-gray-100/50 shadow-lg z-0" />

      {/* Decorative elements */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gray-200/20 z-0" />
      <div className="absolute top-40 -left-10 w-20 h-20 rounded-full bg-gray-100/30 z-0" />

      <div className="relative z-10 h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-8 mt-2">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold mr-3">
                PS
              </div>
              <h2 className="text-xl font-bold text-gray-900">Pencak Silat</h2>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto text-gray-700 hover:bg-gray-100/50 hover:text-gray-800"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isCollapsed ? (
            <TooltipProvider>
              <div className="flex flex-col items-center space-y-4 mt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl",
                          location.pathname === "/"
                            ? "bg-gray-200/60 text-gray-900"
                            : "text-gray-700",
                        )}
                      >
                        <Home size={22} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/atlit">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl",
                          location.pathname.startsWith("/atlit")
                            ? "bg-gray-200/60 text-gray-900"
                            : "text-gray-700",
                        )}
                      >
                        <Users size={22} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Atlit</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/pelatih">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl",
                          location.pathname.startsWith("/pelatih")
                            ? "bg-gray-200/60 text-gray-900"
                            : "text-gray-700",
                        )}
                      >
                        <Award size={22} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Pelatih</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/pendaftaran">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl",
                          location.pathname.startsWith("/pendaftaran")
                            ? "bg-gray-200/60 text-gray-900"
                            : "text-gray-700",
                        )}
                      >
                        <ClipboardList size={22} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Pendaftaran</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/bagan">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl",
                          location.pathname.startsWith("/bagan")
                            ? "bg-gray-200/60 text-gray-900"
                            : "text-gray-700",
                        )}
                      >
                        <BarChart2 size={22} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Bagan Pertandingan
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/laporan">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl",
                          location.pathname.startsWith("/laporan")
                            ? "bg-gray-200/60 text-gray-900"
                            : "text-gray-700",
                        )}
                      >
                        <FileText size={22} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Laporan</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/settings">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl",
                          location.pathname.startsWith("/settings")
                            ? "bg-gray-200/60 text-gray-900"
                            : "text-gray-700",
                        )}
                      >
                        <Settings size={22} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    User Role Settings
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          ) : (
            <div className="space-y-1">
              <NavItem
                icon={Home}
                label="Dashboard"
                path="/"
                isActive={location.pathname === "/"}
              />

              <NavItem
                icon={Users}
                label="Atlit"
                path="/atlit"
                isActive={location.pathname.startsWith("/atlit")}
              />

              <NavItem
                icon={Award}
                label="Pelatih"
                path="/pelatih"
                isActive={location.pathname.startsWith("/pelatih")}
              />

              <NavItem
                icon={ClipboardList}
                label="Pendaftaran"
                path="/pendaftaran"
                isActive={location.pathname.startsWith("/pendaftaran")}
              />

              <NavItem
                icon={BarChart2}
                label="Bagan Pertandingan"
                path="/bagan"
                isActive={location.pathname.startsWith("/bagan")}
              />

              <NavItem
                icon={FileText}
                label="Laporan"
                path="/laporan"
                hasChildren={true}
                isOpen={openMenus.reports}
                onClick={() => toggleMenu("reports")}
                isActive={location.pathname.startsWith("/laporan")}
              >
                <NavItem
                  label="Hasil Pertandingan"
                  path="/laporan/hasil"
                  isActive={location.pathname === "/laporan/hasil"}
                />
                <NavItem
                  label="Statistik"
                  path="/laporan/statistik"
                  isActive={location.pathname === "/laporan/statistik"}
                />
              </NavItem>

              <NavItem
                icon={Settings}
                label="User Role Settings"
                path="/settings"
                hasChildren={true}
                isOpen={openMenus.settings}
                onClick={() => toggleMenu("settings")}
                isActive={location.pathname.startsWith("/settings")}
              >
                <NavItem
                  label="User Management"
                  path="/settings/users"
                  isActive={location.pathname === "/settings/users"}
                />
                <NavItem
                  label="Permissions"
                  path="/settings/permissions"
                  isActive={location.pathname === "/settings/permissions"}
                />
              </NavItem>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          {!isCollapsed && (
            <div className="p-4 rounded-lg bg-gray-100/50 backdrop-blur-sm border border-gray-200/50">
              <p className="text-sm text-gray-800 font-medium">
                Kejuaraan Pencak Silat
              </p>
              <p className="text-xs text-gray-700/70 mt-1">
                Admin Dashboard v1.0
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
