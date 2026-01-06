import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

interface AppHeaderProps {
    title: string;
    onBack?: () => void;
    rightIcon?: string;
    onRightPress?: () => void;
    backgroundColor?: string;
}

const Header: React.FC<AppHeaderProps> = ({
    title,
    onBack,
    rightIcon,
    onRightPress,
    backgroundColor = "#a864f1ff",
}) => {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Left */}
            {onBack ? (
                <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                    <MaterialDesignIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
            ) : (
                <View style={styles.iconBtn} />
            )}

            {/* Title */}
            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>

            {/* Right */}
            {rightIcon ? (
                <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
                    <MaterialDesignIcons name={rightIcon as any} size={24} color="#fff" />
                </TouchableOpacity>
            ) : (
                <View style={styles.iconBtn} />
            )}
        </View>
    );
};

export default React.memo(Header);

const styles = StyleSheet.create({
    container: {
        height: 76,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 8,
        paddingTop: 30,
        elevation: 4,
    },
    title: {
        flex: 1,
        textAlign: 'left',
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    iconBtn: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
