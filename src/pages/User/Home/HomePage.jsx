import React from "react";
import HomeBanner from "./HomeBanner";
import BlogSection from "./BlogSection";
import PromoSection from './PromoSection';
import ProductList from './ProductList';

const HomePage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <HomeBanner />
      <PromoSection />
      <ProductList  />
      <BlogSection />
      {/* home page section */}
    
    </div>
  );
};

export default HomePage;
