import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Car,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  FilePieChart,
  ChevronDown,
  ChevronRight,
  Plus,
  ListFilter
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  const { user, signOut, isHost } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const userNavItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard'
    },
    {
      title: 'My Bookings',
      icon: <Calendar className="h-5 w-5" />,
      href: '/bookings'
    },
    {
      title: 'Reports',
      icon: <FilePieChart className="h-5 w-5" />,
      href: '/reports'
    },
    {
      title: 'My Vehicles',
      icon: <Car className="h-5 w-5" />,
      href: '/vehicles'
    }
  ];

  const hostNavItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/host/dashboard'
    },
    {
      title: 'My Parking Spaces',
      icon: <Car className="h-5 w-5" />,
      href: '/host/spots'
    },
    {
      title: 'Bookings',
      icon: <Calendar className="h-5 w-5" />,
      href: '/host/bookings'
    },
    {
      title: 'Reports & Analytics',
      icon: <FilePieChart className="h-5 w-5" />,
      href: '/host/reports'
    }
  ];

  const navItems = isHost ? hostNavItems : userNavItems;

  const isNavItemActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <aside
        className={`fixed z-20 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-4 flex items-center justify-between border-b">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <Car className="h-6 w-6" />
              <span className="text-lg font-bold">SpaceDrive</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 py-6 px-4 space-y-6">
            {isHost && (
              <Button className="w-full gap-2 mb-2" asChild>
                <Link to="/host/spots/new">
                  <Plus className="h-4 w-4" />
                  Add Parking Space
                </Link>
              </Button>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isNavItemActive(item.href)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback>
                  {user?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b shadow-sm h-16 flex items-center px-4">
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden"
            >
              {isMobileSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
            <div className="flex-1" />
            
            <Button variant="outline" asChild>
              <Link to="/search">
                <ListFilter className="mr-2 h-4 w-4" />
                Search Spots
              </Link>
            </Button>
            
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={user?.profileImage} />
                      <AvatarFallback>
                        {user?.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {isMobileSidebarOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-md z-10">
            <nav className="py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    isNavItemActive(item.href)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
              <Separator className="my-2" />
              <div className="px-4 py-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
