'use client'

import { Search, X } from 'lucide-react'
import { CATALOG_CATEGORIES, type CatalogCategoryId } from '@/lib/catalog'
import { cn } from '@/lib/utils'

interface CatalogToolbarProps {
  query: string
  category: CatalogCategoryId | 'all'
  resultCount: number
  totalCount: number
  onQueryChange: (value: string) => void
  onCategoryChange: (value: CatalogCategoryId | 'all') => void
}

export function CatalogToolbar({
  query,
  category,
  resultCount,
  totalCount,
  onQueryChange,
  onCategoryChange,
}: CatalogToolbarProps) {
  return (
    <div className="space-y-3">
      <label className="relative block">
        <span className="sr-only">Search the catalog</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search compounds, notes, or benefits"
          className="h-12 w-full rounded-2xl border border-border bg-card pl-10 pr-11 text-base outline-none focus:border-brand"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryChip label="All" active={category === 'all'} onClick={() => onCategoryChange('all')} />
        {CATALOG_CATEGORIES.map((item) => (
          <CategoryChip
            key={item.id}
            label={item.label}
            active={category === item.id}
            onClick={() => onCategoryChange(item.id)}
          />
        ))}
      </div>

      <p className="font-mono text-xs text-muted-foreground">
        {resultCount === totalCount
          ? `${totalCount} compounds`
          : `${resultCount} of ${totalCount} compounds`}
      </p>
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-9 shrink-0 rounded-full px-3 text-sm font-medium transition-colors',
        active ? 'bg-slate-950 text-white' : 'bg-brand-soft text-brand hover:bg-brand-muted/40',
      )}
    >
      {label}
    </button>
  )
}
