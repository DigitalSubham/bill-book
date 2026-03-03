// src/screens/products/AddProductScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    Card,
    HelperText,
    Chip,
    Checkbox,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ProductType, ProductBaseType, formTypeEnum, ProductFormErrors } from '../../types';
import { createProduct, fetchProductById, updateProduct } from '../../apis/productApis';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { errorToast, successToast } from '../../utils/toast';
import AppDropdownPicker from '../../components/common/Dropdown';
import { CATEGORY_OPTIONS, TAX_RATES, UNIT_OPTIONS } from '../../constants/state';
import { productValidateForm } from '../../utils/validation';
import { compoundToSimple, simpleToCompound } from '../../utils/helper';

type AddProductScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList
>;

interface Props {
    navigation: AddProductScreenNavigationProp;
    route: {
        params: { productId?: string, formType: formTypeEnum };
    }
}


const AddProductScreen: React.FC<Props> = ({ navigation, route }) => {
    const isEditMode = route?.params?.productId !== undefined;
    const productId = route?.params?.productId;

    const { data: existingProduct } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProductById(productId!),
        enabled: isEditMode && !!productId,
        staleTime: 5 * 60 * 1000,
    });

    const [formData, setFormData] = useState<ProductBaseType>({
        name: '',
        description: '',
        mrp: '',
        rate: '',
        taxRate: "5.00",
        unit: 'BOX',
        stock: "0",
        minStock: 10,
        category: 'General',
        barcode: '',
        hsnCode: "",
        baseUnit: 'PCS',
        conversionFactor: "1",
        unitType: 'SIMPLE',
    });

    console.log("formData", formData)

    const [errors, setErrors] = useState<ProductFormErrors>({});
    const queryClient = useQueryClient();


    const createProductMutation = useMutation({
        mutationFn: (product: ProductBaseType) => createProduct({
            name: product.name,
            description: product.description,
            selling_rate: product.rate,
            mrp: product.mrp,
            category: product.category,
            stock: Number.parseFloat(product.stock),
            sku: product.barcode, // or generate SKU
            unit: product.unit,
            tax_percent: product.taxRate,
            base_unit: product.baseUnit,
            conversion_factor: Number.parseFloat(product.conversionFactor),
            unit_type: product.unitType,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });

        },
    });

    const updateProductMutation = useMutation({
        mutationFn: (product: ProductType) => updateProduct(product.id, {
            name: product.name,
            description: product.description,
            selling_rate: product.rate,
            mrp: Number.parseFloat(product.mrp),
            category: product.category,
            stock: Number.parseFloat(product.stock),
            unit: product.unit,
            tax_percent: product.taxRate,
            base_unit: product.baseUnit,
            conversion_factor: Number.parseFloat(product.conversionFactor),
            unit_type: product.unitType,
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


    useEffect(() => {
        if (isEditMode && existingProduct) {
            setFormData({
                name: existingProduct?.name,
                description: existingProduct.description || '',
                mrp: existingProduct.mrp,
                rate: existingProduct.selling_rate,
                taxRate: existingProduct.tax_percent,
                unit: existingProduct.unit,
                stock:
                    existingProduct.unit_type === "COMPOUND" ?
                        simpleToCompound(existingProduct.stock, existingProduct.conversion_factor)
                        : existingProduct.stock,
                minStock: existingProduct.minStock || '10',
                category: existingProduct.category || 'General',
                barcode: existingProduct.barcode || '',
                hsnCode: existingProduct.hsnCode || '',
                baseUnit: existingProduct.baseUnit || 'PCS',
                conversionFactor: existingProduct.conversionFactor || 1,
                unitType: existingProduct.unit_type || 'SIMPLE',
            });
        }
    }, [isEditMode, existingProduct]);

    useEffect(() => {
        navigation.setOptions({
            title: isEditMode ? 'Edit Product' : 'Add Product',
        });
    }, [isEditMode, navigation]);


    const calculateProfit = (): string => {
        const mrp = Number.parseFloat(formData.mrp) || 0;
        const rate = Number.parseFloat(formData.rate) || 0;
        const profit = mrp - rate;
        const profitPercentage = mrp > 0 ? ((profit / mrp) * 100)?.toFixed(2) : '0';
        return `₹${profit?.toFixed(2)} (${profitPercentage}%)`;
    };

    const handleSubmit = () => {
        if (!productValidateForm(formData, setErrors)) {
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
            stock: formData.unitType === "COMPOUND" ? compoundToSimple(formData.stock, formData.conversionFactor) : formData.stock, // store in base unit
            minStock: formData.minStock || undefined,
            baseUnit: formData.baseUnit,
            conversionFactor: formData.conversionFactor,
            unitType: formData.unitType,
        };

        if (isEditMode) {
            updateProductMutation.mutate(productData, {
                onSuccess: () => {
                    successToast("Product updated successfully")
                    navigation.goBack()
                },
                onError: (err: any) => {
                    errorToast(err.message || 'Failed to update product')
                },
            });
        } else {
            createProductMutation.mutate(productData, {
                onSuccess: () => {
                    successToast("Product added successfully")
                    setFormData({
                        name: '',
                        description: '',
                        mrp: '',
                        rate: '',
                        taxRate: "5.00",
                        unit: 'PCS',
                        stock: "0",
                        minStock: 10,
                        category: 'General',
                        barcode: '',
                        hsnCode: '',
                        baseUnit: '',
                        conversionFactor: "1",
                        unitType: 'SIMPLE',
                    });
                    setErrors({});
                    navigation.goBack()
                },
                onError: (err: any) => {
                    errorToast(err.message || 'Failed to create product');
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

    const updateFormData = (field: keyof ProductBaseType, value: any) => {
        if (field === "conversionFactor" && formData.unitType === "COMPOUND") {
            const simpleStock = Number.parseFloat(formData.stock) || 0;
            const newCompoundStock = simpleStock / Number.parseFloat(value);
            setFormData(prev => ({
                ...prev,
                stock: String(newCompoundStock),
                [field]: value,
            }));

        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    console.log("error", errors, formData, existingProduct)

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
                        <AppDropdownPicker
                            label="Category"
                            value={formData.category}
                            items={CATEGORY_OPTIONS}
                            onChange={(value) => updateFormData('category', value)}
                            zIndex={3000}
                        />

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
                        <View>
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Inventory
                            </Text>

                            <View style={styles.checkboxRow}>
                                <View style={styles.checkboxItem}>
                                    <Checkbox
                                        status={formData.unitType === 'SIMPLE' ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setFormData({
                                                ...formData,
                                                unitType: 'SIMPLE',
                                                baseUnit: "PCS",
                                                stock: compoundToSimple(formData.stock, formData.conversionFactor),
                                            })
                                        }}
                                    />
                                    <Text>Simple Unit</Text>
                                </View>

                                <View style={styles.checkboxItem}>
                                    <Checkbox
                                        status={formData.unitType === 'COMPOUND' ? 'checked' : 'unchecked'}
                                        onPress={() => setFormData({ ...formData, unitType: 'COMPOUND', stock: simpleToCompound(formData.stock, formData.conversionFactor) })}
                                    />
                                    <Text>Compound Unit</Text>
                                </View>
                            </View>
                        </View>


                        <View style={{ ...styles.row, marginBottom: 8 }}>
                            <View style={styles.halfWidth}>
                                <AppDropdownPicker
                                    label="Unit *"
                                    value={formData.unitType === "COMPOUND" ? formData.unit : formData.baseUnit}
                                    items={UNIT_OPTIONS}
                                    onChange={(value) => updateFormData(formData.unitType === "COMPOUND" ? 'unit' : "baseUnit", value)}
                                    zIndex={2000}
                                />
                            </View>


                            {formData.unitType === 'COMPOUND' &&
                                <>
                                    <View style={styles.halfWidth}>
                                        <TextInput
                                            label="Value *"
                                            value={String(formData.conversionFactor)}
                                            onChangeText={(text) => updateFormData('conversionFactor', text)}
                                            mode="outlined"
                                            keyboardType="numeric"
                                            style={{ marginTop: 15 }}
                                            error={!!errors.conversionFactor}
                                        />
                                    </View>

                                    <View style={styles.halfWidth}>
                                        <AppDropdownPicker
                                            label="Base Unit *"
                                            value={formData.baseUnit}
                                            items={UNIT_OPTIONS}
                                            onChange={(value) => updateFormData('baseUnit', value)}
                                            zIndex={1000}
                                        />
                                    </View>
                                </>}

                        </View>
                        {formData.unit !== formData.baseUnit && formData.unitType === 'COMPOUND' && (
                            <View style={styles.conversionContainer}>
                                <Text style={styles.conversionText}>
                                    1 {formData.unit} = {formData.conversionFactor} {formData.baseUnit}
                                </Text>

                                {!!formData.stock && <Text style={styles.conversionText}>
                                    | Stock = {formData.stock} {formData.unit} ({compoundToSimple(formData.stock, formData.conversionFactor)} {formData.baseUnit})
                                </Text>}
                            </View>
                        )}

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <TextInput
                                    label={`Stock Quantity (${formData.unitType === "COMPOUND" ? formData.unit : formData.baseUnit}) *`}
                                    value={String(formData.stock)}
                                    onChangeText={(text) => updateFormData('stock', text)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    error={!!errors.stock}
                                />
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

                        {errors.stock || errors.conversionFactor || errors.unit ? (
                            <HelperText type="error" visible={!!errors.stock || !!errors.conversionFactor || !!errors.unit}>
                                {errors.stock || errors.conversionFactor || errors.unit}
                            </HelperText>
                        ) : <HelperText type="info">
                            You'll be notified when stock falls below minimum level
                        </HelperText>}
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
                        loading={createProductMutation.isPending || updateProductMutation.isPending}
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
    conversionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#f0f4ff',
        padding: 1,
        borderRadius: 8,
    },

    conversionText: {
        fontSize: 14,
        fontWeight: '500',
        marginHorizontal: 6,
    },

    conversionInput: {
        width: 80,
        height: 50,
    },

    checkboxRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },

    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
});

export default AddProductScreen;