import { useMemo, useState } from 'react';

interface Activity { id: string; title: string; short_desc?: string; image?: string; price?: number; currency?: string; difficulty?: string; duration?: string; tags?: string[]; season?: string; created_at?: string }

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState<{ status?: string; dateFrom?: string | null; dateTo?: string | null }>({});
  const [sort, setSort] = useState<{ field: keyof Activity; order: 'asc' | 'desc' }>({ field: 'title', order: 'asc' });

  const loadActivities = async (q?: string) => {
    const r = await fetch(`/api/activities/list${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    const j = await r.json();
    if (r.ok) setActivities(j.items || []);
  };

  const filteredActivities = useMemo(() => {
    let list = [...activities];
    if (filters.dateFrom) list = list.filter(a => !a.created_at || a.created_at >= filters.dateFrom!);
    if (filters.dateTo) list = list.filter(a => !a.created_at || a.created_at <= filters.dateTo!);
    list.sort((a: any, b: any) => {
      const va = a[sort.field]; const vb = b[sort.field];
      if (va === vb) return 0; if (va == null) return 1; if (vb == null) return -1;
      return sort.order === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return list;
  }, [activities, filters, sort]);

  return { activities: filteredActivities, filters, setFilters, sort, setSort, loadActivities };
};

