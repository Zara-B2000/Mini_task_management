"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  FolderKanban,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#", active: true },
  { icon: CheckSquare, label: "My Tasks", href: "#" },
  { icon: FolderKanban, label: "Projects", href: "#" },
  { icon: Calendar, label: "Calendar", href: "#" },
  { icon: Users, label: "Team", href: "#" },
  { icon: BarChart3, label: "Analytics", href: "#" },
]

const bottomMenuItems = [
  { icon: Settings, label: "Settings", href: "#" },
  { icon: LogOut, label: "Logout", href: "#" },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">TaskFlow</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          {bottomMenuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
        </div>
      </aside>
    </>
  )
}
