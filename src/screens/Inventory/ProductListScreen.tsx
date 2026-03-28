// src/screens/products/ProductListScreen.tsx
import React, { useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
} from "react-native";
import {
    Text,
    Searchbar,
    IconButton,
    Menu,
    Avatar,
} from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, ProductType } from "../../types";
import { fetchProductsPage } from "../../apis/productApis";
import ProductCard from "../../components/products/ProductCard";
import Loader from "../../components/common/Loader";
import PaginationFooter from "../../components/common/PaginationFooter";
import { usePaginatedListQuery } from "../../hooks/usePaginatedListQuery";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";


export type ProductListScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ProductList"
>;

interface Props {
    navigation: ProductListScreenNavigationProp;
}

const ProductListScreen: React.FC<Props> = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "stock" | "price">("name");
    const [menuVisible, setMenuVisible] = useState(false);
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 350);

    const {
        items: products,
        isLoading,
        refetch,
        isRefetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = usePaginatedListQuery<ProductType>({
        queryKey: ["products"],
        queryFn: fetchProductsPage,
        staleTime: 5 * 60 * 1000,
    });

    const trimmedSearchQuery = searchQuery.trim();
    const debouncedTrimmedSearchQuery = debouncedSearchQuery.trim();

    const localMatches = products.filter(
        (product: ProductType) =>
            product.name.toLowerCase().includes(trimmedSearchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(trimmedSearchQuery.toLowerCase())
    );

    const shouldUseApiSearch =
        debouncedTrimmedSearchQuery.length > 0 && localMatches.length === 0;

    const {
        items: searchedProducts,
        isLoading: isSearchingProducts,
        isFetchingNextPage: isFetchingMoreSearchedProducts,
        hasNextPage: hasMoreSearchedProducts,
        fetchNextPage: fetchMoreSearchedProducts,
    } = usePaginatedListQuery<ProductType>({
        queryKey: ["products-search", debouncedTrimmedSearchQuery],
        queryFn: params =>
            fetchProductsPage({
                ...params,
                search: debouncedTrimmedSearchQuery,
            }),
        staleTime: 30 * 1000,
        enabled: shouldUseApiSearch,
    });

    if (isLoading) {
        return (
            <Loader />
        );
    }



    // 🔍 Search + Sorting Logic
    const filteredProducts = (shouldUseApiSearch ? searchedProducts : localMatches)
        .sort((a: ProductType, b: ProductType) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "stock":
                    return (Number.parseFloat(a.stock) || 0) - (Number.parseFloat(b.stock) || 0);
                case "price":
                    return Number(b.rate) - Number(a.rate);
                default:
                    return 0;
            }
        });

    const handleEndReached = () => {
        if (trimmedSearchQuery.length > 0) {
            if (shouldUseApiSearch && hasMoreSearchedProducts && !isFetchingMoreSearchedProducts) {
                fetchMoreSearchedProducts();
            }
            return;
        }

        if (shouldUseApiSearch) {
            if (hasMoreSearchedProducts && !isFetchingMoreSearchedProducts) {
                fetchMoreSearchedProducts();
            }
            return;
        }

        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };


    return (
        <View style={styles.container}>
            {/* Header Search + Sorting */}
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search products..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <IconButton icon="sort" size={24} onPress={() => setMenuVisible(true)} />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setSortBy("name");
                            setMenuVisible(false);
                        }}
                        title="Sort by Name"
                        leadingIcon={sortBy === "name" ? "check" : undefined}
                    />
                    <Menu.Item
                        onPress={() => {
                            setSortBy("stock");
                            setMenuVisible(false);
                        }}
                        title="Sort by Stock"
                        leadingIcon={sortBy === "stock" ? "check" : undefined}
                    />
                    <Menu.Item
                        onPress={() => {
                            setSortBy("price");
                            setMenuVisible(false);
                        }}
                        title="Sort by Price"
                        leadingIcon={sortBy === "price" ? "check" : undefined}
                    />
                </Menu>
            </View>

            {/* Product List */}
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => <ProductCard item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.list, { flexGrow: 1 }]}
                onRefresh={refetch}
                refreshing={isRefetching && !isFetchingNextPage && !isFetchingMoreSearchedProducts}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.4}
                ListFooterComponent={
                    <PaginationFooter
                        isLoading={
                            trimmedSearchQuery.length > 0
                                ? shouldUseApiSearch && (isFetchingMoreSearchedProducts || isSearchingProducts)
                                : isFetchingNextPage
                        }
                        hasNextPage={
                            trimmedSearchQuery.length > 0
                                ? shouldUseApiSearch && Boolean(hasMoreSearchedProducts)
                                : Boolean(hasNextPage)
                        }
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Avatar.Icon
                            size={80}
                            icon="package-variant"
                            style={styles.emptyIcon}
                        />
                        <Text variant="titleMedium" style={styles.emptyTitle}>
                            No Products Found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            Add your first product to get started
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    searchbar: {
        flex: 1,
    },
    list: {
        padding: 12,
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

export default ProductListScreen;
