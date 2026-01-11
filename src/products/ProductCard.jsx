import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext.jsx";

const defaultProductImage =
  "https://via.placeholder.com/200x200?text=Add+Image";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const {
    id,
    name,
    weight,
    flavors,
    price,
    mrp,          // OPTIONAL (for % off)
    image,
    category
  } = product;

  const [displayImage, setDisplayImage] = useState(defaultProductImage);

  useEffect(() => {
    const savedImages = localStorage.getItem("productImages");
    if (savedImages) {
      const images = JSON.parse(savedImages);
      if (images[id]) {
        setDisplayImage(images[id]);
        return;
      }
    }

    setDisplayImage(image && image.trim() !== "" ? image : defaultProductImage);
  }, [id, image]);

  const handleProductClick = () => {
    navigate(`/product/${id}`, { state: { product } });
  };

  const discount =
    mrp && price ? Math.round(((mrp - price) / mrp) * 100) : null;

  return (
    <div className="mb-product-card">
      {/* LEFT IMAGE */}
      <div
        className="mb-product-image"
        onClick={handleProductClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src={displayImage}
          alt={name}
          onError={(e) => (e.target.src = defaultProductImage)}
        />

        {category && (
          <span className="mb-category-tag">{category}</span>
        )}
      </div>

      {/* RIGHT INFO */}
      <div className="mb-product-content">
        <h3
          className="mb-product-name"
          onClick={handleProductClick}
          style={{ cursor: "pointer" }}
        >
          {name}
        </h3>

        <div className="mb-meta">
          <div>{weight}</div>
          <div className="mb-flavor">
            {flavors.length > 40
              ? flavors.substring(0, 40) + "..."
              : flavors}
          </div>
        </div>

        {/* PRICE */}
        <div className="mb-price-row">
          <span className="mb-price">₹{price.toLocaleString()}</span>

          {mrp && (
            <>
              <span className="mb-mrp">₹{mrp.toLocaleString()}</span>
              <span className="mb-discount">{discount}% off</span>
            </>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mb-actions">
          <button
            className="mb-add-cart"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </button>

          <button
            className="mb-buy-now"
            onClick={() => {
              addToCart(product);
              navigate("/cart");
            }}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
