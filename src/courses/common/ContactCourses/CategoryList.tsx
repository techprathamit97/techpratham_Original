"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  name: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/fetch");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-[#212529] py-6 px-4">
      <h2 className="text-xl text-white font-semibold mb-4">Trending Courses</h2>

      <div className="flex flex-wrap gap-3 text-sm text-white">
        {categories.map((cat, index) => (
          <React.Fragment key={cat.name}>
            <Link
              href={`/courses/domain/${encodeURIComponent(cat.name)}`}
              className="hover:text-red-600 transition-colors"
            >
              {cat.name}
            </Link>

            {index !== categories.length - 1 && <span>|</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}