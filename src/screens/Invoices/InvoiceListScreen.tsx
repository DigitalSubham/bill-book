// src/screens/invoices/InvoiceListScreen.tsx
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
    Chip,
    SegmentedButtons,
    Avatar,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '../../apis/InvoiceApis';

type InvoiceListScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'InvoiceList'
>;

interface Props {
    navigation: InvoiceListScreenNavigationProp;
}

const InvoiceListScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const { data: invoices } = useQuery({
        queryKey: ['invoices'],
        queryFn: fetchInvoices,
    })

    console.log("invoices", invoices)

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'paid':
                return '#4caf50';
            case 'pending':
                return '#ff9800';
            case 'partial':
                return '#2196F3';
            case 'overdue':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    const renderInvoice = ({ item }: { item: any }) => {
        const isOverdue =
            item.status !== 'paid' && new Date(item.dueDate) < new Date();
        return (
            <Card
                style={styles.invoiceCard}
                onPress={() =>
                    navigation.navigate('InvoicePreview', { invoice: item, formType: "edit" })
                }>
                <Card.Content>
                    <View style={styles.invoiceHeader}>
                        <View style={styles.invoiceLeft}>
                            <Text variant="titleSmall" style={styles.invoiceNumber}>
                                #{item.invoice_number}
                            </Text>
                            <Text variant="bodyMedium" style={styles.customerName}>
                                {item.customer.name}
                            </Text>
                            <Text variant="bodySmall" style={styles.invoiceDate}>
                                {new Date(item?.invoice_date)?.toLocaleDateString('en-IN')}
                            </Text>
                        </View>
                        <View style={styles.invoiceRight}>
                            <Text variant="titleLarge" style={styles.amount}>
                                ₹{item?.total_amount}
                            </Text>
                            <Chip
                                mode="flat"
                                style={[
                                    styles.statusChip,
                                    { backgroundColor: getStatusColor(isOverdue ? 'overdue' : item.status) },
                                ]}
                                textStyle={styles.chipText}>
                                {isOverdue ? 'OVERDUE' : item?.status?.toUpperCase()}
                            </Chip>
                        </View>
                    </View>

                    <View style={styles.itemsPreview}>
                        <Text variant="bodySmall" style={styles.itemsText}>
                            {item.items.length} item(s) • {item?.customer?.address}
                        </Text>
                    </View>
                </Card.Content>
            </Card >
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search invoices..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />

                <SegmentedButtons
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                    buttons={[
                        { value: 'all', label: 'All' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'paid', label: 'Paid' },
                    ]}
                    style={styles.segmentedButtons}
                />
            </View>

            <FlatList
                data={invoices}
                renderItem={renderInvoice}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Avatar.Icon
                            size={80}
                            icon="file-document"
                            style={styles.emptyIcon}
                        />
                        <Text variant="titleMedium" style={styles.emptyTitle}>
                            No Invoices Found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            Create your first invoice to get started
                        </Text>
                    </View>
                }
            />

            <Fab
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('CreateInvoice')}
                label="New Invoice"
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
    segmentedButtons: {
        marginBottom: 0,
    },
    list: {
        padding: 12,
    },
    invoiceCard: {
        marginBottom: 12,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    invoiceLeft: {
        flex: 1,
    },
    invoiceNumber: {
        fontWeight: 'bold',
        color: '#2196F3',
    },
    customerName: {
        marginTop: 4,
    },
    invoiceDate: {
        color: '#666',
        marginTop: 4,
    },
    invoiceRight: {
        alignItems: 'flex-end',
    },
    amount: {
        fontWeight: 'bold',
    },
    statusChip: {
        marginTop: 8,
        height: 28,
    },
    chipText: {
        fontSize: 11,
        color: '#fff',
    },
    balanceContainer: {
        backgroundColor: '#fff3e0',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    balanceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    balanceLabel: {
        color: '#666',
    },
    balanceAmount: {
        fontWeight: '600',
        color: '#ff9800',
    },
    dueDate: {
        color: '#666',
    },
    itemsPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemsText: {
        color: '#666',
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

export default InvoiceListScreen;