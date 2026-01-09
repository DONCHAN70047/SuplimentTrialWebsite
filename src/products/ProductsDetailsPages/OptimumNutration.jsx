import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getAllProducts } from "../productsData";
import "../ProductsDetailsPagesCss/AllProductsDetailsPages.css";

const defaultImage = "https://via.placeholder.com/400";

const OptimumNutration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const suggestedScrollRef = useRef(null);

  const [allProducts, setAllProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [suggestiveProducts, setSuggestiveProducts] = useState([]);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [isVariantOpen, setIsVariantOpen] = useState(false);

  useEffect(() => {
    setAllProducts(getAllProducts());
  }, []);

  useEffect(() => {
    if (!allProducts.length) return;

    const product = allProducts.find(p => p.id === Number(id));
    if (!product) return;

    setCurrentProduct(product);
    setSelectedFlavor(product.flavors);
    setSelectedWeight(product.weight);
    setActiveImageIndex(0);

    // Generate 4 images for gallery (using main image + placeholder variations)
    const mainImg = product.image || defaultImage;
    setProductImages([
      mainImg,
      mainImg,
      mainImg,
      mainImg
    ]);

    const filtered = allProducts.filter(p => p.id !== product.id);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setSuggestiveProducts(shuffled.slice(0, 8));
  }, [id, allProducts]);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (productImages.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % productImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [productImages]);

  const scrollSuggested = (direction) => {
    if (suggestedScrollRef.current) {
      const scrollAmount = 280;
      suggestedScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!currentProduct) {
    return <h2 className="not-found">Product not found</h2>;
  }

  const relatedProducts = allProducts.filter(
    p => p.name === currentProduct.name
  );

  const weightOptions = [...new Set(relatedProducts.map(p => p.weight))];

  const flavorOptions = [
    ...new Set(
      relatedProducts
        .filter(p => p.weight === selectedWeight)
        .map(p => p.flavors)
    ),
  ];

  const finalProduct = {
    ...currentProduct,
    selectedFlavor,
    selectedWeight,
  };

  const handleAddToCart = (product, goToCart = false) => {
    addToCart(product);
    setShowFloatingCart(true);

    if (goToCart) {
      setTimeout(() => navigate("/cart"), 300);
    }
  };

  const handleFlavorClick = (flavor) => {
    setSelectedFlavor(flavor);

    const matched = relatedProducts.find(
      p => p.flavors === flavor && p.weight === selectedWeight
    );

    if (matched) {
      navigate(`/product/${matched.id}`);
    }
  };

  const handleWeightClick = (weight) => {
    setSelectedWeight(weight);

    const matched = relatedProducts.find(
      p => p.weight === weight && p.flavors === selectedFlavor
    );

    if (matched) {
      navigate(`/product/${matched.id}`);
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Image Gallery Section */}
        <div className="image-gallery">
          <div className="main-image-box">
            <img
              src={productImages[activeImageIndex] || defaultImage}
              alt={currentProduct.name}
              className="main-product-image"
            />
          </div>
          
          {/* Thumbnail Scroll */}
          <div className="thumbnail-container">
            <div className="thumbnail-scroll">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail-item ${activeImageIndex === index ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img src={img} alt={`${currentProduct.name} ${index + 1}`} />
                </div>
              ))}
            </div>
            {/* Image Indicator Dots */}
            <div className="image-indicators">
              {productImages.map((_, index) => (
                <span
                  key={index}
                  className={`indicator-dot ${activeImageIndex === index ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="product-details">
          <h1>{currentProduct.name}</h1>
          <p className="sub-text">{selectedFlavor} • {selectedWeight}</p>

          {/* Rating */}
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">4.5 ★ 12.8k</span>
          </div>

          {/* Price Box */}
          <div className="price-box">
            <span className="sell-price">₹{currentProduct.price}</span>
            <span className="original-price">₹{Math.round(currentProduct.price * 1.15)}</span>
            <span className="profit">15% off</span>
            <p className="tax-info">Inclusive all Taxes</p>
          </div>

          {/* Choose Flavour and Weight Accordion */}
          <div className="variant-accordion">
            <div 
              className="variant-header"
              onClick={() => setIsVariantOpen(!isVariantOpen)}
            >
              <span className="variant-title">
                Choose Flavour and Weight : <strong>{selectedFlavor}, {selectedWeight}</strong>
              </span>
              <span className={`variant-arrow ${isVariantOpen ? 'open' : ''}`}>
                {isVariantOpen ? '∧' : '∨'}
              </span>
            </div>

            {isVariantOpen && (
              <div className="variant-content">
                {/* FLAVOUR */}
                {flavorOptions.length > 0 && (
                  <div className="variant-group">
                    <h4>Flavour</h4>
                    <div className="variant-options">
                      {flavorOptions.map(f => (
                        <button
                          key={f}
                          className={`variant-btn ${selectedFlavor === f ? 'active' : ''}`}
                          onClick={() => handleFlavorClick(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* WEIGHT */}
                {weightOptions.length > 0 && (
                  <div className="variant-group">
                    <h4>Weight</h4>
                    <div className="variant-options">
                      {weightOptions.map(w => {
                        const matchedProduct = relatedProducts.find(
                          p => p.weight === w && p.flavors === selectedFlavor
                        );
                        const price = matchedProduct ? matchedProduct.price : '-';
                        return (
                          <button
                            key={w}
                            className={`variant-btn weight-btn ${selectedWeight === w ? 'active' : ''}`}
                            onClick={() => handleWeightClick(w)}
                          >
                            <span className="weight-label">{w}</span>
                            <span className="weight-price">{price !== '-' ? `₹${price}` : '-'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="variant-btn-group">
              <button
                className="variant-cart-btn"
                onClick={() => handleAddToCart(finalProduct)}
              >
                GO TO CART <span className="arrow-icon">›</span>
              </button>

              <button
                className="variant-buy-btn"
                onClick={() => handleAddToCart(finalProduct, true)}
              >
                BUY NOW
              </button>
            </div>

            {/* Offers & Benefits Section */}
            <div className="offers-section" style={{marginTop: '18px', marginBottom: '8px'}}>
              <div style={{border: '1px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: '#fafbfc'}}>
                <div style={{display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '1rem'}}>
                  <span style={{marginRight: '8px'}}>🎟️</span> Offers & Benefits <span style={{marginLeft: '8px', fontWeight: 400, fontSize: '0.95rem'}}>(Avail the offers on cart)</span>
                </div>
              </div>
              <div style={{border: '1px solid #e0e0e0', borderRadius: '8px', padding: '12px', background: '#fafbfc', marginTop: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '1rem'}}>
                  <span style={{marginRight: '8px'}}>🏷️</span> Special Offers for you <span style={{marginLeft: '8px', fontWeight: 400, fontSize: '0.95rem'}}>(Avail the offers on cart)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product-description-section">

  {/* Tabs */}
  <div className="product-description-tabs">
    <button className="product-description-tab active">Description</button>
    <button className="product-description-tab">Key Benefits</button>
    <button className="product-description-tab">Nutritional Information</button>
  </div>

  {/* Content */}
  <div className="product-description-content">

    <h3 className="product-description-heading">
      THOSE WHO CHASE EXTREME CHOOSE BLACK
    </h3>

    <p className="product-description-text">
      Those who embrace the grind of bodybuilding everyday know that they need to crush one goal after another and keep going till the next one is reached.
    </p>

    <p className="product-description-text">
      MB Super Gainer 'Black' is engineered to deliver mighty gains to those individuals who go above and beyond in their relentless pursuit of bigger muscles.
    </p>

    <h4 className="product-description-subheading">DIGESTION BLEND</h4>
    <ul className="product-description-list">
      <li className="product-description-item">
        Prebiotic & Probiotics – Promote healthy gut flora
      </li>
      <li className="product-description-item">
        Digestive Enzymes – Improves nutrient absorption
      </li>
    </ul>

    <h4 className="product-description-subheading">TESTO BLEND</h4>
    <ul className="product-description-list">
      <li className="product-description-item">Ashwagandha – Improves testosterone levels</li>
      <li className="product-description-item">Tribulus Terrestris – Boosts muscle growth</li>
      <li className="product-description-item">Fenugreek Extract – Increases strength</li>
    </ul>

    <h4 className="product-description-subheading">APPETITE BLEND</h4>
    <ul className="product-description-list">
      <li className="product-description-item">Fennel & Jeera Extract – Stimulates appetite</li>
      <li className="product-description-item">Black Pepper Extract – Improves digestion</li>
    </ul>

  </div>
</div>

{/* 
      Picture Text above Suggestions
      <div className="picture-text-section" style={{textAlign: 'center', margin: '32px 0 8px 0', fontWeight: 500, fontSize: '1.15rem'}}>
        <span>See product images and details above. Explore more options below!</span>
      </div> */}

      {/* Horizontal Scrolling Suggested Products */}
      <div className="suggested-section">
        <h2>You might also like</h2>
        <div className="suggested-scroll-wrapper">
          <button 
            className="scroll-arrow left-arrow" 
            onClick={() => scrollSuggested('left')}
          >
            ❮
          </button>
          
          <div className="suggested-scroll" ref={suggestedScrollRef}>
            {suggestiveProducts.map(p => (
              <div
                key={p.id}
                className="suggested-card"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="suggested-img-box">
                  <img src={p.image || defaultImage} alt={p.name} />
                </div>
                <div className="suggested-info">
                  <div className="suggested-title">{p.name}</div>
                  <div className="suggested-weight">{p.weight} {p.flavors}</div>
                  <div className="suggested-price-row">
                    <span className="suggested-price">₹{p.price}</span>
                    <span className="suggested-original">₹{Math.round(p.price * 1.15)}</span>
                    <span className="suggested-discount">15% off</span>
                  </div>
                  <button
                    className="suggested-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                  >
                    ADD TO CART
                  </button>
                  <button
                    className="suggested-buy-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p, true);
                    }}
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="scroll-arrow right-arrow" 
            onClick={() => scrollSuggested('right')}
          >
            ❯
          </button>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="additional-info-section">
        <h2>Additional Information</h2>
        
        <div className="info-block">
          <h4>Seller Information:</h4>
          <p><strong>Sold By:</strong></p>
          <p className="highlight-text">Bright Nutricare Private Limited.</p>
          <p>Wing A, B and C, 1st Floor, Tower B, The Presidency Tower, Opp. Govt. Girls College, Sector 14, MG Road, Gurugram 122001, Haryana</p>
        </div>

        <div className="info-block">
          <h4>Marketed By:</h4>
          <p>BRIGHT LIFECARE PVT. LTD. Wing C, 2nd Floor, Tower-B, The Presidency, Anamika Enclave, Sector-14, Mehrauli Gurgaon Road, Opposite Govt. Girls College, Gurugram, Haryana-122001, Gurgaon, Gurugram Haryana-122001</p>
        </div>

        <div className="info-block">
          <h4>Manufactured By:</h4>
          <p>Sapiens Labs, Village Dhana Bagbania, P.O. Manpura, Tehsil Nalagarh, Solan (Himachal Pradesh), 174101, Email: care@healthkart.com</p>
        </div>

        <div className="info-block">
          <h4>Customer Care Details:</h4>
          <p><strong>Customer care no:</strong> +91 85 277 32 632</p>
          <p><strong>Email:</strong> <a href="mailto:info@Muscleblaze.com" className="info-link">info@Muscleblaze.com</a></p>
        </div>

        <div className="info-block">
          <h4>Grievance Officer:</h4>
          <p><strong>Name:</strong> Brahm Rishi Sharma</p>
          <p><strong>Designation:</strong> General Manager - Customer Service</p>
          <p><strong>Contact:</strong> +91 8527 732632</p>
          <p><strong>Email Id:</strong> <a href="mailto:grievance.redressal@brightlifecare.com" className="info-link">grievance.redressal@brightlifecare.com</a></p>
        </div>

        <div className="info-block fssai-block">
          <p className="fssai-logo">fssai</p>
          <p><strong>License No.</strong> 10015064000576</p>
        </div>
      </div>

      {showFloatingCart && (
        <div className="floating-cart" onClick={() => navigate("/cart")}>
          🛒
          {cartItems.length > 0 && (
            <span className="cart-count">{cartItems.length}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimumNutration;
