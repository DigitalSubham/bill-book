import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button, Card, Divider, IconButton } from 'react-native-paper'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import { useLogout } from '../../hooks/useAuth'
type SettingsScreenNavigationProps = NativeStackNavigationProp<RootStackParamList, "Settings">

interface Props {
    navigation: SettingsScreenNavigationProps
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const logoutMutation = useLogout();
    return (
        <View style={styles.container}>
            <ScrollView >
                <Card style={styles.recentCard}>
                    <Card.Content style={styles.recentCardContent}>
                        <View style={styles.recentHeader}>
                            <Text style={styles.recentTitle}>Business Profile </Text>
                            <IconButton icon="arrow-right" size={20} onPress={() => navigation.navigate("BusinessSettings")} />
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.recentCard}>
                    <Card.Content style={styles.recentCardContent}>
                        <View style={styles.recentHeader}>
                            <Text style={styles.recentTitle}>User Management</Text>
                            <IconButton icon="arrow-right" size={20} onPress={() => navigation.navigate("UserManagement")} />
                        </View>
                    </Card.Content>
                </Card>


            </ScrollView>
            <Card style={styles.card}>
                <Card.Content>

                    <Button
                        mode="outlined"
                        icon="backup-restore"
                        onPress={() => Alert.alert('Backup', 'Coming soon')}
                        style={styles.optionButton}>
                        Backup & Restore
                    </Button>

                    <Divider style={styles.divider} />

                    <Button
                        mode="text"
                        icon="logout"
                        textColor="#f44336"
                        onPress={() =>
                            Alert.alert(
                                'Logout',
                                'Are you sure you want to logout?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Logout',
                                        style: 'destructive',
                                        onPress: () => {
                                            logoutMutation.mutate();
                                        },
                                    },
                                ]
                            )
                        }
                        style={styles.optionButton}>
                        Logout
                    </Button>
                </Card.Content>
            </Card>
        </View>
    )
}

export default SettingsScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        marginTop: 20,
    },
    monthStatsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    recentCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F0F4F8",
    },
    recentCardContent: {
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    recentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E7BE6",
    },
    card: {
        margin: 12,
    },
    optionButton: {
        marginBottom: 12,
        justifyContent: 'flex-start',
    },
    divider: {
        marginVertical: 12,
    },
})
