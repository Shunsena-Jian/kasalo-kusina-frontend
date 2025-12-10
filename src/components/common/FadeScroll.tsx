import React, { useEffect, useRef } from 'react';

interface FadeScrollProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    fadeWidth?: string;
}

export const FadeScroll: React.FC<FadeScrollProps> = ({
    children,
    className = '',
    fadeWidth = '48px',
    ...props
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const updateMask = () => {
        const el = scrollRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        const isStart = scrollLeft <= 0;
        const isEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1;
        const isScrollable = scrollWidth > clientWidth;

        if (!isScrollable) {
            el.style.maskImage = 'none';
            el.style.webkitMaskImage = 'none';
            return;
        }

        // Logic for mask gradient
        // If at start: fade right only
        // If at end: fade left only
        // If in middle: fade both

        let mask = '';
        if (isStart) {
            mask = `linear-gradient(to right, black calc(100% - ${fadeWidth}), transparent 100%)`;
        } else if (isEnd) {
            mask = `linear-gradient(to right, transparent 0%, black ${fadeWidth})`;
        } else {
            mask = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black calc(100% - ${fadeWidth}), transparent 100%)`;
        }

        el.style.maskImage = mask;
        el.style.webkitMaskImage = mask;
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        // initial check
        updateMask();

        // listeners
        el.addEventListener('scroll', updateMask);
        window.addEventListener('resize', updateMask);

        // ResizeObserver for content changes (e.g. images loading stretching the width)
        const observer = new ResizeObserver(updateMask);
        observer.observe(el);

        return () => {
            el.removeEventListener('scroll', updateMask);
            window.removeEventListener('resize', updateMask);
            observer.disconnect();
        };
    }, [fadeWidth]);

    return (
        <div
            ref={scrollRef}
            className={`${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
