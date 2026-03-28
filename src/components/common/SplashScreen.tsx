import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

const metrics = [
  {
    icon: 'file-document-outline',
    label: 'Invoices',
    value: 'Auto Sync',
    detail: 'Create and track bills in seconds',
    tint: '#EAF4FF',
    iconTint: '#1E7BE6',
  },
  {
    icon: 'package-variant-closed',
    label: 'Inventory',
    value: 'Live Stock',
    detail: 'Stay current on stock movement',
    tint: '#F3E8FF',
    iconTint: '#7C3AED',
  },
  {
    icon: 'account-group-outline',
    label: 'Customers',
    value: 'Smart Billing',
    detail: 'Keep customer history ready',
    tint: '#E9FBF3',
    iconTint: '#0F9F6E',
  },
];

const appLogo = require('../../assests/logo.png');

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.heroPanel}>
        <View style={styles.badge}>
          <MaterialDesignIcons name="calculator-variant-outline" size={18} color="#1E7BE6" />
          <Text style={styles.badgeText}>Business Ready</Text>
        </View>

        <View style={styles.logoWrap}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Image source={appLogo} style={styles.logoImage} resizeMode="cover" />
            </View>
          </View>
        </View>

        <Text variant="headlineMedium" style={styles.title}>
          Bahix : Billing &amp; Inventory
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Preparing invoices, stock, and customer records.
        </Text>

        <View style={styles.metricsHeader}>
          <Text style={styles.metricsKicker}>Core workspace</Text>
          <Text style={styles.metricsHeading}>Everything you need is getting ready</Text>
        </View>

        <View style={styles.metricsRow}>
          {metrics.map(item => (
            <View key={item.label} style={[styles.metricCard, { backgroundColor: item.tint }]}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIcon, { backgroundColor: '#FFFFFF' }]}>
                  <MaterialDesignIcons name={item.icon as any} size={20} color={item.iconTint} />
                </View>
                <Text style={styles.metricLabel}>{item.label}</Text>
              </View>
              <Text style={styles.metricValue}>{item.value}</Text>
              <Text style={styles.metricDetail}>{item.detail}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator animating size="small" color="#1E7BE6" />
        <Text style={styles.footerText}>Loading workspace</Text>
      </View>

      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    justifyContent: 'center',
    paddingHorizontal: 22,
    overflow: 'hidden',
  },
  heroPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#E5EEF9',
    shadowColor: '#1E7BE6',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF4FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
  },
  badgeText: {
    color: '#1E7BE6',
    fontWeight: '700',
    fontSize: 13,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logoOuter: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9E8FF',
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  title: {
    color: '#102A43',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    color: '#627D98',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  metricsHeader: {
    marginBottom: 10,
  },
  metricsKicker: {
    color: '#1E7BE6',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metricsHeading: {
    color: '#102A43',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  metricsRow: {
    gap: 8,
  },
  metricCard: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    color: '#486581',
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    color: '#102A43',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricDetail: {
    color: '#627D98',
    fontSize: 11,
    lineHeight: 15,
  },
  footer: {
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },
  footerText: {
    color: '#627D98',
    fontSize: 14,
    fontWeight: '600',
  },
  blobTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#D9ECFF',
    top: -40,
    right: -70,
  },
  blobBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#EFE3FF',
    bottom: -90,
    left: -90,
  },
});
