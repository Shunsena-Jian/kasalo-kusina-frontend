import React, { useEffect, useState } from 'react';
import { RecipeCard } from './RecipeCard';
import { FadeScroll } from '../common/FadeScroll';
import { recipeService } from '@/services/recipeService.ts';
import { APIRecipe } from '@/types.ts';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';

interface HomePageProps {
    onAnalyzeClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAnalyzeClick }) => {
    const [featuredRecipes, setFeaturedRecipes] = useState<APIRecipe[]>([]);
    const [newRecipes, setNewRecipes] = useState<APIRecipe[]>([]);
    const [highRatedRecipes, setHighRatedRecipes] = useState<APIRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featured, newArrivals, highRated] = await Promise.all([
                    recipeService.getFeaturedRecipes(),
                    recipeService.getNewRecipes(),
                    recipeService.getHighRatedRecipes(),
                ]);

                setFeaturedRecipes(featured.data);
                setNewRecipes(newArrivals.data);
                setHighRatedRecipes(highRated.data);
            } catch (err) {
                console.error('Error fetching recipes:', err);
                setError('Failed to load recipes. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl m-4">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                <img
                    src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1200"
                    alt="Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8 md:p-12">
                    <div className="text-white max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-relaxed">
                            Discover the Taste of <br />
                            <span className="text-primary bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm inline-block mt-2">Filipino Cuisine</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 mb-8 font-medium">
                            Join our community to explore, share, and enjoy authentic recipes from across the islands.
                        </p>
                        <Button
                            onClick={onAnalyzeClick}
                            className="px-8 py-3 text-lg hover:shadow-primary/50 transform hover:-translate-y-1"
                        >
                            Identify a Dish
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Recipes */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Featured Recipes</h2>
                        <p className="text-slate-500 mt-1">Curated favorites just for you</p>
                    </div>
                    <button className="text-primary font-semibold hover:text-red-500 transition-colors">
                        View All
                    </button>
                </div>
                <FadeScroll className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {featuredRecipes.map((recipe, index) => (
                        <div key={index} className="min-w-[85%] sm:min-w-[320px] snap-center">
                            <RecipeCard
                                title={recipe.title}
                                image={getImageUrl(recipe.image)}
                                rating={recipe.average_rating}
                                time={formatTime(recipe.prep_time_min, recipe.cook_time_min)}
                                description={recipe.description}
                                onClick={() => { }}
                            />
                        </div>
                    ))}
                </FadeScroll>
            </section>

            {/* New Arrivals */}
            <section>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Fresh from the Kitchen</h2>
                <FadeScroll className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {newRecipes.map((recipe, index) => (
                        <div key={index} className="min-w-[85%] sm:min-w-[320px] snap-center">
                            <RecipeCard
                                title={recipe.title}
                                image={getImageUrl(recipe.image)}
                                rating={recipe.average_rating}
                                time={formatTime(recipe.prep_time_min, recipe.cook_time_min)}
                                description={recipe.description}
                                onClick={() => { }}
                            />
                        </div>
                    ))}
                </FadeScroll>
            </section>

            {/* High Rated */}
            <section>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Community Favorites</h2>
                <FadeScroll className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {highRatedRecipes.map((recipe, index) => (
                        <div key={index} className="min-w-[85%] sm:min-w-[320px] snap-center">
                            <RecipeCard
                                title={recipe.title}
                                image={getImageUrl(recipe.image)}
                                rating={recipe.average_rating}
                                time={formatTime(recipe.prep_time_min, recipe.cook_time_min)}
                                description={recipe.description}
                                onClick={() => { }}
                            />
                        </div>
                    ))}
                </FadeScroll>
            </section>
        </div>
    );
};
