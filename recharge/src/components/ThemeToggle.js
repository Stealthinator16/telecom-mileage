// src/components/ThemeToggle.js
"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        setIsMounted(true);
        const savedTheme = (typeof window !== 'undefined' && window.localStorage)
            ? localStorage.getItem('theme') || 'light'
            : 'light';
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        if (isMounted) {
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('theme', theme);
            }
        }
    }, [theme, isMounted]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    if (!isMounted) {
        return null; 
    }

    return (
        <div className="dark-mode-switcher">
            {/* The <span> with the word "Theme" is now gone. */}
            <label className="switch">
                <input
                    type="checkbox"
                    onChange={toggleTheme}
                    checked={theme === 'dark'}
                />
                <span className="slider"></span>
            </label>
        </div>
    );
}