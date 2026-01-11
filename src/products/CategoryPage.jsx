import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import ProductCard from "./ProductCard";
import { getCategoryBySlug } from "./productsData";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [category, setCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productRefs = useRef({});

  useEffect(() => {
    const result = getCategoryBySlug(slug);
    if (result) {
      const [, cat] = result;
      setCategory(cat);
      setFilteredProducts(cat.products);
    }
  }, [slug]);

  if (!category) {
    return (
      <Layout>
        <h2>Category Not Found</h2>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="category-page-wrapper">
        {/* ================= LEFT FILTER ================= */}
        <aside className="filter-sidebar">
          <div className="filter-header">
            <span className="filter-title">ICON FILTERS</span>
            <button className="reset-btn">RESET</button>
          </div>

          {[
            "SORT BY",
            "DISCOUNT",
            "RATINGS",
            "FILTER BY GOALS",
            "LIFESTAGE",
            "GENDER",
            "PRICE PER KG (RS/KG)",
            "WEIGHT BUCKET (LB)",
            "FLAVOUR BASE",
            "PROTEIN PER SERVING BUCKET (G)",
            "VEGETARIAN/NON-VEGETARIAN",
            "OFFERS",
            "STOCK AVAILABILITY",
          ].map((item) => (
            <div key={item} className="filter-item">
              {item} <span>›</span>
            </div>
          ))}

          <div className="price-range-section">
            <label>PRICE</label>
            <p>₹619 - ₹15.4k</p>
            <div className="range-slider-mock">
              <div className="slider-handle handle-left" />
              <div className="slider-handle handle-right" />
            </div>
          </div>
        </aside>

        {/* ================= RIGHT CONTENT ================= */}
        <main className="category-content">
          <div className="category-header">
            <div>
              <h1>{category.name}</h1>
              <p className="header-description">
                {category.description} <span>Read More...</span>
              </p>
            </div>

            <div className="rating-box">
              <div className="rating-value">4.5 ★</div>
              <div className="rating-label">25793 Global Rating</div>
            </div>
          </div>

          <div className="divider" />

          <h2 className="available-count">
            {filteredProducts.length} PRODUCTS AVAILABLE
          </h2>

          {/* 🔥 MUSCLEBLAZE PRODUCT CONTAINER */}
          <div className="products-wrapper">
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  ref={(el) => (productRefs.current[product.id] = el)}
                  className="product-card-container"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default CategoryPage;
