"use client";

import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ScrollButtons = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    // Show "scroll to top" after scrolling down some
    setShowTop(scrollY > 200);

    // Show "scroll to bottom" unless you're very close to bottom
    setShowBottom(scrollY + innerHeight < scrollHeight - 200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Call initially, in case the page is not at the top/bottom
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-20 flex flex-col gap-2 z-50">
      {showBottom && (
        <button
          onClick={scrollToBottom}
          className="p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
        >
          <FaArrowDown />
        </button>
      )}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default ScrollButtons;
