import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Package, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScrollBehavior } from "@/hooks/use-scroll-to-top";
import { useAuthStore } from "@/store/authStore";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import Logo from "@/components/ui/Logo";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Export", href: "/export" },
  { name: "Recipes", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  // Get auth state and global settings
  const { user, isAuthenticated, logout } = useAuthStore();
  const { siteTitle } = useGlobalSettings();

  // Handle navigation with proper scroll behavior
  const handleNavigation = (href: string) => {
    const behavior = getScrollBehavior(href);
    
    // Close all menus
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    
    // Navigate to the route
    navigate(href);
    
    // Scroll to top with appropriate behavior
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }, 0);
  };

  // Handle profile menu navigation (simplified to avoid auth issues)
  const handleProfileNavigation = (href: string) => {
    console.log('Profile navigation to:', href);
    
    // Close profile dropdown
    setIsProfileDropdownOpen(false);
    
    // Simple navigation without scroll behavior that might interfere
    navigate(href);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      handleNavigation("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled
          ? "bg-obsidian/95 backdrop-blur-md border-b border-gold/10"
          : "bg-obsidian/90 backdrop-blur-sm"
      )}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation("/")} 
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <Logo size="3xl" />
            <span className="hidden sm:block text-cream/60 text-xs tracking-luxury uppercase">
              Premium Sauces
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "text-sm font-medium tracking-wide transition-all duration-300 hover:text-gold cursor-pointer",
                  location.pathname === item.href
                    ? "text-gold"
                    : "text-cream/80"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white bg-gold/50 hover:bg-gold/70 p-4 transition-all duration-300 relative z-[60] rounded-lg border-2 border-gold shadow-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              style={{ minWidth: '52px', minHeight: '52px' }}
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7 mx-auto text-white" />
              ) : (
                <Menu className="w-7 h-7 mx-auto text-white" />
              )}
            </button>

            {/* Conditional Auth/Profile Section - Desktop */}
            {isAuthenticated && user && (
              // Profile Dropdown for Authenticated Users
              <div className="hidden lg:block relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-cream/80 hover:text-gold transition-all duration-300 border border-gold/30 rounded-lg bg-obsidian/50 hover:bg-gold/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-cream">{user.name}</div>
                    <div className="text-xs text-cream/60 capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isProfileDropdownOpen ? "rotate-180" : ""
                  )} />
                </button>

                {/* Profile Dropdown Menu */}
                <div className={cn(
                  "absolute right-0 mt-2 w-72 bg-obsidian/95 backdrop-blur-xl border border-gold/20 rounded-lg shadow-2xl transition-all duration-300 z-50",
                  isProfileDropdownOpen 
                    ? "opacity-100 visible transform translate-y-0" 
                    : "opacity-0 invisible transform -translate-y-2"
                )}>
                  <div className="p-4">
                    {/* User Info Header */}
                    <div className="flex items-center space-x-3 pb-4 border-b border-gold/10">
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <div className="font-medium text-cream">{user.name}</div>
                        <div className="text-sm text-cream/60">{user.email}</div>
                        <div className="text-xs text-gold capitalize">{user.role} Account</div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-3 space-y-1">
                      <button
                        onClick={() => handleProfileNavigation("/profile")}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 group"
                      >
                        <Settings className="w-4 h-4 text-cream/60 group-hover:text-gold" />
                        <span className="text-cream group-hover:text-gold">Profile Settings</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileNavigation("/orders")}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 group"
                      >
                        <Package className="w-4 h-4 text-cream/60 group-hover:text-gold" />
                        <span className="text-cream group-hover:text-gold">My Orders</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileNavigation("/wishlist")}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 group"
                      >
                        <Heart className="w-4 h-4 text-cream/60 group-hover:text-gold" />
                        <span className="text-cream group-hover:text-gold">Wishlist</span>
                      </button>
                      
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleProfileNavigation("/admin")}
                          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 group"
                        >
                          <Settings className="w-4 h-4 text-cream/60 group-hover:text-gold" />
                          <span className="text-cream group-hover:text-gold">Admin Dashboard</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Logout */}
                    <div className="pt-3 border-t border-gold/10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-500/10 transition-all duration-300 group"
                      >
                        <LogOut className="w-4 h-4 text-cream/60 group-hover:text-red-400" />
                        <span className="text-cream group-hover:text-red-400">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500 bg-obsidian/95 backdrop-blur-md border-t border-gold/20",
            isMobileMenuOpen ? "max-h-96 pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-4 pt-4 border-t border-gold/10">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "text-lg font-medium tracking-wide transition-colors text-left",
                  location.pathname === item.href
                    ? "text-gold"
                    : "text-cream/80 hover:text-gold"
                )}
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile Auth/Profile Section */}
            {isAuthenticated && user && (
              // Profile Section for Authenticated Users - Mobile
              <div className="border-t border-gold/10 pt-4 mt-4">
                <div className="flex items-center space-x-3 p-4 border border-gold/20 rounded-lg bg-obsidian/30 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="font-medium text-cream">{user.name}</div>
                    <div className="text-sm text-cream/60">{user.email}</div>
                    <div className="text-xs text-gold capitalize">{user.role} Account</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleProfileNavigation("/profile")}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 text-left"
                  >
                    <Settings className="w-4 h-4 text-cream/60" />
                    <span className="text-cream">Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={() => handleProfileNavigation("/orders")}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 text-left"
                  >
                    <Package className="w-4 h-4 text-cream/60" />
                    <span className="text-cream">My Orders</span>
                  </button>
                  
                  <button
                    onClick={() => handleProfileNavigation("/wishlist")}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 text-left"
                  >
                    <Heart className="w-4 h-4 text-cream/60" />
                    <span className="text-cream">Wishlist</span>
                  </button>
                  
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleProfileNavigation("/admin")}
                      className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gold/10 transition-all duration-300 text-left"
                    >
                      <Settings className="w-4 h-4 text-cream/60" />
                      <span className="text-cream">Admin Dashboard</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-500/10 transition-all duration-300 text-left"
                  >
                    <LogOut className="w-4 h-4 text-cream/60" />
                    <span className="text-cream">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
