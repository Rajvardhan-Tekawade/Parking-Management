
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define table names as keys of the public schema
type TableName = keyof Database['public']['Tables'];

// Define a type for filters with proper typing
interface Filter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in' | 'cs' | 'cd';
  value: any; // Using any here to avoid complex type issues
}

export const useSupabase = () => {
  // Apply filters to a Supabase query
  const applyFilters = useCallback(
    <T extends TableName>(
      query: any, // Using any for the query type to simplify
      filters?: Filter[]
    ) => {
      if (!filters || filters.length === 0) {
        return query;
      }

      let filteredQuery = query;

      filters.forEach((filter) => {
        const { column, operator, value } = filter;

        switch (operator) {
          case 'eq':
            filteredQuery = filteredQuery.eq(column, value);
            break;
          case 'neq':
            filteredQuery = filteredQuery.neq(column, value);
            break;
          case 'gt':
            filteredQuery = filteredQuery.gt(column, value);
            break;
          case 'gte':
            filteredQuery = filteredQuery.gte(column, value);
            break;
          case 'lt':
            filteredQuery = filteredQuery.lt(column, value);
            break;
          case 'lte':
            filteredQuery = filteredQuery.lte(column, value);
            break;
          case 'like':
            if (typeof value === 'string') {
              filteredQuery = filteredQuery.like(column, value);
            }
            break;
          case 'ilike':
            if (typeof value === 'string') {
              filteredQuery = filteredQuery.ilike(column, value);
            }
            break;
          case 'is':
            filteredQuery = filteredQuery.is(column, value);
            break;
          case 'in':
            if (Array.isArray(value)) {
              filteredQuery = filteredQuery.in(column, value);
            }
            break;
          case 'cs':
            filteredQuery = filteredQuery.contains(column, value);
            break;
          case 'cd':
            if (Array.isArray(value)) {
              filteredQuery = filteredQuery.containedBy(column, value);
            }
            break;
        }
      });

      return filteredQuery;
    },
    []
  );

  return {
    supabase,
    applyFilters,
  };
};
