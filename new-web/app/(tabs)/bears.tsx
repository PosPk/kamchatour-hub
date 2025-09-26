import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { listBearSightings } from '../../lib/bears';

export default function BearsScreen() {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const sightings = useMemo(() => listBearSightings({ dateFrom: from || undefined, dateTo: to || undefined }), [from, to]);

  const html = useMemo(() => {
    const markers = sightings.map(s => `L.marker([${s.lat}, ${s.lon}]).addTo(map).bindPopup(${JSON.stringify(s.date + (s.count ? ` (x${s.count})` : ''))});`).join('\n');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/>\n<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>\n<style>html,body,#map{height:100%;margin:0}</style></head><body>\n<div id="map"></div>\n<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>\n<script>\n var map = L.map('map').setView([53.025,158.65], 8);\n L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);\n ${markers}\n</script>\n</body></html>`;
  }, [sightings]);

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TextInput placeholder="c YYYY-MM-DD" value={from} onChangeText={setFrom} style={styles.input} />
        <TextInput placeholder="по YYYY-MM-DD" value={to} onChangeText={setTo} style={styles.input} />
        <TouchableOpacity style={styles.btn} onPress={() => { setFrom(''); setTo(''); }}><Text style={styles.btnText}>Сброс</Text></TouchableOpacity>
      </View>
      <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  filters: { flexDirection:'row', alignItems:'center', gap: 8, padding: 8, backgroundColor:'#fff' },
  input: { flex: 1, backgroundColor:'#f1f5f9', borderRadius:8, paddingHorizontal:12, height:40 },
  btn: { backgroundColor:'#0891b2', borderRadius:8, paddingHorizontal:12, height:40, alignItems:'center', justifyContent:'center' },
  btnText: { color:'#fff', fontWeight:'700' },
});

