import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function App() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const YM_ID = 104238894;
    // init ym function
    // eslint-disable-next-line no-underscore-dangle
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    // inject tag.js once
    const src = 'https://mc.yandex.ru/metrika/tag.js?id=' + YM_ID;
    const exists = Array.from(document.scripts).some(s => s.src === src);
    if (!exists) {
      const s = document.createElement('script');
      s.async = true;
      s.src = src;
      const first = document.getElementsByTagName('script')[0];
      first?.parentNode?.insertBefore(s, first);
    }
    // init counter
    window.ym(YM_ID, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }, []);
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Hero />
        <SearchBar />
        <QuickActions />
        <Activities />
        <FeaturedTours />
        <Partners />
        <Promotions />
        <SupportCTA />
        <FooterSpace />
      </ScrollView>
      <BottomBar />
    </View>
  );
}

function Hero() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroTextWrap}>
        <Text style={styles.heroTitle}>Камчатка — ближе, чем кажется</Text>
        <Text style={styles.heroSubtitle}>Туры, партнёры, оплата и поддержка — в одном месте</Text>
      </View>
      <View style={styles.heroBadge}>
        <Ionicons name="sparkles" size={16} color="#4A90E2" />
        <Text style={styles.heroBadgeText}>Рекомендации с AI</Text>
      </View>
    </View>
  );
}

function SearchBar() {
  return (
    <View style={styles.card}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#8AA8C7" />
        <TextInput
          placeholder="Куда поедем? вулканы, океан, медведи…"
          placeholderTextColor="#8AA8C7"
          style={styles.searchInput}
        />
        <Ionicons name="options-outline" size={20} color="#8AA8C7" />
      </View>
      <View style={styles.searchChipsRow}>
        {['Вулканы', 'Океан', 'Медведи', 'Сопки'].map(label => (
          <Chip key={label} label={label} />
        ))}
      </View>
    </View>
  );
}

