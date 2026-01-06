// src/screens/products/ProductListScreen.tsx
import React, { useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
} from "react-native";
import {
    Text,
    FAB as Fab,
    Searchbar,
    IconButton,
    Menu,
    Avatar,
} from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, ProductType, formTypeEnum } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../apis/productApis";
import ProductCard from "../../components/products/ProductCard";
import Loader from "../../components/common/Loader";


export type ProductListScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "ProductList"
>;

interface Props {
    navigation: ProductListScreenNavigationProp;
}

const ProductListScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "stock" | "price">("name");
    const [menuVisible, setMenuVisible] = useState(false);

    const { data: products = [], isLoading, refetch, isFetching } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <Loader />
        );
    }



    // 🔍 Search + Sorting Logic
    const filteredProducts = products
        .filter(
            (product: ProductType) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a: ProductType, b: ProductType) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "stock":
                    return a.stock - b.stock;
                case "price":
                    return Number(b.rate) - Number(a.rate);
                default:
                    return 0;
            }
        });


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
                refreshing={isFetching}
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

            {/* Add Product */}
            <Fab
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate("ProductForm", { formType: formTypeEnum.ADD })}
                label="Add Product"
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },


});

export default ProductListScreen;