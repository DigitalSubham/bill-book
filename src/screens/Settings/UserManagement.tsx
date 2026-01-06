import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
} from 'react-native';
import {
    Text,
    FAB as Fab,
    Searchbar,
    Card,
    Avatar,
    Chip,
    IconButton,
    Menu,
    Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formTypeEnum, RootStackParamList, User, UserRole } from '../../types';

type UserListScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserList'
>;

interface Props {
    navigation: UserListScreenNavigationProp;
}

const UserListScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'sales' | 'customer'>('all');
    const [menuVisible, setMenuVisible] = useState<string | null>(null);

    // Mock data - Replace with Redux selector
    const users: User[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            phone: '+919876543210',
            isActive: true,
            createdAt: new Date('2024-01-15'),
            lastLogin: new Date(),
        },
        {
            id: '2',
            name: 'Sarah Smith',
            email: 'sarah@example.com',
            role: 'sales',
            phone: '+919876543211',
            isActive: true,
            createdAt: new Date('2024-02-10'),
            lastLogin: new Date(),
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'customer',
            phone: '+919876543212',
            isActive: false,
            createdAt: new Date('2024-03-05'),
        },
    ];

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role: UserRole): string => {
        switch (role) {
            case 'admin':
                return '#f44336';
            case 'sales':
                return '#2196F3';
            case 'customer':
                return '#4caf50';
            default:
                return '#9e9e9e';
        }
    };

    const getRoleIcon = (role: UserRole): string => {
        switch (role) {
            case 'admin':
                return 'shield-crown';
            case 'sales':
                return 'briefcase';
            case 'customer':
                return 'account';
            default:
                return 'account-circle';
        }
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleMenuAction = (action: string, userId: string) => {
        setMenuVisible(null);
        switch (action) {
            case 'edit':
                navigation.navigate('UserForm', { userId, formType: formTypeEnum.EDIT });
                break;
            case 'deactivate':
                // Handle deactivation
                break;
            case 'delete':
                // Handle deletion
                break;
        }
    };

    const renderUser = ({ item }: { item: User }) => {
        return (
            <Card
                style={styles.userCard}
                onPress={() => navigation.navigate('UserForm', { userId: item.id, formType: formTypeEnum.VIEW })}>
                <Card.Content>
                    <View style={styles.userHeader}>
                        <View style={styles.userLeft}>
                            <Avatar.Text
                                size={56}
                                label={getInitials(item.name)}
                                style={[
                                    styles.avatar,
                                    { backgroundColor: getRoleColor(item.role) },
                                ]}
                            />
                            <View style={styles.userInfo}>
                                <View style={styles.nameRow}>
                                    <Text variant="titleMedium" style={styles.userName}>
                                        {item.name}
                                    </Text>
                                    {!item.isActive && (
                                        <Chip
                                            mode="flat"
                                            style={styles.inactiveChip}
                                            textStyle={styles.inactiveText}>
                                            Inactive
                                        </Chip>
                                    )}
                                </View>
                                <View style={styles.emailRow}>
                                    <IconButton icon="email" size={16} style={styles.iconSmall} />
                                    <Text variant="bodySmall" style={styles.userEmail}>
                                        {item.email}
                                    </Text>
                                </View>
                                {item.phone && (
                                    <View style={styles.phoneRow}>
                                        <IconButton icon="phone" size={16} style={styles.iconSmall} />
                                        <Text variant="bodySmall" style={styles.userPhone}>
                                            {item.phone}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <Menu
                            visible={menuVisible === item.id}
                            onDismiss={() => setMenuVisible(null)}
                            anchor={
                                <IconButton
                                    icon="dots-vertical"
                                    size={24}
                                    onPress={() => setMenuVisible(item.id)}
                                />
                            }>
                            <Menu.Item
                                onPress={() => handleMenuAction('edit', item.id)}
                                title="Edit"
                                leadingIcon="pencil"
                            />
                            <Menu.Item
                                onPress={() => handleMenuAction('deactivate', item.id)}
                                title={item.isActive ? 'Deactivate' : 'Activate'}
                                leadingIcon={item.isActive ? 'account-off' : 'account-check'}
                            />
                            <Divider />
                            <Menu.Item
                                onPress={() => handleMenuAction('delete', item.id)}
                                title="Delete"
                                leadingIcon="delete"
                                titleStyle={styles.deleteText}
                            />
                        </Menu>
                    </View>

                    <View style={styles.userFooter}>
                        <Chip
                            icon={getRoleIcon(item.role)}
                            mode="flat"
                            style={[
                                styles.roleChip,
                                { backgroundColor: getRoleColor(item.role) + '20' },
                            ]}
                            textStyle={[styles.roleText, { color: getRoleColor(item.role) }]}>
                            {item.role.toUpperCase()}
                        </Chip>

                        <View style={styles.userMeta}>
                            <Text variant="bodySmall" style={styles.metaText}>
                                Joined {item.createdAt.toLocaleDateString('en-IN')}
                            </Text>
                            {item.lastLogin && (
                                <Text variant="bodySmall" style={styles.metaText}>
                                    • Last login: {item.lastLogin.toLocaleTimeString('en-IN')}
                                </Text>
                            )}
                        </View>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search users..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />

                {/* Role Filter */}
                <View style={styles.filterContainer}>
                    <View style={styles.filterChips}>
                        {['all', 'admin', 'sales', 'customer'].map((role) => (
                            <Chip
                                key={role}
                                selected={filterRole === role}
                                onPress={() => setFilterRole(role as any)}
                                style={styles.filterChip}
                                mode={filterRole === role ? 'flat' : 'outlined'}>
                                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                            </Chip>
                        ))}
                    </View>
                </View>
            </View>

            <FlatList
                data={filteredUsers}
                renderItem={renderUser}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Avatar.Icon
                            size={80}
                            icon="account-group"
                            style={styles.emptyIcon}
                        />
                        <Text variant="titleMedium" style={styles.emptyTitle}>
                            No Users Found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            Add your first user to get started
                        </Text>
                    </View>
                }
            />

            <Fab
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('UserForm', { formType: formTypeEnum.ADD })}
                label="Add User"
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    searchbar: {
        marginBottom: 12,
    },
    filterContainer: {
        marginBottom: 8,
    },
    filterLabel: {
        marginBottom: 8,
        color: '#666',
    },
    filterChips: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    filterChip: {
        height: 32,
    },
    list: {
        padding: 12,
    },
    userCard: {
        marginBottom: 12,
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    userLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    avatar: {
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    userName: {
        fontWeight: 'bold',
    },
    inactiveChip: {
        backgroundColor: '#ffebee',
        height: 24,
    },
    inactiveText: {
        fontSize: 10,
        color: '#f44336',
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSmall: {
        margin: 0,
        marginRight: -8,
    },
    userEmail: {
        color: '#666',
    },
    userPhone: {
        color: '#666',
    },
    userFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roleChip: {
        height: 28,
    },
    roleText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    userMeta: {
        flex: 1,
        alignItems: 'flex-end',
    },
    metaText: {
        color: '#999',
        fontSize: 11,
    },
    deleteText: {
        color: '#f44336',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyIcon: {
        backgroundColor: '#e3f2fd',
    },
    emptyTitle: {
        marginTop: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        marginTop: 8,
        color: '#666',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#2196F3',
    },
    card: {
        margin: 12,
        marginBottom: 0,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    input: {
        marginBottom: 8,
    },
    roleDescription: {
        color: '#666',
        marginBottom: 16,
    },
    roleOption: {
        paddingVertical: 8,
    },
    roleHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    roleInfo: {
        flex: 1,
        marginLeft: 8,
    },
    roleTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    roleIcon: {
        margin: 0,
        marginRight: -8,
    },
    roleTitle: {
        fontWeight: 'bold',
    },
    roleDesc: {
        color: '#666',
        marginTop: 2,
    },
    divider: {
        marginVertical: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 12,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 6,
    },
    bottomSpace: {
        height: 20,
    },
});

export default UserListScreen;