import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Alert, View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText, RadioButton, IconButton, Text, Divider, Card } from 'react-native-paper';
import { formTypeEnum, RootStackParamList, UserRole } from '../../types';
import { useEffect, useState } from 'react';

type AddUserScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserForm'
>;


interface FormData {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}

interface Props {
    navigation: AddUserScreenNavigationProp;
    route: {
        params: { userId?: string, formType: formTypeEnum };
    }
}

export const AddUserScreen: React.FC<Props> = ({ navigation, route }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        role: 'sales',
        password: '',
        confirmPassword: '',
    });


    useEffect(() => {
        navigation.setOptions({
            title: `${route.params.formType} User`,
        });
    }, [route.params.formType, navigation]);

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number (10 digits required)';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix the errors before submitting');
            return;
        }

        // const userData: User = {
        //     id: Date.now().toString(),
        //     name: formData.name.trim(),
        //     email: formData.email.trim().toLowerCase(),
        //     phone: formData.phone.trim() || undefined,
        //     role: formData.role,
        //     isActive: true,
        //     createdAt: new Date(),
        // };


        Alert.alert('Success', 'User added successfully', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field as keyof FormErrors]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const getRoleDescription = (role: UserRole): string => {
        switch (role) {
            case 'admin':
                return 'Full access to all features and settings';
            case 'sales':
                return 'Can manage products, customers, and invoices';
            case 'customer':
                return 'Limited access to view invoices and make payments';
            default:
                return '';
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Personal Information
                        </Text>

                        <TextInput
                            label="Full Name *"
                            value={formData.name}
                            onChangeText={(text) => updateFormData('name', text)}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.name}
                            placeholder="Enter full name"
                        />
                        {errors.name && (
                            <HelperText type="error" visible={!!errors.name}>
                                {errors.name}
                            </HelperText>
                        )}

                        <TextInput
                            label="Email Address *"
                            value={formData.email}
                            onChangeText={(text) => updateFormData('email', text)}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                            error={!!errors.email}
                            placeholder="user@example.com"
                        />
                        {errors.email && (
                            <HelperText type="error" visible={!!errors.email}>
                                {errors.email}
                            </HelperText>
                        )}

                        <TextInput
                            label="Phone Number"
                            value={formData.phone}
                            onChangeText={(text) => updateFormData('phone', text)}
                            mode="outlined"
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={styles.input}
                            error={!!errors.phone}
                            left={<TextInput.Affix text="+91" />}
                        />
                        {errors.phone && (
                            <HelperText type="error" visible={!!errors.phone}>
                                {errors.phone}
                            </HelperText>
                        )}
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            User Role *
                        </Text>
                        <Text variant="bodySmall" style={styles.roleDescription}>
                            Select the appropriate role for this user
                        </Text>

                        <RadioButton.Group
                            onValueChange={(value) => updateFormData('role', value)}
                            value={formData.role}>
                            <View style={styles.roleOption}>
                                <View style={styles.roleHeader}>
                                    <RadioButton.Android value="admin" />
                                    <View style={styles.roleInfo}>
                                        <View style={styles.roleTitleRow}>
                                            <IconButton
                                                icon="shield-crown"
                                                size={20}
                                                iconColor="#f44336"
                                                style={styles.roleIcon}
                                            />
                                            <Text variant="titleSmall" style={styles.roleTitle}>
                                                Admin
                                            </Text>
                                        </View>
                                        <Text variant="bodySmall" style={styles.roleDesc}>
                                            {getRoleDescription('admin')}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Divider style={styles.divider} />

                            <View style={styles.roleOption}>
                                <View style={styles.roleHeader}>
                                    <RadioButton.Android value="sales" />
                                    <View style={styles.roleInfo}>
                                        <View style={styles.roleTitleRow}>
                                            <IconButton
                                                icon="briefcase"
                                                size={20}
                                                iconColor="#2196F3"
                                                style={styles.roleIcon}
                                            />
                                            <Text variant="titleSmall" style={styles.roleTitle}>
                                                Sales
                                            </Text>
                                        </View>
                                        <Text variant="bodySmall" style={styles.roleDesc}>
                                            {getRoleDescription('sales')}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Divider style={styles.divider} />

                            <View style={styles.roleOption}>
                                <View style={styles.roleHeader}>
                                    <RadioButton.Android value="customer" />
                                    <View style={styles.roleInfo}>
                                        <View style={styles.roleTitleRow}>
                                            <IconButton
                                                icon="account"
                                                size={20}
                                                iconColor="#4caf50"
                                                style={styles.roleIcon}
                                            />
                                            <Text variant="titleSmall" style={styles.roleTitle}>
                                                Customer
                                            </Text>
                                        </View>
                                        <Text variant="bodySmall" style={styles.roleDesc}>
                                            {getRoleDescription('customer')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </RadioButton.Group>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Security
                        </Text>

                        <TextInput
                            label="Password *"
                            value={formData.password}
                            onChangeText={(text) => updateFormData('password', text)}
                            secureTextEntry={!showPassword}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.password}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                        {errors.password && (
                            <HelperText type="error" visible={!!errors.password}>
                                {errors.password}
                            </HelperText>
                        )}
                        <HelperText type="info">
                            Password must be at least 6 characters
                        </HelperText>

                        <TextInput
                            label="Confirm Password *"
                            value={formData.confirmPassword}
                            onChangeText={(text) => updateFormData('confirmPassword', text)}
                            secureTextEntry={!showConfirmPassword}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.confirmPassword}
                            right={
                                <TextInput.Icon
                                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            }
                        />
                        {errors.confirmPassword && (
                            <HelperText type="error" visible={!!errors.confirmPassword}>
                                {errors.confirmPassword}
                            </HelperText>
                        )}
                    </Card.Content>
                </Card>

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
                        icon="account-plus">
                        Add User
                    </Button>
                </View>

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