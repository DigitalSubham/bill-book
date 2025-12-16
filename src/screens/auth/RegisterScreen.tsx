import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    SegmentedButtons,
    HelperText,
    Card,
    Divider,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useRegister } from '../../hooks/useAuth';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Register'
>;

interface Props {
    navigation: RegisterScreenNavigationProp;
}

interface FormData {
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    email?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [registerMethod, setRegisterMethod] = useState<'mobile' | 'email'>('email');
    const [formData, setFormData] = useState<FormData>({
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const registerMutation = useRegister();

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        // Mobile validation
        if (registerMethod === 'mobile') {
            if (!formData.mobile.trim()) {
                newErrors.mobile = 'Mobile number is required';
            } else if (!/^\d{10}$/.test(formData.mobile)) {
                newErrors.mobile = 'Invalid mobile number (10 digits required)';
            }
        }

        // Email validation
        if (registerMethod === 'email') {
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Invalid email address';
            }

            // Password validation for email registration
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (registerMethod === 'mobile') {
                // Send OTP for mobile registration
                const phoneNumber = `+91${formData.mobile}`;
                navigation.navigate('OTPVerification', {
                    phoneNumber,
                    // registrationData: formData,
                });
            } else {
                // Email registration
                registerMutation.mutate({
                    email: formData.email,
                    password: formData.password,
                }, {
                    onSuccess: () => {
                        navigation.navigate('Login');
                    },
                    onError: (error: any) => {
                        console.log("error", error.response)
                        Alert.alert('Registration Failed', error.response?.data?.message || error.message);
                    },
                });

                Alert.alert('Success', 'Account created successfully!');
            }
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        }
    };

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="headlineLarge" style={styles.title}>
                        Create Account
                    </Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Start managing your invoices today
                    </Text>
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <SegmentedButtons
                            value={registerMethod}
                            onValueChange={(value) => setRegisterMethod(value)}
                            buttons={[
                                { value: 'mobile', label: 'Mobile' },
                                { value: 'email', label: 'Email' },
                            ]}
                            style={styles.segmentedButtons}
                        />

                        {registerMethod === 'mobile' ? (
                            <>
                                <TextInput
                                    label="Mobile Number *"
                                    value={formData.mobile}
                                    onChangeText={(text) => updateFormData('mobile', text)}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    left={<TextInput.Affix text="+91" />}
                                    mode="outlined"
                                    style={styles.input}
                                    error={!!errors.mobile}
                                />
                                {errors.mobile && (
                                    <HelperText type="error" visible={!!errors.mobile}>
                                        {errors.mobile}
                                    </HelperText>
                                )}
                            </>
                        ) : (
                            <>
                                <TextInput
                                    label="Email Address *"
                                    value={formData.email}
                                    onChangeText={(text) => updateFormData('email', text)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    mode="outlined"
                                    style={styles.input}
                                    error={!!errors.email}
                                />
                                {errors.email && (
                                    <HelperText type="error" visible={!!errors.email}>
                                        {errors.email}
                                    </HelperText>
                                )}

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
                            </>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            loading={registerMutation.isPending}
                            disabled={registerMutation.isPending}
                            style={styles.loginContainer}>
                            {registerMethod === 'mobile' ? 'Continue' : 'Create Account'}
                        </Button>

                        <Divider style={styles.divider} />

                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('Login')}
                            style={styles.registerButton}>
                            Already have an account?   Login
                        </Button>
                    </Card.Content>
                </Card>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
    },
    phoneNumber: {
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    card: {
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    segmentedButtons: {
        marginBottom: 20,
    },

    input: {
        marginBottom: 4,
    },
    registerButton: {
        borderColor: '#2196F3',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 36,
    },
    bottomSpace: {
        height: 20,
    },
    divider: {
        marginVertical: 20,
    },
});