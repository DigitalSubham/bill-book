// src/screens/invoices/InvoiceListScreen.tsx
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
} from 'react-native';
import {
    Text,
    Searchbar,
    Card,
    Chip,
    Avatar,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formTypeEnum, InvoiceType, RootStackParamList } from '../../types';
import { fetchInvoicesPage } from '../../apis/InvoiceApis';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helper';
import PaginationFooter from '../../components/common/PaginationFooter';
import { usePaginatedListQuery } from '../../hooks/usePaginatedListQuery';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

type InvoiceListScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'InvoiceList'
>;

interface Props {
    navigation: InvoiceListScreenNavigationProp;
}

type InvoiceListItem = InvoiceType & {
    paymentStatus?: InvoiceType['status'];
};

const getInvoiceStatus = (invoice: InvoiceListItem): InvoiceType['status'] => {
    const baseStatus = invoice.paymentStatus ?? invoice.status;
    const isOverdue = baseStatus !== 'paid' && new Date(invoice.dueDate) < new Date();

    return isOverdue ? 'overdue' : baseStatus;
};

const InvoiceListScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 350);

    const {
        items: invoices,
        isLoading,
        refetch,
        isRefetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = usePaginatedListQuery<InvoiceType>({
        queryKey: ['invoices'],
        queryFn: fetchInvoicesPage,
    });

    const trimmedSearchQuery = searchQuery.trim();
    const debouncedTrimmedSearchQuery = debouncedSearchQuery.trim();
    const hasActiveSearch = debouncedTrimmedSearchQuery.length > 0;
    const hasActiveStatusFilter = filterStatus !== 'all';

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

    const renderInvoice = ({ item }: { item: InvoiceListItem }) => {
        const invoiceStatus = getInvoiceStatus(item);
        const isOverdue = invoiceStatus === 'overdue';
        return (
            <Card
                style={styles.invoiceCard}
                onPress={() =>
                    navigation.navigate('InvoicePreview', { invoice: item, formType: formTypeEnum.EDIT })
                }>
                <Card.Content>
                    <View style={styles.invoiceHeader}>
                        <View style={styles.invoiceLeft}>
                            <Text variant="titleSmall" style={styles.invoiceNumber}>
                                #{item.invoiceNumber}
                            </Text>
                            <Text variant="bodyMedium" style={styles.customerName}>
                                {item.customer.name}
                            </Text>
                            <Text variant="bodySmall" style={styles.invoiceDate}>
                                {`${formatDate(item.invoiceDate)} - ${formatDate(item.dueDate)}`}

                            </Text>
                        </View>
                        <View style={styles.invoiceRight}>
                            <Text variant="titleLarge" style={styles.amount}>
                                ₹{item?.totalAmount}
                            </Text>
                            <Chip
                                mode="flat"
                                compact
                                style={[
                                    styles.statusChip,
                                    { backgroundColor: getStatusColor(isOverdue ? 'overdue' : invoiceStatus) },
                                ]}
                                textStyle={styles.chipText}>
                                {isOverdue ? 'OVERDUE' : invoiceStatus?.toUpperCase() || 'N/A'}
                            </Chip>
                        </View>
                    </View>

                    <View style={styles.itemsPreview}>
                        <Text variant="bodySmall" style={styles.itemsText}>
                            {item.items.length} item(s)
                        </Text>
                    </View>
                </Card.Content>
            </Card >
        );
    };

    const localMatches = invoices.filter((invoice: InvoiceListItem) => {
        const invoiceStatus = getInvoiceStatus(invoice);
        const normalizedQuery = trimmedSearchQuery.toLowerCase();
        const matchesSearch =
            normalizedQuery.length === 0 ||
            String(invoice.invoiceNumber ?? '').includes(normalizedQuery) ||
            invoice.customer.name.toLowerCase().includes(normalizedQuery);
        const matchesStatus =
            filterStatus === 'all' || invoiceStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const shouldUseApiFilters =
        hasActiveStatusFilter || (hasActiveSearch && localMatches.length === 0);

    const {
        items: filteredInvoicesFromApi,
        isLoading: isFilteringInvoices,
        isFetchingNextPage: isFetchingMoreFilteredInvoices,
        hasNextPage: hasMoreFilteredInvoices,
        fetchNextPage: fetchMoreFilteredInvoices,
        refetch: refetchFilteredInvoices,
        isFetched: hasFetchedFilteredInvoices,
    } = usePaginatedListQuery<InvoiceType>({
        queryKey: ['invoices-search', debouncedTrimmedSearchQuery, filterStatus],
        queryFn: params =>
            fetchInvoicesPage({
                ...params,
                search: hasActiveSearch ? debouncedTrimmedSearchQuery : undefined,
                status: filterStatus === 'all' ? undefined : filterStatus,
            }),
        staleTime: 30 * 1000,
        enabled: shouldUseApiFilters,
    });

    const filteredInvoices = shouldUseApiFilters && hasFetchedFilteredInvoices
        ? filteredInvoicesFromApi.filter((invoice: InvoiceListItem) => {
            const invoiceStatus = getInvoiceStatus(invoice);
            return filterStatus === 'all' || invoiceStatus === filterStatus;
        })
        : localMatches;

    if (isLoading) {
        return (
            <Loader text="Loading invoices..." />
        );
    }

    const handleRefresh = () => {
        if (shouldUseApiFilters) {
            refetchFilteredInvoices();
            return;
        }

        refetch();
    };

    const handleEndReached = () => {
        if (trimmedSearchQuery.length > 0 || hasActiveStatusFilter) {
            if (shouldUseApiFilters && hasMoreFilteredInvoices && !isFetchingMoreFilteredInvoices) {
                fetchMoreFilteredInvoices();
            }
            return;
        }

        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
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

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterTabs}
                >
                    {[
                        { value: 'all', label: 'All' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'partial', label: 'Partial' },
                        { value: 'paid', label: 'Paid' },
                        { value: 'overdue', label: 'Overdue' },
                    ].map(tab => (
                        <Chip
                            key={tab.value}
                            selected={filterStatus === tab.value}
                            onPress={() => setFilterStatus(tab.value)}
                            mode={filterStatus === tab.value ? 'flat' : 'outlined'}
                            style={styles.filterChip}
                            textStyle={styles.filterChipText}
                        >
                            {tab.label}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredInvoices}
                onRefresh={handleRefresh}
                refreshing={
                    shouldUseApiFilters
                        ? isFilteringInvoices && !isFetchingMoreFilteredInvoices
                        : isRefetching && !isFetchingNextPage
                }
                renderItem={renderInvoice}
                keyExtractor={(item, index) => item.id ?? `invoice-${item.invoiceNumber ?? index}`}
                contentContainerStyle={styles.list}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.4}
                ListFooterComponent={
                    <PaginationFooter
                        isLoading={
                            trimmedSearchQuery.length > 0 || hasActiveStatusFilter
                                ? shouldUseApiFilters && (isFetchingMoreFilteredInvoices || isFilteringInvoices)
                                : isFetchingNextPage
                        }
                        hasNextPage={
                            trimmedSearchQuery.length > 0 || hasActiveStatusFilter
                                ? shouldUseApiFilters && Boolean(hasMoreFilteredInvoices)
                                : Boolean(hasNextPage)
                        }
                    />
                }
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
    filterTabs: {
        gap: 8,
        paddingRight: 8,
    },
    filterChip: {
        height: 36,
        justifyContent: 'center',
    },
    filterChipText: {
        fontSize: 13,
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
        paddingVertical: 0,      // 🔑 remove extra vertical padding
        justifyContent: "center",
    },

    chipText: {
        fontSize: 11,
        color: "#fff",
        lineHeight: 14,          // 🔑 critical
        paddingVertical: 0,
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
});

export default InvoiceListScreen;
