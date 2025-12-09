import React from 'react';

interface RecipeCardProps {
    title: string;
    image: string;
    rating: number;
    time: string;
    description: string;
    onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    title,
    image,
    rating,
    time,
    description,
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
                <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">{description}</p>
                <button className="w-full py-2 bg-slate-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm">
                    View Recipe
                </button>
            </div>
        </div>
    );
};
