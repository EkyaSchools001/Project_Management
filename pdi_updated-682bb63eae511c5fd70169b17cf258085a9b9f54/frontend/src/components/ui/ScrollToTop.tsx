import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { ChevronsUp } from 'lucide-react';

interface ScrollToTopProps {
    threshold?: number;
    className?: string;
}

export const ScrollToTop = ({ threshold = 100, className = "" }: ScrollToTopProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > threshold;
            setIsVisible(scrolled);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <Button
            variant="secondary"
            size="icon"
            className={`fixed bottom-12 right-12 rounded-full shadow-2xl border-2 border-primary bg-white hover:bg-slate-50 transition-all duration-300 z-[9999] h-12 w-12 ${className}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <ChevronsUp className="h-6 w-6" />
        </Button>
    );
};
