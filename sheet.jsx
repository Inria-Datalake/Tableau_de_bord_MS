import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter, SlidersHorizontal } from 'lucide-react';

function FilterSection({ title, options, value, onChange, searchable = false }) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');

  const filtered = searchable
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())).slice(0, 50)
    : options;

  return (
    <div className="border-b border-border/50 pb-3 mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-2 space-y-1">
          {searchable && options.length > 8 && (
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-muted/50 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <div className={`space-y-0.5 ${options.length > 8 ? 'max-h-48 overflow-y-auto' : ''}`}>
            <button
              onClick={() => onChange('')}
              className={`w-full rounded px-2 py-1 text-left text-xs transition-colors ${!value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Tous
            </button>
            {filtered.map(opt => (
              <button
                key={opt}
                onClick={() => onChange(opt === value ? '' : opt)}
                className={`w-full truncate rounded px-2 py-1 text-left text-xs transition-colors ${value === opt ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                title={opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({ filters, filterOptions, onFilterChange, onClearAll, collapsed, onToggle }) {
  const activeCount = Object.values(filters).filter(v => v !== '' && v !== null && v !== undefined).length;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 space-y-3">
        <button onClick={onToggle} className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors" title="Ouvrir les filtres">
          <SlidersHorizontal className="h-5 w-5 text-foreground" />
        </button>
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Filtres</span>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{activeCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <button onClick={onToggle} className="p-1 rounded hover:bg-muted transition-colors">
            <ChevronDown className="h-3 w-3 rotate-90 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0">
        {/* Year range */}
        <div className="border-b border-border/50 pb-3 mb-3">
          <p className="text-sm font-semibold text-foreground mb-2">Année</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">De</label>
              <input
                type="number"
                min="2001" max="2024"
                value={filters.anneeMin || ''}
                onChange={e => onFilterChange('anneeMin', e.target.value ? Number(e.target.value) : null)}
                placeholder="2001"
                className="w-full rounded-md border border-border bg-muted/50 px-2 py-1 text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">À</label>
              <input
                type="number"
                min="2001" max="2024"
                value={filters.anneeMax || ''}
                onChange={e => onFilterChange('anneeMax', e.target.value ? Number(e.target.value) : null)}
                placeholder="2024"
                className="w-full rounded-md border border-border bg-muted/50 px-2 py-1 text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <FilterSection
          title="Centre Inria"
          options={filterOptions.centres || []}
          value={filters.centre}
          onChange={v => onFilterChange('centre', v)}
        />
        <FilterSection
          title="Équipe Inria"
          options={filterOptions.equipes || []}
          value={filters.equipe}
          onChange={v => onFilterChange('equipe', v)}
          searchable
        />
        <FilterSection
          title="Pays"
          options={filterOptions.pays || []}
          value={filters.pays}
          onChange={v => onFilterChange('pays', v)}
          searchable
        />
        <FilterSection
          title="Auteur Inria"
          options={filterOptions.auteurs || []}
          value={filters.auteur}
          onChange={v => onFilterChange('auteur', v)}
          searchable
        />
        <FilterSection
          title="Type de document"
          options={filterOptions.docTypes || []}
          value={filters.docType}
          onChange={v => onFilterChange('docType', v)}
        />
        <FilterSection
          title="Domaine Inria"
          options={filterOptions.domaines || []}
          value={filters.domaine}
          onChange={v => onFilterChange('domaine', v)}
          searchable
        />
      </div>

      {activeCount > 0 && (
        <div className="p-4 border-t border-border/50">
          <button
            onClick={onClearAll}
            className="w-full rounded-lg border border-destructive/50 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1"
          >
            <X className="h-3 w-3" />
            Effacer tous les filtres ({activeCount})
          </button>
        </div>
      )}
    </div>
  );
}