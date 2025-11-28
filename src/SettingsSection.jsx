import React from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, AlertTriangle } from 'lucide-react';

const SettingsSection = ({ onExport, onReset, addToast }) => {
    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 max-w-2xl mx-auto"
        >
            <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>

            <div className="space-y-6">
                {/* Appearance */}
                <div className="p-6 bg-navy-800/50 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white">Appearance</h3>
                        <p className="text-sm text-slate-400">Customize the look and feel</p>
                    </div>
                    <div className="flex bg-navy-900 p-1 rounded-lg border border-white/5">
                        <button className="px-4 py-1.5 bg-electric-blue text-white rounded-md text-sm font-medium shadow-lg">Dark</button>
                        <button className="px-4 py-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors">Light</button>
                    </div>
                </div>

                {/* Sort Preference */}
                <div className="p-6 bg-navy-800/50 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white">Sort Preference</h3>
                        <p className="text-sm text-slate-400">Default sorting for search results</p>
                    </div>
                    <select className="bg-navy-900 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-electric-blue">
                        <option>Cheapest First</option>
                        <option>Healthiest First</option>
                    </select>
                </div>

                {/* Data Management */}
                <div className="p-6 bg-navy-800/50 border border-white/5 rounded-2xl">
                    <h3 className="font-medium text-white mb-4">Data Management</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-white font-medium">Export Data</div>
                                <p className="text-xs text-slate-400">Download a backup of your pantry and shopping list.</p>
                            </div>
                            <button
                                onClick={onExport}
                                className="flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-electric-blue border border-electric-blue/30 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Export JSON
                            </button>
                        </div>

                        <div className="h-px bg-white/5" />

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-red-400 font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Factory Reset
                                </div>
                                <p className="text-xs text-slate-400">Permanently delete all data and reset app.</p>
                            </div>
                            <button
                                onClick={onReset}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Reset App
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => addToast('Preferences saved successfully', 'success')}
                        className="px-6 py-2 bg-electric-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-electric-blue/20"
                    >
                        Save Preferences
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsSection;
