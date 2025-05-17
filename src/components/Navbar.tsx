import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Check scroll position on mount and path change
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "API Docs", path: "/api-docs" },
    { name: "API Explorer", path: "/dashboard" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? "bg-primary/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      } text-white`}
    >
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              GhostPay<span className="text-secondary-light">Lite</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium hover:text-secondary-light transition-colors ${
                  isActive(link.path) ? "text-secondary-light" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="btn btn-outline bg-transparent text-white border-white hover:bg-white hover:text-primary"
            >
              Log In
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 bg-white backdrop-blur-md rounded-lg p-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md font-medium ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-primary hover:bg-gray-100 rounded-md"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 bg-secondary text-white rounded-md"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
