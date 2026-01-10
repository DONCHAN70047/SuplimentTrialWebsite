import { useState } from "react";

export default function ProductImageSlider({ images }) {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full text-center">
      {/* Main Image */}
      <img
        src={images[index]}
        alt="product"
        className="mx-auto h-64 object-contain"
      />

      {/* Thumbnails */}
      <div className="flex justify-center gap-2 mt-3 overflow-x-auto">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setIndex(i)}
            className={`h-14 cursor-pointer border rounded ${
              index === i ? "border-orange-500" : "border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="flex justify-between mt-2 px-10">
        <button onClick={prev}>⬅</button>
        <button onClick={next}>➡</button>
      </div>
    </div>
  );
}
