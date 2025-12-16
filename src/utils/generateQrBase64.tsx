import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type QrGeneratorProps = {
  value: string;
  onGenerated: (base64: string) => void;
};

export const QrGenerator: React.FC<QrGeneratorProps> = ({
  value,
  onGenerated,
}) => {
  const qrRef = useRef<QRCode | null>(null);

  useEffect(() => {
    if (qrRef.current) {
      // ✅ cast to any because TypeScript doesn't know about toDataURL
      (qrRef.current as any).toDataURL((data: string) => {
        const base64 = `data:image/png;base64,${data}`;
        onGenerated(base64);
      });
    }
  }, [value]);

  return (
    <View style={styles.offscreen}>
      <QRCode
        value={value}
        size={300}
        getRef={(c) => {
          qrRef.current = c; // ✅ assign the component to ref
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  offscreen: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 0,
    height: 0,
  },
});
