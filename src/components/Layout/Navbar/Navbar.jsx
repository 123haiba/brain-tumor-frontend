import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  const nav = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Categories",
      link: "/categories",
    },
    {
      name: "Brain Tumor AI",
      link: "/brain-tumor-ai",
    },
    {
      name: "Services",
      link: "/services",
    },
    {
      name: "About Us",
      link: "/about",
    },
  ];

  // Determine where to route the profile button
  const profileRoute = isAuthenticated ? "/profile" : "/login";

  // Check if the current path matches a nav item
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 sm:px-12 bg-transparent text-white font-medium relative z-50">
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-20" />
      </div>
      {/* Desktop Nav */}
      <ul className="hidden sm:flex gap-6 text-white text-sm sm:text-base">
        {nav.map((item) => (
          <li
            key={item.name}
            className={`cursor-pointer transition-all duration-300 text-2xl ${
              isActive(item.link)
                ? "text-green-500 font-semibold"
                : "text-white hover:text-green-500"
            }`}
          >
            <Link to={item.link}>{item.name}</Link>
          </li>
        ))}
      </ul>
      {/* Mobile Hamburger */}
      <button
        className="sm:hidden flex items-center justify-center text-white text-3xl focus:outline-none cursor-pointer z-50"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Open menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#091447f5] flex flex-col items-center justify-center gap-8 sm:hidden transition-all z-40">
          <ul className="flex flex-col gap-8 text-2xl font-bold">
            {nav.map((item) => (
              <li key={item.name} onClick={() => setMenuOpen(false)}>
                <Link
                  to={item.link}
                  className={`transition-all duration-300 ${
                    isActive(item.link)
                      ? "text-green-500"
                      : "text-white hover:text-greentext"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li onClick={() => setMenuOpen(false)}>
              <Link
                to={profileRoute}
                className={`transition-all duration-300 ${
                  isActive(profileRoute)
                    ? "text-green-500"
                    : "text-white hover:text-greentext"
                }`}
              >
                {isAuthenticated ? "Profile" : "Login"}
              </Link>
            </li>
          </ul>
        </div>
      )}
      {/* Desktop User Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white hidden sm:flex ${
          isActive(profileRoute)
            ? "bg-green-600"
            : "bg-greenback hover:bg-green-600"
        }`}
      >
        <Link to={profileRoute}>
          <FaUser size={20} className="cursor-pointer bg-transparent" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
