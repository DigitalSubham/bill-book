// src/screens/settings/BusinessSettingsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import {
    Text,
    TextInput,
    Button,
    Card,
    Avatar,
    Divider,
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import QRCode from 'react-native-qrcode-svg';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileApi, updateProfileApi } from '../../apis/authApi';
import { useLogout } from '../../hooks/useAuth';

interface Props {
    navigation: any;
}

const BusinessSettingsScreen: React.FC<Props> = ({ navigation }) => {
    const queryClient = useQueryClient();
    const logoutMutation = useLogout();

    const { data: business } = useQuery({
        queryKey: ['business'],
        queryFn: getProfileApi,

    })
    const saveMutation = useMutation({
        mutationFn: (data: any) => updateProfileApi(data),
        onSuccess: () => {
            Alert.alert('Success', 'Business settings updated successfully');
            queryClient.invalidateQueries({ queryKey: ['business'] });

        },
        onError: () => {
            Alert.alert('Error', 'Failed to update business settings');
        },

    });

    console.log("business", business)

    const [formData, setFormData] = useState({
        name: business?.name || '',
        address: business?.address || '',
        mobile: business?.mobile || '',
        email: business?.email || '',
        gst_number: business?.gst_number || '',
        pan: business?.pan_number || '',
        bankName: business?.bank || '',
        accountNo: business?.account_no || '',
        ifscCode: business?.ifsc || '',
        upiId: business?.upi_id || '',
        logo: business?.logo || '',
    });

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || '',
                address: business.address || '',
                mobile: business.mobile || '',
                email: business.email || '',
                gst_number: business?.gst_number || '',
                pan: business?.pan_number || '',
                bankName: business?.bank || '',
                accountNo: business?.account_no || '',
                ifscCode: business?.ifsc || '',
                upiId: business?.upi_id || '',
                logo: business.logo || '',
            });
        }
    }, [business]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Business name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Invalid mobile number';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (
            formData.gst_number &&
            !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[\dA-Z]$/.test(formData.gst_number)
        ) {
            newErrors.gst_number = 'Invalid gst_number format';
        }

        if (
            formData.pan &&
            !/^[A-Z]{5}\d{4}[A-Z]$/.test(formData.pan)
        ) {
            newErrors.pan = 'Invalid PAN format';
        }

        if (
            formData.ifscCode &&
            !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)
        ) {
            newErrors.ifscCode = 'Invalid IFSC code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }
        const payload = {
            name: formData.name,
            address: formData.address,
            mobile: formData.mobile,
            email: formData.email,
            gst_number: formData.gst_number,
            pan_number: formData.pan,
            bank: formData.bankName,
            account_no: formData.accountNo,
            ifsc: formData.ifscCode,
            upi_id: formData.upiId,
        }

        saveMutation.mutate(payload);
    };

    const handleSelectLogo = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 500,
                maxHeight: 500,
            },
            (response) => {
                if (response?.assets?.[0]) {
                    setFormData({
                        ...formData,
                        logo: response.assets[0].uri || '',
                    });
                }
            }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Logo Section */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Business Logo
                        </Text>
                        <View style={styles.logoContainer}>
                            {formData.logo ? (
                                <Image source={{ uri: formData.logo }} style={styles.logo} />
                            ) : (
                                <Avatar.Icon size={100} icon="store" style={styles.logoPlaceholder} />
                            )}
                            <View style={styles.logoButtons}>
                                <Button
                                    mode="outlined"
                                    icon="image"
                                    onPress={handleSelectLogo}
                                    style={styles.logoButton}>
                                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                                </Button>
                                {formData.logo && (
                                    <Button
                                        mode="text"
                                        icon="delete"
                                        onPress={() => setFormData({ ...formData, logo: '' })}
                                        textColor="#f44336">
                                        Remove
                                    </Button>
                                )}
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* Basic Information */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Basic Information
                        </Text>

                        <TextInput
                            label="Business Name *"
                            value={formData.name}
                            onChangeText={(text) => {
                                setFormData({ ...formData, name: text });
                                if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.name}
                        />
                        {!!errors.name && (
                            <Text variant="bodySmall" style={styles.errorText}>
                                {errors.name}
                            </Text>
                        )}

                        <TextInput
                            label="Address *"
                            value={formData.address}
                            onChangeText={(text) => {
                                setFormData({ ...formData, address: text });
                                if (errors.address) setErrors({ ...errors, address: '' });
                            }}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                            error={!!errors.address}
                        />
                        {!!errors.address && (
                            <Text variant="bodySmall" style={styles.errorText}>
                                {errors.address}
                            </Text>
                        )}

                        <TextInput
                            label="Mobile Number *"
                            value={formData.mobile}
                            onChangeText={(text) => {
                                setFormData({ ...formData, mobile: text });
                                if (errors.mobile) setErrors({ ...errors, mobile: '' });
                            }}
                            mode="outlined"
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={styles.input}
                            left={<TextInput.Affix text="+91" />}
                            error={!!errors.mobile}
                        />
                        {!!errors.mobile && (
                            <Text variant="bodySmall" style={styles.errorText}>
                                {errors.mobile}
                            </Text>
                        )}

                        <TextInput
                            label="Email Address"
                            value={formData.email}
                            onChangeText={(text) => {
                                setFormData({ ...formData, email: text });
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                            error={!!errors.email}
                        />
                        {!!errors.email && (
                            <Text variant="bodySmall" style={styles.errorText}>
                                {errors.email}
                            </Text>
                        )}
                    </Card.Content>
                </Card>

                {/* Tax Information */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Tax Information
                        </Text>

                        <TextInput
                            label="GSTIN"
                            value={formData.gst_number}
                            onChangeText={(text) => {
                                setFormData({ ...formData, gst_number: text.toUpperCase() });
                                if (errors.gst_number) setErrors({ ...errors, gst_number: '' });
                            }}
                            mode="outlined"
                            autoCapitalize="characters"
                            maxLength={15}
                            style={styles.input}
                            error={!!errors.gst_number}
                        />
                        {!!errors.gst_number && (
                            <Text variant="bodySmall" style={styles.errorText}>
                                {errors.gst_number}
                            </Text>
                        )}
                        <Text variant="bodySmall" style={styles.helperText}>
                            Format: 22AAAAA0000A1Z5
                        </Text>

                        <TextInput
                            label="PAN Number"
                            value={formData.pan}
                            onChangeText={(text) => {
                                setFormData({ ...formData, pan: text.toUpperCase() });
                                if (errors.pan) setErrors({ ...errors, pan: '' });
                            }}
                            mode="outlined"
                            autoCapitalize="characters"
                            maxLength={10}
                            style={styles.input}
                            error={!!errors.pan}
                        />
                        {!!errors.pan && (
                            <Text variant="bodySmall" style={styles.errorText}>
                                {errors.pan}
                            </Text>
                        )}
                        <Text variant="bodySmall" style={styles.helperText}>
                            Format: ABCDE1234F
                        </Text>
                    </Card.Content>
                </Card>

                {/* Bank Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Bank Details
                        </Text>

                        <TextInput
                            label="Bank Name"
                            value={formData.bankName}
                            onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                            mode="outlined"
                            style={styles.input}
                        />

                        <TextInput
                            label="Account Number"
                            value={formData.accountNo}
                            onChangeText={(text) => setFormData({ ...formData, accountNo: text })}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.input}
                        />

                        <TextInput
                            label="IFSC Code"
                            value={formData.ifscCode}
                            onChangeText={(text) => {
                                setFormData({ ...formData, ifscCode: text.toUpperCase() });
                                if (errors.ifscCode) setErrors({ ...errors, ifscCode: '' });
                            }}
                            mode="outlined"
                            autoCapitalize="characters"
                            maxLength={11}
                            style={styles.input}
                            error={!!errors.ifscCode}
                        />
                        {!!errors.ifscCode && (
                            <Text variant="bodySmall" style={styles.errorText}>
                                {errors.ifscCode}
                            </Text>
                        )}

                        <TextInput
                            label="UPI ID"
                            value={formData.upiId}
                            onChangeText={(text) => setFormData({ ...formData, upiId: text })}
                            mode="outlined"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                        <Text variant="bodySmall" style={styles.helperText}>
                            Example: 9934646569@ptsbi
                        </Text>

                        {formData.upiId && (
                            <View style={styles.qrContainer}>
                                <Text variant="titleSmall" style={styles.qrTitle}>
                                    Payment QR Code
                                </Text>
                                <View style={styles.qrCode}>
                                    <QRCode
                                        value={`upi://pay?pa=${formData.upiId}&pn=${formData.name}`}
                                        size={200}
                                        backgroundColor="white"
                                    />
                                </View>
                                <Text variant="bodySmall" style={styles.qrText}>
                                    Scan to pay via UPI
                                </Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        icon="content-save"
                        style={styles.saveButton}>
                        Save Settings
                    </Button>
                </View>

                {/* Additional Options */}
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
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    logoContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    logoPlaceholder: {
        backgroundColor: '#e3f2fd',
    },
    logoButtons: {
        marginTop: 16,
        gap: 8,
    },
    logoButton: {
        minWidth: 150,
    },
    input: {
        marginBottom: 8,
    },
    errorText: {
        color: '#f44336',
        marginBottom: 8,
    },
    helperText: {
        color: '#666',
        marginBottom: 12,
    },
    qrContainer: {
        alignItems: 'center',
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    qrTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    qrCode: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    qrText: {
        marginTop: 12,
        color: '#666',
    },
    buttonContainer: {
        padding: 12,
    },
    saveButton: {
        paddingVertical: 6,
    },
    optionButton: {
        marginBottom: 12,
        justifyContent: 'flex-start',
    },
    divider: {
        marginVertical: 12,
    },
    bottomSpace: {
        height: 20,
    },
});

export default BusinessSettingsScreen;