import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import {
    Text,
    FAB as Fab,
    Searchbar,
    Card,
    Avatar,
    Chip,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CustomerType, formTypeEnum } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomer } from '../../apis/customerApis';
import Loader from '../../components/common/Loader';

type CustomerListScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CustomerList'
>;

interface Props {
    navigation: CustomerListScreenNavigationProp;
}

const CustomerListScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: customers = [], isLoading, refetch, isFetching } = useQuery({
        queryKey: ['customers'],
        queryFn: () => fetchCustomer(),
        staleTime: 0,
    })

    const filteredCustomers = customers.filter(
        (customer: any) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.mobile.includes(searchQuery) ||
            customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("customers", customers)


    if (isLoading) {
        return (
            <Loader text="Loading customers..." />
        );
    }

    const renderCustomer = ({ item }: { item: CustomerType }) => {
        if (!item.id) return null;

        return (
            <Card
                mode="outlined"
                style={styles.card}
                onPress={() =>
                    navigation.navigate("CustomerForm", { customerId: item.id, formType: formTypeEnum.EDIT })
                }
            >
                <Card.Content style={styles.cardContent}>

                    {/* HEADER */}
                    <View style={styles.headerWrapper}>
                        <View style={styles.leftSection}>
                            <Avatar.Text
                                size={34}
                                label={item.name.substring(0, 2).toUpperCase()}
                                style={styles.avatar}
                            />
                            <View style={styles.info}>

                                {/* NAME */}
                                <Text style={styles.name}>{item.name}</Text>

                                {/* CONTACT ROW */}
                                <View style={styles.contactRow}>
                                    <Text style={styles.contactItem}>• {item.mobile}</Text>

                                    {item.email ? (
                                        <Text style={styles.contactItem} numberOfLines={1}>
                                            • {item.email}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* ADDRESS */}
                                {item.address ? (
                                    <Text style={styles.address} numberOfLines={1}>
                                        • {item.address}
                                    </Text>
                                ) : null}

                            </View>

                        </View>

                        {/* TINY ROUNDED EDIT BUTTON */}
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("CustomerForm", {
                                    customerId: item.id,
                                    formType: formTypeEnum.EDIT,
                                })
                            }
                            style={styles.editCircle}
                        >
                            <Text style={styles.editIcon}>✎</Text>
                        </TouchableOpacity>
                    </View>

                    {/* STATS */}
                    {/* <View style={styles.stats}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Inv</Text>
                            <Text style={styles.statValue}>{stats.totalInvoices}</Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Sales</Text>
                            <Text style={styles.statValue}>
                                ₹{stats.totalAmount?.toFixed(0)}
                            </Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, styles.pending]}>
                                ₹{stats.pendingAmount?.toFixed(0)}
                            </Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                    </View> */}


                    <View style={styles.gstRow}>

                        {item.gst_number ? (
                            <Chip mode="flat" compact style={styles.chip} textStyle={styles.chipText}>
                                GSTIN: {item.gst_number}
                            </Chip>
                        ) : null}</View>
                </Card.Content>
            </Card>
        );
    };



    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search customers..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
            />



            <FlatList
                onRefresh={refetch}
                refreshing={isFetching}
                data={filteredCustomers}
                renderItem={renderCustomer}
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
                            No Customers Found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            Add your first customer to get started
                        </Text>
                    </View>
                }
            />

            <Fab
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('CustomerForm', { formType: formTypeEnum.ADD })}
                label="Add Customer"
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchbar: {
        margin: 12,
        elevation: 2,
    },
    list: {
        padding: 12,
    },
    card: {
        marginBottom: 8,
        borderRadius: 10,
    },

    cardContent: {
        paddingVertical: 10,
    },

    /* HEADER */
    headerWrapper: {
        position: "relative",
        paddingRight: 40,        // space for tiny edit button
        marginBottom: 6,
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        backgroundColor: "#2196F3",
        marginRight: 10,
    },

    info: {
        flex: 1,
    },


    name: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 2,
    },

    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 1,
    },

    contactItem: {
        fontSize: 12.5,
        color: "#555",
        marginRight: 6,
    },

    address: {
        fontSize: 12,
        color: "#777",
        marginTop: 1,
    },

    mono: {
        fontSize: 12.5,
        color: "#555",
    },

    /* TINY EDIT ICON */
    editCircle: {
        position: "absolute",
        right: 0,
        top: -2,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },

    editIcon: {
        fontSize: 14,
        color: "#2196F3",
        fontWeight: "bold",
        marginTop: -1,
    },

    /* STATS */
    stats: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        paddingVertical: 6,
        marginTop: 6,
    },

    statBox: {
        flex: 1,
        alignItems: "center",
    },

    statDivider: {
        width: 1,
        backgroundColor: "#DDD",
    },

    statLabel: {
        fontSize: 10,
        color: "#777",
    },

    statValue: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#2196F3",
    },

    pending: {
        color: "#FF9800",
    },

    gstRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    /* GSTIN CHIP */
    chip: {
        marginTop: 6,
        height: 28,
        alignSelf: "flex-start",
    },

    chipText: {
        fontSize: 11,
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
    },

});

export default CustomerListScreen;