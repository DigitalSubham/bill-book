import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

interface Props {
  isLoading: boolean;
  hasNextPage: boolean;
}

const PaginationFooter: React.FC<Props> = ({ isLoading, hasNextPage }) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!hasNextPage) {
    return (
      <View style={styles.container}>
        <Text variant="bodySmall" style={styles.text}>
          No more records
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  text: {
    color: '#666',
  },
});

export default PaginationFooter;
