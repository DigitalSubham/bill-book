import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
    title: string;
    onBack?: () => void;
    rightActions?: Array<{
        icon: string;
        onPress: () => void;
    }>;
}

const appLogo = require('../../assests/logo.png');

const Header: React.FC<AppHeaderProps> = ({
    title,
    onBack,
    rightActions = [],
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrapper, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                        <MaterialDesignIcons name="arrow-left" size={22} color="#4a2090" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.brandTile}>
                        <Image source={appLogo} style={styles.brandImage} resizeMode="cover" />
                    </View>
                )}

                <View style={styles.titleWrap}>
                    <Text style={styles.kicker}>Bahix</Text>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                {rightActions.length > 0 ? (
                    <View style={styles.actionsRow}>
                        {rightActions.map(action => (
                            <TouchableOpacity
                                key={action.icon}
                                onPress={action.onPress}
                                style={styles.iconBtn}>
                                <MaterialDesignIcons name={action.icon as any} size={20} color="#4a2090" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.rightSpacer} />
                )}
            </View>
        </View>
    );
};

export default React.memo(Header);

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFE8FA',
    },
    container: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    titleWrap: {
        flex: 1,
        alignItems: 'center',
    },
    kicker: {
        color: '#8C74B5',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 1,
    },
    title: {
        textAlign: 'center',
        color: '#24153D',
        fontSize: 16,
        fontWeight: '700',
    },
    iconBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#F7F2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsRow: {
        minWidth: 34,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
    },
    brandTile: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#F7F2FF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5DAF7',
    },
    brandImage: {
        width: 26,
        height: 26,
        borderRadius: 8,
    },
    rightSpacer: {
        width: 34,
        height: 34,
    },
});
