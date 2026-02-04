'use client'
import React from 'react'

interface Tab {
  id: string
  label: string
  icon?: string
  count?: number
}

interface FilterTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function FilterTabs({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = '' 
}: FilterTabsProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={`عرض ${tab.label}`}
            aria-pressed={isActive}
            className={`min-touch-target min-touch-target flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm whitespace-nowrap transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-surface-dark border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-text-muted hover:text-primary dark:hover:text-white active:bg-stone-100 dark:active:bg-stone-800'
            }`}
          >
            {tab.icon && (
              <span className="material-symbols-outlined text-lg">
                {tab.icon}
              </span>
            )}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default FilterTabs
