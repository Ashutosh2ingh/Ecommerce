"use client";
import { useState, useEffect } from "react";

interface CategoryData {
    id: number;
    category_name: string;
}

interface FilterProps {
    onCategoryChange: (categoryId: number | null, categoryName: string) => void;
    onTypeChange: (type: "new" | "featured" | null) => void;
}

const Filter: React.FC<FilterProps> = ({ onCategoryChange, onTypeChange }) => {

    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                let response = await fetch("http://127.0.0.1:8000/category/");
                let data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value ? Number(e.target.value) : null;
        const categoryName = e.target.selectedOptions[0].textContent || 'Products';
        onCategoryChange(categoryId, categoryName);
    };

    const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value === "new" || e.target.value === "featured"
            ? e.target.value
            : null;
        onTypeChange(selectedType);
    };

    return (
        <div className="mt-12 flex justify-between">
            <div className="flex gap-6 flex-wrap">

                {/* Type */}
                <select
                    name="type"
                    id=""
                    className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
                    onChange={handleTypeSelect}
                >
                    <option>All</option>
                    <option value="new">New</option>
                    <option value="featured">Featured</option>
                </select>

                {/* Category */}
                <select name="category" id="" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]" onChange={handleCategorySelect}>
                    <option value="">All</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Filter;