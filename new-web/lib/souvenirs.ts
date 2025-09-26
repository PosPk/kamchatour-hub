export interface SouvenirVendor {
  slug: string;
  name: string;
  description?: string;
  website?: string;
  categories?: string[];
  location?: string;
  contacts?: { phone?: string; email?: string; instagram?: string; vk?: string };
}

export const souvenirVendors: SouvenirVendor[] = [
  {
    slug: 'dar-severa',
    name: 'Дар Севера',
    website: 'https://dar-severa.ru/',
    description: 'Авторские сувениры и изделия с северным характером: этника, натуральные материалы, локальные мастера.',
    categories: ['Сувениры', 'Украшения', 'Дом и декор', 'Этнические мотивы'],
    location: 'Камчатка',
    contacts: { instagram: 'https://instagram.com/dar_severa' },
  },
];

export function getSouvenirBySlug(slug: string): SouvenirVendor | null {
  return souvenirVendors.find(v => v.slug === slug) ?? null;
}

