import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface ActivityCardProps {
  title: string;
  short?: string;
  image?: string;
  price?: number;
  currency?: string;
  badges?: string[];
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ title, short, image, price, currency, badges }) => {
  return (
    <View style={styles.card}>
      {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={[styles.image, styles.placeholder]} />}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {!!short && <Text style={styles.short}>{short}</Text>}
        {!!badges && badges.length > 0 && (
          <View style={styles.badges}>
            {badges.map((b, i) => (
              <View key={i} style={styles.badge}><Text style={styles.badgeText}>{b}</Text></View>
            ))}
          </View>
        )}
        {!!price && <Text style={styles.price}>{price} {currency || '₽'}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', borderRadius:12, overflow:'hidden', marginBottom:12, borderWidth:1, borderColor:'#e2e8f0' },
  image: { width: '100%', height: 160, backgroundColor: '#e2e8f0' },
  placeholder: { alignItems:'center', justifyContent:'center' },
  body: { padding: 12, gap: 8 },
  title: { fontSize: 16, fontWeight: '700', color:'#0f172a' },
  short: { color:'#475569' },
  badges: { flexDirection:'row', flexWrap:'wrap', gap:6 },
  badge: { backgroundColor:'#f1f5f9', paddingHorizontal:8, paddingVertical:4, borderRadius:8 },
  badgeText: { color:'#334155', fontSize:12 },
  price: { color:'#0891b2', fontWeight:'700' },
});

