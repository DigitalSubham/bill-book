import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    SegmentedButtons,
    HelperText,
    Divider,
    Surface,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useRegister } from '../../hooks/useAuth';

const appLogo = require('../../assests/logo.png');

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
                        Alert.alert('Registration Failed', error.response?.data?.message || error.message);
                    },
                });
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
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
            style={styles.container}>
            <View style={styles.blobTop} />
            <View style={styles.blobBottom} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.logoOuter}>
                            <View style={styles.logoInner}>
                                <Image source={appLogo} style={styles.logoImage} resizeMode="cover" />
                            </View>
                        </View>
                        <Text variant="headlineLarge" style={styles.title}>
                            Bahix : Billing &amp; Inventory
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Create your account and start managing invoices, stock, and customers.
                        </Text>
                    </View>

                    <Surface style={styles.card} elevation={2}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Create account</Text>
                            <Text style={styles.sectionCaption}>
                                Choose your sign-up method and finish the setup below.
                            </Text>
                        </View>

                        <SegmentedButtons
                            value={registerMethod}
                            onValueChange={(value) => setRegisterMethod(value as 'mobile' | 'email')}
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
                                    outlineStyle={styles.inputOutline}
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
                                    outlineStyle={styles.inputOutline}
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
                                    outlineStyle={styles.inputOutline}
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
                                    outlineStyle={styles.inputOutline}
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
                            buttonColor="#4a2090"
                            contentStyle={styles.buttonContent}
                            style={styles.primaryButton}>
                            {registerMethod === 'mobile' ? 'Continue' : 'Create Account'}
                        </Button>

                        <Divider style={styles.divider} />

                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('Login')}
                            textColor="#4a2090"
                            style={styles.registerButton}>
                            Already have an account? Login
                        </Button>
                    </Surface>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F4FF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoOuter: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D9E8FF',
        marginBottom: 12,
    },
    logoInner: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: 64,
        height: 64,
    },
    title: {
        fontWeight: 'bold',
        color: '#4a2090',
        marginBottom: 6,
        textAlign: 'center',
        lineHeight: 34,
    },
    subtitle: {
        color: '#5F5A73',
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 300,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        shadowColor: '#4a2090',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
    },
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#24153D',
        marginBottom: 4,
    },
    sectionCaption: {
        color: '#756E86',
        fontSize: 13,
        lineHeight: 17,
    },
    segmentedButtons: {
        marginBottom: 14,
    },
    input: {
        marginBottom: 4,
        backgroundColor: '#FFFFFF',
    },
    inputOutline: {
        borderRadius: 16,
        borderColor: '#D7CCE9',
    },
    registerButton: {
        borderColor: '#C9B7E8',
        borderRadius: 16,
    },
    primaryButton: {
        marginTop: 14,
        borderRadius: 16,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    divider: {
        marginVertical: 16,
    },
    blobTop: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#E9DEFF',
        top: -80,
        right: -60,
    },
    blobBottom: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: '#EAF1FF',
        bottom: -120,
        left: -90,
    },
});
