import { StyleSheet, View } from 'react-native'
import React from 'react'
import { ActivityIndicator, MD2Colors, Text } from 'react-native-paper'

const Loader = ({ text }: { text?: string }) => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} color={MD2Colors.red800} />
            <Text variant="titleMedium">{text || "Loading products..."}</Text>
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
})