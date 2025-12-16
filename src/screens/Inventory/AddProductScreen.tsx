// src/screens/products/AddProductScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    Card,
    HelperText,
    Chip,
    Menu,
} from 'react-native-paper';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, Product } from '../../types';

import { createProduct, fetchProductById, updateProduct } from '../../apis/productApis';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type AddProductScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList
>;

interface Props {
    navigation: AddProductScreenNavigationProp;
    route: {
        params: { productId?: string, formType: string };
    }
}

interface FormErrors {
    name?: string;
    mrp?: string;
    rate?: string;
    taxRate?: string;
    stock?: string;
}

const UNITS = ['PCS', 'KG', 'LITER', 'METER', 'BOX', 'PACK', 'DOZEN'];
const CATEGORIES = ['General', 'Electronics', 'Clothing', 'Food', 'Stationery', 'Hardware', 'Other'];
const TAX_RATES = ['0.00', '5.00', '12.00', '18.00', '28.00'];

const AddProductScreen: React.FC<Props> = ({ navigation, route }) => {
    const isEditMode = route?.params?.productId !== undefined;
    const productId = route?.params?.productId;

    console.log("productId", isEditMode, productId)

    const { data: existingProduct } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProductById(productId!),
        enabled: isEditMode && !!productId,
        staleTime: 5 * 60 * 1000,
    });




    const [formData, setFormData] = useState<Product>({
        name: '',
        description: '',
        mrp: '',
        rate: '',
        taxRate: 5,
        unit: 'PCS',
        stock: 0,
        minStock: 10,
        category: 'General',
        barcode: '',
        hsnCode: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [unitMenuVisible, setUnitMenuVisible] = useState(false);
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const queryClient = useQueryClient();


    const createProductMutation = useMutation({
        mutationFn: (product: Product) => createProduct({
            name: product.name,
            description: product.description,
            selling_rate: product.rate,
            mrp: product.mrp,
            category: product.category,
            stock: product.stock,
            sku: product.barcode, // or generate SKU
            unit: product.unit,
            tax_percent: product.taxRate,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
                exact: true,  // optional, ensures exact match
            });

        },
    });

    const updateProductMutation = useMutation({
        mutationFn: (product: Product) => updateProduct(product.id!, {
            name: product.name,
            description: product.description,
            selling_rate: product.rate,
            mrp: Number.parseFloat(product.mrp),
            category: product.category,
            stock: product.stock,
            unit: product.unit,
            tax_percent: product.taxRate,
        }),
        onSuccess: (updatedProduct) => {
            // update single-product cache
            queryClient.setQueryData(
                ["product", productId],
                updatedProduct
            );

            // refresh product list
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    console.log("existingProduct", existingProduct, formData)
    useEffect(() => {
        if (isEditMode && existingProduct) {
            setFormData({
                name: existingProduct?.name,
                description: existingProduct.description || '',
                mrp: existingProduct.mrp,
                rate: existingProduct.selling_rate,
                taxRate: existingProduct.tax_percent,
                unit: existingProduct.unit,
                stock: existingProduct.stock,
                minStock: existingProduct.minStock || '10',
                category: existingProduct.category || 'General',
                barcode: existingProduct.barcode || '',
                hsnCode: existingProduct.hsnCode || '',
            });
        }
    }, [isEditMode, existingProduct]);

    useEffect(() => {
        navigation.setOptions({
            title: isEditMode ? 'Edit Product' : 'Add Product',
        });
    }, [isEditMode, navigation]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.mrp.trim()) {
            newErrors.mrp = 'MRP is required';
        } else if (Number.parseFloat(formData.mrp) <= 0) {
            newErrors.mrp = 'MRP must be greater than 0';
        }

        if (!formData.rate.trim()) {
            newErrors.rate = 'Rate is required';
        } else if (Number.parseFloat(formData.rate) <= 0) {
            newErrors.rate = 'Rate must be greater than 0';
        } else if (Number.parseFloat(formData.rate) > Number.parseFloat(formData.mrp)) {
            newErrors.rate = 'Rate cannot be greater than MRP';
        }

        if (!formData.taxRate) {
            newErrors.taxRate = 'Tax rate is required';
        }

        if (!formData.stock) {
            newErrors.stock = 'Stock quantity is required';
        } else if (formData.stock < 0) {
            newErrors.stock = 'Stock cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateProfit = (): string => {
        const mrp = Number.parseFloat(formData.mrp) || 0;
        const rate = Number.parseFloat(formData.rate) || 0;
        const profit = mrp - rate;
        const profitPercentage = mrp > 0 ? ((profit / mrp) * 100).toFixed(2) : '0';
        return `₹${profit.toFixed(2)} (${profitPercentage}%)`;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix the errors before submitting');
            return;
        }

        const productData = {
            id: isEditMode ? productId! : Date.now().toString(),
            name: formData.name.trim(),
            description: formData?.description?.trim() || undefined,
            mrp: formData.mrp,
            category: formData.category,
            rate: formData.rate,
            taxRate: formData.taxRate,
            unit: formData.unit,
            stock: formData.stock,
            minStock: formData.minStock || undefined,
        };

        if (isEditMode) {
            updateProductMutation.mutate(productData, {
                onSuccess: () => {
                    Alert.alert('Success', 'Product updated successfully', [
                        { text: 'OK', onPress: () => navigation.goBack() },
                    ]);
                },
                onError: (err: any) => {
                    Alert.alert('Error', err.message || 'Failed to update product');
                },
            });
        } else {
            createProductMutation.mutate(productData, {
                onSuccess: () => {
                    Alert.alert('Success', 'Product added successfully', [
                        {
                            text: 'Add Another',
                            onPress: () => {
                                setFormData({
                                    name: '',
                                    description: '',
                                    mrp: '',
                                    rate: '',
                                    taxRate: 5,
                                    unit: 'PCS',
                                    stock: 0,
                                    minStock: 10,
                                    category: 'General',
                                    barcode: '',
                                    hsnCode: '',
                                });
                                setErrors({});
                            },
                        },
                        { text: 'Done', onPress: () => navigation.goBack() },
                    ]);
                },
                onError: (err: any) => {
                    Alert.alert('Error', err.message || 'Failed to add product');
                },
            });
        }
    };


    const handleDelete = () => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const updateFormData = (field: keyof Product, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field as keyof FormErrors]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Basic Information */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Basic Information
                        </Text>

                        <TextInput
                            label="Product Name *"
                            value={formData.name}
                            onChangeText={(text) => updateFormData('name', text)}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.name}
                            placeholder="e.g., LOVENGLE MEDIUM PAINT"
                        />
                        {errors.name && (
                            <HelperText type="error" visible={!!errors.name}>
                                {errors.name}
                            </HelperText>
                        )}

                        <TextInput
                            label="Description"
                            value={formData.description}
                            onChangeText={(text) => updateFormData('description', text)}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                            placeholder="Product details, specifications, etc."
                        />

                        {/* Category Selection */}
                        <Menu
                            visible={categoryMenuVisible}
                            onDismiss={() => setCategoryMenuVisible(false)}
                            anchor={
                                <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                                    <TextInput
                                        label="Category"
                                        value={formData.category}
                                        mode="outlined"
                                        style={styles.input}
                                        editable={false}
                                        right={<TextInput.Icon icon="chevron-down" />}
                                    />
                                </TouchableOpacity>
                            }>
                            {CATEGORIES.map((cat) => (
                                <Menu.Item
                                    key={cat}
                                    onPress={() => {
                                        updateFormData('category', cat);
                                        setCategoryMenuVisible(false);
                                    }}
                                    title={cat}
                                    leadingIcon={formData.category === cat ? 'check' : undefined}
                                />
                            ))}
                        </Menu>
                    </Card.Content>
                </Card>

                {/* Pricing */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Pricing
                        </Text>

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <TextInput
                                    label="MRP *"
                                    value={formData.mrp}
                                    onChangeText={(text) => updateFormData('mrp', text)}
                                    mode="outlined"
                                    keyboardType="decimal-pad"
                                    style={styles.input}
                                    error={!!errors.mrp}
                                    left={<TextInput.Affix text="₹" />}
                                />
                                {errors.mrp && (
                                    <HelperText type="error" visible={!!errors.mrp}>
                                        {errors.mrp}
                                    </HelperText>
                                )}
                            </View>

                            <View style={styles.halfWidth}>
                                <TextInput
                                    label="Selling Rate *"
                                    value={formData.rate}
                                    onChangeText={(text) => updateFormData('rate', text)}
                                    mode="outlined"
                                    keyboardType="decimal-pad"
                                    style={styles.input}
                                    error={!!errors.rate}
                                    left={<TextInput.Affix text="₹" />}
                                />
                                {errors.rate && (
                                    <HelperText type="error" visible={!!errors.rate}>
                                        {errors.rate}
                                    </HelperText>
                                )}
                            </View>
                        </View>

                        {!!formData.mrp && !!formData.rate && (
                            <View style={styles.profitContainer}>
                                <Text variant="bodySmall" style={styles.profitLabel}>
                                    Profit Margin:
                                </Text>
                                <Text variant="bodyMedium" style={styles.profitValue}>
                                    {calculateProfit()}
                                </Text>
                            </View>
                        )}

                        {/* Tax Rate Selection */}
                        <Text variant="labelLarge" style={styles.label}>
                            GST Rate *
                        </Text>
                        <View style={styles.taxRateContainer}>
                            {TAX_RATES.map((rate) => (
                                <Chip
                                    key={rate}
                                    selected={String(formData.taxRate) === rate}
                                    onPress={() => updateFormData('taxRate', rate)}
                                    style={styles.taxChip}
                                    mode={String(formData.taxRate) === rate ? 'flat' : 'outlined'}>
                                    {rate}%
                                </Chip>
                            ))}
                        </View>
                        {errors.taxRate && (
                            <HelperText type="error" visible={!!errors.taxRate}>
                                {errors.taxRate}
                            </HelperText>
                        )}
                    </Card.Content>
                </Card>

                {/* Inventory */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Inventory
                        </Text>

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <TextInput
                                    label="Stock Quantity *"
                                    value={String(formData.stock)}
                                    onChangeText={(text) => updateFormData('stock', text)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    error={!!errors.stock}
                                />
                                {errors.stock && (
                                    <HelperText type="error" visible={!!errors.stock}>
                                        {errors.stock}
                                    </HelperText>
                                )}
                            </View>

                            <View style={styles.halfWidth}>
                                <TextInput
                                    label="Min Stock Alert"
                                    value={String(formData.minStock)}
                                    onChangeText={(text) => updateFormData('minStock', text)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* Unit Selection */}
                        <Menu
                            visible={unitMenuVisible}
                            onDismiss={() => setUnitMenuVisible(false)}
                            anchor={
                                <TouchableOpacity onPress={() => setUnitMenuVisible(true)}>
                                    <TextInput
                                        label="Unit *"
                                        value={formData.unit}
                                        mode="outlined"
                                        style={styles.input}
                                        editable={false}
                                        right={<TextInput.Icon icon="chevron-down" />}
                                    />
                                </TouchableOpacity>
                            }>
                            {UNITS.map((unit) => (
                                <Menu.Item
                                    key={unit}
                                    onPress={() => {
                                        updateFormData('unit', unit);
                                        setUnitMenuVisible(false);
                                    }}
                                    title={unit}
                                    leadingIcon={formData.unit === unit ? 'check' : undefined}
                                />
                            ))}
                        </Menu>

                        <HelperText type="info">
                            You'll be notified when stock falls below minimum level
                        </HelperText>
                    </Card.Content>
                </Card>

                {/* Additional Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Additional Details (Optional)
                        </Text>

                        <TextInput
                            label="Barcode / SKU"
                            value={formData.barcode}
                            onChangeText={(text) => updateFormData('barcode', text)}
                            mode="outlined"
                            style={styles.input}
                            placeholder="e.g., 1234567890123"
                        />

                        <TextInput
                            label="HSN Code"
                            value={formData.hsnCode}
                            onChangeText={(text) => updateFormData('hsnCode', text)}
                            mode="outlined"
                            style={styles.input}
                            placeholder="e.g., 3208"
                            keyboardType="numeric"
                        />
                        <HelperText type="info">
                            HSN (Harmonized System of Nomenclature) code for GST
                        </HelperText>
                    </Card.Content>
                </Card>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.button}>
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.button}
                        icon="content-save">
                        {isEditMode ? 'Update' : 'Save'}
                    </Button>
                </View>

                {isEditMode && (
                    <View style={styles.deleteContainer}>
                        <Button
                            mode="text"
                            onPress={handleDelete}
                            textColor="#f44336"
                            icon="delete">
                            Delete Product
                        </Button>
                    </View>
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    profitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    profitLabel: {
        color: '#2e7d32',
    },
    profitValue: {
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    label: {
        marginTop: 8,
        marginBottom: 8,
        color: '#666',
    },
    taxRateContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    taxChip: {
        minWidth: 60,
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
    deleteContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    bottomSpace: {
        height: 20,
    },
});

export default AddProductScreen;