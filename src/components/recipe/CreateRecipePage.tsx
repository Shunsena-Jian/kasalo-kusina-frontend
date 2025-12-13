import React, { useState, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { recipeService } from '../../services/recipeService';
import { categoryService } from '../../services/categoryService';
import { tagService } from '../../services/tagService';
import { Ingredient, Instruction, Category, Tag } from '../../types';

interface CreateRecipePageProps {
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

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
};

export const CreateRecipePage: React.FC<CreateRecipePageProps> = ({ onNavigateToHome }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prepTime, setPrepTime] = useState<number | ''>('');
    const [cookTime, setCookTime] = useState<number | ''>('');
    const [servings, setServings] = useState<number | ''>('');
    const [difficulty, setDifficulty] = useState('easy');
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '', unit: '' }]);
    const [instructions, setInstructions] = useState<Instruction[]>([{ step: 1, text: '' }]);
    const [tags, setTags] = useState('');

    // Category State
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [selectedCategoryValue, setSelectedCategoryValue] = useState('');

    // Tag State
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<(Tag | string)[]>([]); // Can be Tag object or string for new tags
    const [tagInput, setTagInput] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const savedDraft = localStorage.getItem('createRecipeDraft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setTitle(draft.title || '');
                setDescription(draft.description || '');
                setPrepTime(draft.prepTime ?? '');
                setCookTime(draft.cookTime ?? '');
                setServings(draft.servings ?? '');
                setDifficulty(draft.difficulty || 'easy');
                setIngredients(draft.ingredients || [{ name: '', quantity: '', unit: '' }]);
                setInstructions(draft.instructions || [{ step: 1, text: '' }]);
                setTags(draft.tags || '');
                if (draft.selectedCategories) {
                    setSelectedCategories(draft.selectedCategories);
                }
                if (draft.importedImage) {
                    setPreviewImage(draft.importedImage);
                    // Convert Blob URL to File object
                    try {
                        fetch(draft.importedImage)
                            .then(res => res.blob())
                            .then(blob => {
                                const file = new File([blob], "imported_image.jpg", { type: blob.type });
                                setImage(file);
                            });
                    } catch (err) {
                        console.error("Failed to convert imported image to File", err);
                    }
                }
            } catch (e) {
                console.error("Failed to parse recipe draft", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (!isLoaded) return;

        const draft = {
            title,
            description,
            prepTime,
            cookTime,
            servings,
            difficulty,
            ingredients,
            instructions,
            tags,
            selectedCategories
        };
        localStorage.setItem('createRecipeDraft', JSON.stringify(draft));
    }, [title, description, prepTime, cookTime, servings, difficulty, ingredients, instructions, tags, selectedCategories, isLoaded]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categories, tagsData] = await Promise.all([
                    categoryService.getCategories(),
                    tagService.getTags()
                ]);
                setAvailableCategories(categories);
                setAvailableTags(tagsData);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, []);

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleInstructionChange = (index: number, value: string) => {
        const newInstructions = [...instructions];
        newInstructions[index] = { ...newInstructions[index], text: value };
        setInstructions(newInstructions);
    };

    const addInstruction = () => {
        setInstructions([...instructions, { step: instructions.length + 1, text: '' }]);
    };

    const removeInstruction = (index: number) => {
        const newInstructions = instructions.filter((_, i) => i !== index);
        // Re-index steps
        const reindexed = newInstructions.map((inst, i) => ({ ...inst, step: i + 1 }));
        setInstructions(reindexed);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Tag Handlers
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = tagInput.trim();
            if (!val) return;

            // Check if it matches an existing tag (case insensitive)
            const existingTag = availableTags.find(t => t.name.toLowerCase() === val.toLowerCase());

            const newTag = existingTag || val;

            // Avoid duplicates
            const isDuplicate = selectedTags.some(t => {
                const tName = typeof t === 'string' ? t : t.name;
                return tName.toLowerCase() === val.toLowerCase();
            });

            if (!isDuplicate) {
                setSelectedTags([...selectedTags, newTag]);
            }
            setTagInput('');
        }
    };

    const handleSelectTag = (tagId: string) => {
        const tagToAdd = availableTags.find(t => t._id === tagId);
        if (tagToAdd && !selectedTags.some(t => (typeof t === 'string' ? t === tagToAdd.name : t._id === tagId))) {
            setSelectedTags([...selectedTags, tagToAdd]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (index: number) => {
        setSelectedTags(selectedTags.filter((_, i) => i !== index));
    };

    const handleAddCategory = (categoryId: string) => {
        const categoryToAdd = availableCategories.find(c => c._id === categoryId);
        if (categoryToAdd && !selectedCategories.some(c => c._id === categoryId)) {
            setSelectedCategories([...selectedCategories, categoryToAdd]);
        }
        setSelectedCategoryValue(''); // Reset select
    };

    const handleRemoveCategory = (categoryId: string) => {
        setSelectedCategories(selectedCategories.filter(c => c._id !== categoryId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('prep_time_min', String(prepTime));
            formData.append('cook_time_min', String(cookTime));
            formData.append('servings', String(servings));
            formData.append('difficulty', difficulty);

            // Clean up ingredients and instructions before sending
            // Filter out empty ones if necessary, currently sending as is but stringified
            formData.append('ingredients', JSON.stringify(ingredients));
            formData.append('instructions', JSON.stringify(instructions));

            if (image) {
                formData.append('image', image);
            }

            // Process tags and categories
            // const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
            const categoryIds = selectedCategories.map(c => c._id);

            // Process selected tags: send name/string as is (trimmed), let backend handle slugification
            const tagArray = selectedTags.map(t => {
                const val = typeof t === 'string' ? t : t.name;
                return val.trim();
            });

            formData.append('tags', JSON.stringify(tagArray));
            formData.append('categories', JSON.stringify(categoryIds));

            await recipeService.createRecipe(formData);

            // Clear draft
            localStorage.removeItem('createRecipeDraft');

            onNavigateToHome();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to create recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="max-w-3xl mx-auto p-6 glass rounded-3xl shadow-lg border border-white/40"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2
                className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6"
                variants={itemVariants}
            >
                Create New Recipe
            </motion.h2>

            {error && (
                <motion.div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                    variants={itemVariants}
                >
                    <span className="block sm:inline">{error}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div className="col-span-2">
                        <Input
                            type="text"
                            required
                            label="Recipe Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <TextArea
                            required
                            rows={3}
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <Input
                            type="number"
                            required
                            min="0"
                            label="Prep Time (min)"
                            value={prepTime}
                            onChange={(e) => setPrepTime(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <Input
                            type="number"
                            required
                            min="0"
                            label="Cook Time (min)"
                            value={cookTime}
                            onChange={(e) => setCookTime(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <Input
                            type="number"
                            required
                            min="1"
                            label="Servings"
                            value={servings}
                            onChange={(e) => setServings(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <Select
                            label="Difficulty"
                            value={difficulty}
                            onChange={(val) => setDifficulty(val)}
                            options={[
                                { label: 'Easy', value: 'easy' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'Hard', value: 'hard' },
                            ]}
                        />
                    </div>
                </motion.div>

                {/* Ingredients */}
                <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-slate-700 dark:text-slate-200 font-bold">Ingredients</label>
                        <button type="button" onClick={addIngredient} className="text-primary hover:text-primary-dark font-bold text-sm">+ Add Ingredient</button>
                    </div>
                    <div className="space-y-2">
                        {ingredients.map((ing, index) => (
                            <motion.div
                                key={index}
                                className="flex gap-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    required
                                    containerClassName="flex-grow"
                                    className="py-2 text-sm"
                                    value={ing.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="Qty"
                                    required
                                    containerClassName="!w-20 flex-none"
                                    className="py-2 text-sm text-center"
                                    value={ing.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                />
                                <Input
                                    type="text"
                                    placeholder="Unit"
                                    containerClassName="!w-28 flex-none"
                                    className="py-2 text-sm"
                                    value={ing.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                />
                                {ingredients.length > 1 && (
                                    <button type="button" onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700 font-bold px-2">×</button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Instructions */}
                <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-slate-700 dark:text-slate-200 font-bold">Instructions</label>
                        <button type="button" onClick={addInstruction} className="text-primary hover:text-primary-dark font-bold text-sm">+ Add Step</button>
                    </div>
                    <div className="space-y-2">
                        {instructions.map((inst, index) => (
                            <motion.div
                                key={index}
                                className="flex gap-2 items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="mt-3 font-bold text-slate-500 dark:text-slate-400 text-sm w-6">{inst.step}.</span>
                                <TextArea
                                    required
                                    rows={2}
                                    placeholder="Describe this step..."
                                    containerClassName="flex-grow"
                                    className="py-2 text-sm"
                                    value={inst.text}
                                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                                />
                                {instructions.length > 1 && (
                                    <button type="button" onClick={() => removeInstruction(index)} className="text-red-500 hover:text-red-700 font-bold px-2 mt-3">×</button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Image */}
                <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 ml-1">Recipe Image</label>
                    {previewImage && (
                        <div className="mb-4 relative w-full h-64 rounded-xl overflow-hidden shadow-md group">
                            <img
                                src={previewImage}
                                alt="Recipe Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setPreviewImage(null);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                                >
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-inner placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark font-medium dark:text-slate-200"
                        onChange={handleImageChange}
                    />
                </motion.div>

                {/* Tags & Categories */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Type tag & press Enter"
                                label="Tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                autoComplete="off" // Prevent browser autocomplete blocking our custom one
                            />
                            {/* Simple suggestion dropdown if input matches existing tags */}
                            {tagInput && availableTags.some(t => t.name.toLowerCase().includes(tagInput.toLowerCase())) && (
                                <ul className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg mt-1 max-h-40 overflow-auto">
                                    {availableTags
                                        .filter(t => t.name.toLowerCase().includes(tagInput.toLowerCase()))
                                        .map(t => (
                                            <li
                                                key={t._id}
                                                onClick={() => handleSelectTag(t._id)}
                                                className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm text-slate-700 dark:text-slate-200"
                                            >
                                                {t.name}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                                >
                                    {typeof tag === 'string' ? tag : tag.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(index)}
                                        className="hover:text-secondary-dark focus:outline-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Select
                            label="Categories"
                            placeholder="Select a category"
                            value={selectedCategoryValue}
                            onChange={handleAddCategory}
                            options={availableCategories.map(cat => ({
                                label: cat.name,
                                value: cat._id
                            }))}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedCategories.map(cat => (
                                <span
                                    key={cat._id}
                                    className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                                >
                                    {cat.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCategory(cat._id)}
                                        className="hover:text-primary-dark focus:outline-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div className="pt-4 flex justify-end gap-4" variants={itemVariants}>
                    <button
                        type="button"
                        onClick={onNavigateToHome}
                        className="px-6 py-2 rounded-full font-bold text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 text-white font-bold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Recipe'}
                    </Button>
                </motion.div>
            </form>
        </motion.div>
    );
};