function Chip({ label }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function QuickActions() {
  const actions = [
    { icon: 'map', label: 'Каталог' },
    { icon: 'calendar-today', label: 'Календарь' },
    { icon: 'people', label: 'Партнёры' },
    { icon: 'favorite-border', label: 'Избранное' },
    { icon: 'chat-bubble-outline', label: 'Чат' },
    { icon: 'payment', label: 'Оплата' },
  ];
  return (
    <View style={styles.card}>
      <SectionHeader title="Быстрые действия" />
      <View style={styles.quickGrid}>
        {actions.map(item => (
          <TouchableOpacity key={item.label} style={styles.quickItem} activeOpacity={0.8}>
            <View style={styles.quickIconWrap}>
              <MaterialIcons name={item.icon} size={22} color="#4A90E2" />
            </View>
            <Text style={styles.quickLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Activities() {
  const items = ['Вулканы', 'Сёрф', 'Треккинг', 'Снегоходы', 'Вертолёт', 'Медведи'];
  return (
    <View style={styles.card}>
      <SectionHeader title="Активности" action="Все" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.rowGap}>
          {items.map(name => (
            <View key={name} style={styles.activityBadge}>
              <Ionicons name="pricetag-outline" size={16} color="#4A90E2" />
              <Text style={styles.activityText}>{name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function FeaturedTours() {
  const tours = [
    {
      id: 't1',
      title: 'Этна-Камчатка: вулканы и океан',
      meta: 'вулканы • 4 дня',
      priceFrom: 'от 45 000 ₽',
      image: undefined,
    },
    {
      id: 't2',
      title: 'Медведи Курильского озера',
      meta: 'медведи • 1 день',
      priceFrom: 'от 12 000 ₽',
      image: undefined,
    },
    {
      id: 't3',
      title: 'Снегоходы на вулканах',
      meta: 'снегоходы • 2 дня',
      priceFrom: 'от 29 000 ₽',
      image: undefined,
    },
  ];
  return (
    <View style={styles.card}>
      <SectionHeader title="Избранные туры" action="Все" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.rowGap}>
          {tours.map(t => (
            <View key={t.id} style={styles.tourCard}>
              <View style={styles.tourImage}>
                <Ionicons name="image-outline" size={20} color="#8AA8C7" />
              </View>
              <Text style={styles.tourTitle} numberOfLines={2}>{t.title}</Text>
              <Text style={styles.tourMeta}>{t.meta}</Text>
              <Text style={styles.tourPrice}>{t.priceFrom}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Partners() {
  const partners = ['IAM', 'KR', 'SH', 'HB'];
  return (
    <View style={styles.card}>
      <SectionHeader title="Партнёры" action="Все" />
      <View style={styles.partnersRow}>
        {partners.map(p => (
          <View key={p} style={styles.partnerLogo}>
            <Text style={styles.partnerLogoText}>{p}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Promotions() {
  const items = [
    { id: 'n1', title: '‑10% на снегоходы до 1 ноября', meta: 'Акция • до 01.11' },
    { id: 'n2', title: 'Новые туры: Курильское озеро', meta: 'Новости • сегодня' },
  ];
  return (
    <View style={styles.card}>
      <SectionHeader title="Новости и акции" />
      <View style={{ gap: 12 }}>
        {items.map(n => (
          <View key={n.id} style={styles.promoItem}>
            <Ionicons name="megaphone-outline" size={18} color="#4A90E2" />
            <View style={{ flex: 1 }}>
              <Text style={styles.promoTitle} numberOfLines={1}>{n.title}</Text>
              <Text style={styles.promoMeta}>{n.meta}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8AA8C7" />
          </View>
        ))}
      </View>
    </View>
  );
}

function SupportCTA() {
  return (
    <View style={styles.cardCTA}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Ionicons name="help-buoy-outline" size={20} color="#fff" />
        <Text style={styles.ctaTitle}>Нужна помощь?</Text>
      </View>
      <Text style={styles.ctaSubtitle}>Свяжитесь с нами — поможем выбрать маршрут и оформить поездку</Text>
      <View style={styles.ctaButtonsRow}>
        <TouchableOpacity style={[styles.ctaButton, styles.ctaPrimary]} activeOpacity={0.9}>
          <Text style={styles.ctaPrimaryText}>Чат</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaButton, styles.ctaSecondary]} activeOpacity={0.9}>
          <Text style={styles.ctaSecondaryText}>Позвонить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BottomBar() {
  const items = [
    { icon: 'home-outline', label: 'Главная' },
    { icon: 'search-outline', label: 'Поиск' },
    { icon: 'calendar-outline', label: 'Календарь' },
    { icon: 'person-outline', label: 'Профиль' },
  ];
  return (
    <View style={styles.bottomBar}>
      {items.map(i => (
        <TouchableOpacity key={i.label} style={styles.bottomItem} activeOpacity={0.8}>
          <Ionicons name={i.icon} size={22} color="#4A90E2" />
          <Text style={styles.bottomLabel}>{i.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function FooterSpace() {
  return <View style={{ height: 80 }} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  hero: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  heroTextWrap: {
    gap: 6,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 18,
  },
  heroBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    color: '#4A90E2',
    fontWeight: '700',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardCTA: {
    backgroundColor: '#2C3E50',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  searchRow: {
    backgroundColor: '#F0F4FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#1B2B3A',
    fontSize: 14,
  },
  searchChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E7F0FB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    color: '#2B6CB0',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B2B3A',
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A90E2',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickItem: {
    width: '30%',
    alignItems: 'center',
    gap: 8,
  },
  quickIconWrap: {
    backgroundColor: '#E7F0FB',
    borderRadius: 12,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    color: '#1B2B3A',
    fontWeight: '600',
    textAlign: 'center',
  },
  rowGap: {
    flexDirection: 'row',
    gap: 12,
  },
  activityBadge: {
    backgroundColor: '#F0F4FA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityText: {
    color: '#1B2B3A',
    fontWeight: '600',
    fontSize: 13,
  },
  tourCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  tourImage: {
    backgroundColor: '#F0F4FA',
    height: 110,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1B2B3A',
  },
  tourMeta: {
    fontSize: 12,
    color: '#5C738A',
  },
  tourPrice: {
    fontSize: 13,
    color: '#2B6CB0',
    fontWeight: '800',
  },
  partnersRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  partnerLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerLogoText: {
    color: '#4A90E2',
    fontWeight: '900',
  },
  promoItem: {
    backgroundColor: '#F8FAFD',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  promoTitle: {
    color: '#1B2B3A',
    fontWeight: '700',
    fontSize: 13,
  },
  promoMeta: {
    color: '#5C738A',
    fontSize: 12,
  },
  ctaTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  ctaButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ctaButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaPrimary: {
    backgroundColor: '#4A90E2',
  },
  ctaPrimaryText: {
    color: '#fff',
    fontWeight: '800',
  },
  ctaSecondary: {
    backgroundColor: '#fff',
  },
  ctaSecondaryText: {
    color: '#2C3E50',
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    backgroundColor: '#fff',
    borderTopColor: '#E8EEF5',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bottomItem: {
    alignItems: 'center',
    gap: 2,
  },
  bottomLabel: {
    fontSize: 10,
    color: '#2B6CB0',
    fontWeight: '700',
  },
});
