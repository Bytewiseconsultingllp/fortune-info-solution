"use client";

import FooterSection from "@/components/footerSection";
import Header from "@/app/home/components/navigation/Header";
import { ProductDashboard } from "@/components/product-dashboard";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      // Don't limit to just 1 product, we need all categories and brands
      const response = await fetch(`/api/products?getAllFilters=true`);
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        console.log("Categories:", data.categories);
        console.log("Brands:", data.brands);

        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          console.error("No categories returned from API");
        }

        if (Array.isArray(data.brands) && data.brands.length > 0) {
          setBrands(data.brands);
        } else {
          console.error("No brands returned from API");
        }
      } else {
        console.error("Failed to fetch categories & brands");
      }
    } catch (error) {
      console.error("Error fetching categories & brands:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <ProductDashboard categories={categories} brands={brands} />
      </div>
      <FooterSection />
    </>
  );
}
