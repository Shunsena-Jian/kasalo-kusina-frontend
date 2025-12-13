import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { recipeService } from '../../services/recipeService';
import { APIRecipe } from '../../types';
import { RecipeCard } from '../home/RecipeCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface SearchResultsPageProps {
    query: string;
    onNavigateToHome: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, onNavigateToHome }) => {
    const [recipes, setRecipes] = useState<APIRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await recipeService.searchRecipes(query);
                setRecipes(response.data);
            } catch (err) {
                console.error("Failed to search recipes", err);
                setError("Failed to fetch search results. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const formatTime = (prep: number, cook: number) => {
        const total = prep + cook;
        if (total >= 60) {
            const hours = Math.floor(total / 60);
            const mins = total % 60;
            return `${hours} hr${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`;
        }
        return `${total} min`;
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return 'https://placehold.co/600x400?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;

        const apiUrl = import.meta.env.VITE_API_URL || '';
        const baseUrl = apiUrl.replace(/\/api\/?$/, '');
        return `${baseUrl}${imagePath}`;
    };

    return (
        <motion.div
            className="w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="mb-8">
                <button
                    onClick={onNavigateToHome}
                    className="text-slate-500 hover:text-primary font-bold mb-4 flex items-center gap-2 transition-colors"
                >
                    ← Back to Home
                </button>
                <h2 className="text-3xl font-extrabold text-slate-800">
                    Search Results for <span className="text-primary">"{query}"</span>
                </h2>
                <p className="text-slate-500 mt-2">
                    Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-red-600 font-bold">{error}</p>
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl border border-white/50">
                    <span className="text-6xl mb-4 block">🍳</span>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">No recipes found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        We couldn't find any recipes matching "{query}". Try different keywords or browse our categories.
                    </p>
                    <button
                        onClick={onNavigateToHome}
                        className="mt-6 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-primary-dark transition-all"
                    >
                        Browse All Recipes
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={recipe._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <RecipeCard
                                title={recipe.title}
                                image={getImageUrl(recipe.image)}
                                rating={recipe.average_rating}
                                time={formatTime(recipe.prep_time_min, recipe.cook_time_min)}
                                description={recipe.description}
                                onClick={() => { }}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
