// src/screens/customers/AddCustomerScreen.tsx
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
    Menu,
    Divider,
    Chip,
} from 'react-native-paper';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FormErrors, CustomerFormData } from '../../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCustomers, fetchCustomersById, updateCustomers } from '../../apis/customerApis';
import { validateForm } from '../../utils/validators';
import { STATES } from '../../constants/state';

type AddCustomerScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList>;

interface Props {
    navigation: AddCustomerScreenNavigationProp;
    route: {
        params: { customerId?: string, formType: string };
    }

}

const CUSTOMER_TYPES = ['Regular', 'Wholesale', 'Retail', 'Distributor'];

const AddCustomerScreen = ({ navigation, route }: Props) => {
    const isEditMode = route?.params?.customerId !== undefined;
    const customerId = route?.params?.customerId;

    const existingCustomer = useQuery({
        queryKey: ['customers', customerId],
        queryFn: () => fetchCustomersById(customerId!),
        enabled: isEditMode && !!customerId,
    })

    console.log("existingCustomer", existingCustomer)

    const [formData, setFormData] = useState<CustomerFormData>({
        name: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        state: 'Bihar',
        pincode: '',
        gst_number: '',
        placeOfSupply: 'Bihar',
        customerType: 'Regular',
        creditLimit: '0',
        notes: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [stateMenuVisible, setStateMenuVisible] = useState(false);
    const [supplyStateMenuVisible, setSupplyStateMenuVisible] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const queryClient = useQueryClient();
    const createProductMutation = useMutation({
        mutationFn: (newCustomer: CustomerFormData) => createCustomers(newCustomer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'], exact: true });
        }
    })
    const updateProductMutation = useMutation({
        mutationFn: ({ id, customerData }: {
            id: string;
            customerData: CustomerFormData;
        }) => updateCustomers(id, customerData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'], exact: true });
        }
    })


    useEffect(() => {
        if (isEditMode && existingCustomer.data) {
            setFormData({
                name: existingCustomer.data.name,
                mobile: existingCustomer.data.mobile,
                email: existingCustomer.data.email || '',
                address: existingCustomer.data.address || '',
                city: existingCustomer.data.city || '',
                state: existingCustomer.data.state || 'Bihar',
                pincode: existingCustomer.data.pincode || '',
                gst_number: existingCustomer.data.gst_number || '',
                placeOfSupply: existingCustomer.data.placeOfSupply || 'Bihar',
                customerType: existingCustomer.data.customerType || 'Regular',
                creditLimit: existingCustomer.data.creditLimit?.toString() || '0',
                notes: existingCustomer.data.notes || '',
            });
        }
    }, [isEditMode, existingCustomer.data]);

    useEffect(() => {
        navigation.setOptions({
            title: isEditMode ? 'Edit Customer' : 'Add Customer',
        });
    }, [isEditMode, navigation]);



    const handleSubmit = () => {
        if (!validateForm(formData, setErrors)) {
            Alert.alert('Validation Error', 'Please fix the errors before submitting');
            return;
        }

        const customerData = {
            id: isEditMode ? customerId! : Date.now().toString(),
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            gst_number: formData.gst_number.trim(),
            placeOfSupply: formData.placeOfSupply,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            customerType: formData.customerType,
            creditLimit: formData.creditLimit,
            notes: formData.notes,
        };

        if (isEditMode) {
            updateProductMutation.mutate({ id: customerId!, customerData }, {
                onSuccess: () => {
                    Alert.alert('Success', 'Customer updated successfully', [
                        { text: 'OK', onPress: () => navigation.goBack() },
                    ]);
                }
            })

        } else {
            createProductMutation.mutate(customerData, {
                onSuccess: () => {
                    Alert.alert('Success', 'Customer added successfully', [
                        {
                            text: 'Add Another',
                            onPress: () => {
                                setFormData({
                                    name: '',
                                    mobile: '',
                                    email: '',
                                    address: '',
                                    city: '',
                                    state: 'Bihar',
                                    pincode: '',
                                    gst_number: '',
                                    placeOfSupply: 'Bihar',
                                    customerType: 'Regular',
                                    creditLimit: '0',
                                    notes: '',
                                });
                                setErrors({});
                            },
                        },
                        { text: 'Done', onPress: () => navigation.goBack() },
                    ]);
                }
            })

        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Customer',
            'Are you sure you want to delete this customer?',
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

    const updateFormData = (field: keyof CustomerFormData, value: string) => {
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
                            label="Customer Name *"
                            value={formData.name}
                            onChangeText={(text) => updateFormData('name', text)}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.name}
                            placeholder="Enter customer name"
                        />
                        {errors.name && (
                            <HelperText type="error" visible={!!errors.name}>
                                {errors.name}
                            </HelperText>
                        )}

                        <TextInput
                            label="Mobile Number *"
                            value={formData.mobile}
                            onChangeText={(text) => updateFormData('mobile', text)}
                            mode="outlined"
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={styles.input}
                            error={!!errors.mobile}
                            left={<TextInput.Affix text="+91" />}
                        />
                        {errors.mobile && (
                            <HelperText type="error" visible={!!errors.mobile}>
                                {errors.mobile}
                            </HelperText>
                        )}

                        <TextInput
                            label="Email Address"
                            value={formData.email}
                            onChangeText={(text) => updateFormData('email', text)}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                            error={!!errors.email}
                            placeholder="customer@example.com"
                        />
                        {errors.email && (
                            <HelperText type="error" visible={!!errors.email}>
                                {errors.email}
                            </HelperText>
                        )}

                        {/* Customer Type */}
                        <Text variant="labelLarge" style={styles.label}>
                            Customer Type
                        </Text>
                        <View style={styles.chipContainer}>
                            {CUSTOMER_TYPES.map((type) => (
                                <Chip
                                    key={type}
                                    selected={formData.customerType === type}
                                    onPress={() => updateFormData('customerType', type)}
                                    style={styles.chip}
                                    mode={formData.customerType === type ? 'flat' : 'outlined'}>
                                    {type}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Address Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Address Details
                        </Text>

                        <TextInput
                            label="Address"
                            value={formData.address}
                            onChangeText={(text) => updateFormData('address', text)}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                            placeholder="Street, Area, Landmark"
                        />

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <TextInput
                                    label="City"
                                    value={formData.city}
                                    onChangeText={(text) => updateFormData('city', text)}
                                    mode="outlined"
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.halfWidth}>
                                <TextInput
                                    label="Pincode"
                                    value={formData.pincode}
                                    onChangeText={(text) => updateFormData('pincode', text)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    maxLength={6}
                                    style={styles.input}
                                    error={!!errors.pincode}
                                />
                            </View>
                        </View>
                        {errors.pincode && (
                            <HelperText type="error" visible={!!errors.pincode}>
                                {errors.pincode}
                            </HelperText>
                        )}

                        {/* State Selection */}
                        <Menu
                            visible={stateMenuVisible}
                            onDismiss={() => setStateMenuVisible(false)}
                            anchor={
                                <TouchableOpacity onPress={() => setStateMenuVisible(true)}>
                                    <TextInput
                                        label="State"
                                        value={formData.state}
                                        mode="outlined"
                                        style={styles.input}
                                        editable={false}
                                        right={<TextInput.Icon icon="chevron-down" />}
                                    />
                                </TouchableOpacity>
                            }>
                            <ScrollView style={styles.menuScroll}>
                                {STATES.map((state) => (
                                    <Menu.Item
                                        key={state}
                                        onPress={() => {
                                            updateFormData('state', state);
                                            setStateMenuVisible(false);
                                        }}
                                        title={state}
                                        leadingIcon={formData.state === state ? 'check' : undefined}
                                    />
                                ))}
                            </ScrollView>
                        </Menu>
                    </Card.Content>
                </Card>

                {/* Business Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Business Details
                        </Text>

                        <TextInput
                            label="gst_number"
                            value={formData.gst_number}
                            onChangeText={(text) =>
                                updateFormData('gst_number', text.toUpperCase())
                            }
                            mode="outlined"
                            autoCapitalize="characters"
                            maxLength={15}
                            style={styles.input}
                            error={!!errors.gst_number}
                            placeholder="22AAAAA0000A1Z5"
                        />
                        {errors.gst_number && (
                            <HelperText type="error" visible={!!errors.gst_number}>
                                {errors.gst_number}
                            </HelperText>
                        )}
                        <HelperText type="info">
                            Leave empty if customer doesn't have gst_number
                        </HelperText>

                        {/* Place of Supply */}
                        <Menu
                            visible={supplyStateMenuVisible}
                            onDismiss={() => setSupplyStateMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setSupplyStateMenuVisible(true)}>
                                    <TextInput
                                        label="Place of Supply *"
                                        value={formData.placeOfSupply}
                                        mode="outlined"
                                        style={styles.input}
                                        editable={false}
                                        right={<TextInput.Icon icon="chevron-down" />}
                                    />
                                </TouchableOpacity>
                            }>
                            <ScrollView style={styles.menuScroll}>
                                {STATES.map((state) => (
                                    <Menu.Item
                                        key={state}
                                        onPress={() => {
                                            updateFormData('placeOfSupply', state);
                                            setSupplyStateMenuVisible(false);
                                        }}
                                        title={state}
                                        leadingIcon={
                                            formData.placeOfSupply === state ? 'check' : undefined
                                        }
                                    />
                                ))}
                            </ScrollView>
                        </Menu>
                        <HelperText type="info">
                            Used for GST calculation on invoices
                        </HelperText>
                    </Card.Content>
                </Card>

                {/* Advanced Settings */}
                <Card style={styles.card}>
                    <Card.Content>
                        <TouchableOpacity
                            style={styles.advancedHeader}
                            onPress={() => setShowAdvanced(!showAdvanced)}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Advanced Settings
                            </Text>
                            <Text variant="bodyMedium" style={styles.advancedToggle}>
                                {showAdvanced ? '▼' : '►'}
                            </Text>
                        </TouchableOpacity>

                        {showAdvanced && (
                            <>
                                <Divider style={styles.divider} />

                                <TextInput
                                    label="Credit Limit"
                                    value={formData.creditLimit}
                                    onChangeText={(text) => updateFormData('creditLimit', text)}
                                    mode="outlined"
                                    keyboardType="decimal-pad"
                                    style={styles.input}
                                    left={<TextInput.Affix text="₹" />}
                                />
                                <HelperText type="info">
                                    Maximum credit amount allowed for this customer
                                </HelperText>

                                <TextInput
                                    label="Notes"
                                    value={formData.notes}
                                    onChangeText={(text) => updateFormData('notes', text)}
                                    mode="outlined"
                                    multiline
                                    numberOfLines={3}
                                    style={styles.input}
                                    placeholder="Special instructions, preferences, etc."
                                />
                            </>
                        )}
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
                            Delete Customer
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
    label: {
        marginTop: 8,
        marginBottom: 8,
        color: '#666',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    chip: {
        marginBottom: 4,
    },
    menuScroll: {
        maxHeight: 300,
    },
    advancedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    advancedToggle: {
        color: '#2196F3',
        fontSize: 20,
    },
    divider: {
        marginVertical: 12,
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

export default AddCustomerScreen;