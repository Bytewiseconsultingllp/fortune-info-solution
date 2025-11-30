import { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterSidebarProps {
  brands: string[];
  categories: string[];
  selectedBrands: string[];
  selectedCategories: string[];
  onBrandChange: (brand: string, checked: boolean) => void;
  onCategoryChange: (category: string, checked: boolean) => void;
}

export const FilterSidebar = ({
  brands,
  categories,
  selectedBrands,
  selectedCategories,
  onBrandChange,
  onCategoryChange
}: FilterSidebarProps) => {
  const [brandExpanded, setBrandExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());

  console.log("FilterSidebar Props - Categories:", categories);
  console.log("FilterSidebar Props - Brands:", brands);

  const toggleBrandExpansion = (brand: string) => {
    setExpandedBrands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(brand)) {
        newSet.delete(brand);
      } else {
        newSet.add(brand);
      }
      return newSet;
    });
  };

  // Auto-expand categories when brands are selected
  useEffect(() => {
    setExpandedBrands(new Set(selectedBrands));
  }, [selectedBrands]);

  const clearAllFilters = () => {
    selectedBrands.forEach(brand => onBrandChange(brand, false));
    selectedCategories.forEach(category => onCategoryChange(category, false));
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0;

  return (
    <aside className="w-80 bg-surface border-r border-border h-[calc(100vh-73px)] overflow-y-auto">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          {hasActiveFilters && (
            <CardContent className="pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm text-primary">Active Filters</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {selectedBrands.map(brand => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onBrandChange(brand, false)}
                  >
                    {brand} ×
                  </Badge>
                ))}
                {selectedCategories.map(category => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onCategoryChange(category, false)}
                  >
                    {category} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brands Filter */}
        <Card className="mb-4">
          <Collapsible open={brandExpanded} onOpenChange={setBrandExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Brands ({brands.length})</span>
                  {brandExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {brands.map((brand) => (
                  <div key={brand}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => onBrandChange(brand, checked as boolean)}
                      />
                      <Label
                        htmlFor={`brand-${brand}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {brand}
                      </Label>
                      {selectedBrands.includes(brand) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBrandExpansion(brand)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedBrands.has(brand) ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    {/* Subcategories for selected brand */}
                    {selectedBrands.includes(brand) && expandedBrands.has(brand) && (
                      <div className="ml-6 mt-2 space-y-2 border-l-2 border-muted pl-4">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Categories for {brand}:
                        </div>
                        {categories.map((category) => (
                          <div key={`${brand}-${category}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${brand}-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                            />
                            <Label
                              htmlFor={`category-${brand}-${category}`}
                              className="text-xs font-normal cursor-pointer flex-1 capitalize"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Categories Filter */}
        {/* <Card>
          <Collapsible open={categoryExpanded} onOpenChange={setCategoryExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Categories ({categories.length})</span>
                  {categoryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer flex-1 capitalize"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card> */}
      </div>
    </aside>
  );
};
