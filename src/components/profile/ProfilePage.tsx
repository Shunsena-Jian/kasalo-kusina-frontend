import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { authService, User } from '../../services/authService';

interface ProfilePageProps {
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

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateToHome }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (err) {
                console.error("Failed to fetch user profile", err);
                setError("Failed to load profile. Please try refreshing.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button
                    onClick={onNavigateToHome}
                    className="text-primary hover:underline font-bold"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    if (!user) return null;

    return (
        <motion.div
            className="max-w-2xl mx-auto p-8 glass rounded-3xl shadow-lg border border-white/40"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="flex items-center gap-6 mb-8" variants={itemVariants}>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user.first_name[0]}{user.last_name[0]}
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800">
                        {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">@{user.username}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wide">
                        {user.user_type.replace('_', ' ')}
                    </span>
                </div>
            </motion.div>

            <motion.div className="space-y-6" variants={itemVariants}>
                <div className="bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">Account Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Email</p>
                            <p className="text-slate-800 font-medium break-all">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                            <p className="text-slate-800 font-medium capitalize flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${user.user_status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                {user.user_status}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Member Since</p>
                            <p className="text-slate-800 font-medium">
                                {new Date(Number(user.created_at) * 1000).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">User ID</p>
                            <p className="text-slate-500 text-xs font-mono break-all">{user.id}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={onNavigateToHome}
                        className="px-6 py-2 rounded-full font-bold text-slate-600 hover:bg-white/50 transition-colors"
                    >
                        Back to Home
                    </button>
                    <button className="px-6 py-2 rounded-full font-bold text-white bg-secondary hover:bg-secondary-dark shadow-md transition-colors ml-4">
                        Edit Profile
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
