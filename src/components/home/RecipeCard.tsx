import React from 'react';
import { Button } from '../common/Button';

interface RecipeCardProps {
    title: string;
    image: string;
    rating: number;
    time: string;
    difficulty: string;
    categories: string[];
    onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    title,
    image,
    rating,
    time,
    difficulty,
    categories = [],
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-slate-100 flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                    {time}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{title}</h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold text-slate-700">{rating}</span>
                    </div>
                </div>

                <div className="flex-grow space-y-3 mb-4">
                    <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold capitalize ${difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            difficulty === 'medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {difficulty}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {categories.map((cat, index) => (
                            <span key={index} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
                <Button fullWidth className="text-sm">
                    View Recipe
                </Button>
            </div>
        </div>
    );
};
