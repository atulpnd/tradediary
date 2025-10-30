import React from 'react';
import { DateFilter } from './types';

interface HeaderProps {
    activeFilter: DateFilter;
    onFilterChange: (filter: DateFilter) => void;
}

const Header: React.FC<HeaderProps> = ({ activeFilter, onFilterChange }) => {
    
    interface FilterButtonProps {
        children: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }

    const FilterButton: React.FC<FilterButtonProps> = ({ children, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                isActive 
                ? 'bg-brand-blue text-white' 
                : 'text-brand-text-secondary bg-brand-surface hover:bg-brand-border hover:text-brand-text-primary'
            }`}
        >
            {children}
        </button>
    );

    const filters: { key: DateFilter, label: string }[] = [
        { key: 'today', label: 'Today' },
        { key: 'yesterday', label: 'Yesterday' },
        { key: 'this-wk', label: 'This wk.' },
        { key: 'last-wk', label: 'Last wk.' },
        { key: 'this-mo', label: 'This mo.' },
        { key: 'last-mo', label: 'Last mo.' },
        { key: 'last-3-mo', label: 'Last 3 mo.' },
        { key: 'this-yr', label: 'This yr.' },
        { key: 'last-yr', label: 'Last yr.' },
    ];

    return (
        <header className="bg-brand-bg border-b border-brand-border sticky top-0 z-10">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2 flex-wrap">
                        {filters.map(({ key, label }) => (
                            <FilterButton
                                key={key}
                                isActive={activeFilter === key}
                                onClick={() => onFilterChange(key)}
                            >
                                {label}
                            </FilterButton>
                        ))}
                        <FilterButton
                            isActive={activeFilter === 'all'}
                            onClick={() => onFilterChange('all')}
                        >
                            Reset
                        </FilterButton>
                        <input
                            type="text"
                            placeholder="Loading date range..."
                            className="px-3 py-1 text-sm text-brand-text-secondary bg-brand-surface rounded-md border border-brand-border w-48"
                            disabled
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;