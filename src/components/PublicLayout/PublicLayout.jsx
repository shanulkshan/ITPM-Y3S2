import React from "react";
import ModernNavbar from "../navbar/ModernNavbar";
import Footer from "../footer/Footer";
import { useDarkMode } from "../../context/DarkModeContext";

const PublicLayout = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-screen transition-colors duration-300`}>
      <ModernNavbar />
      <div className="pt-20 min-h-[65vh]">{children}</div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
