// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    SegmentedButtons,
    Divider,
} from 'react-native-paper';
import { useLoginEmail, useSendOtp } from '../../hooks/useAuth';

const LoginScreen = ({ navigation }: any) => {
    const [loginMethod, setLoginMethod] = useState('email');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const sendOtpMutation = useSendOtp();
    const emailLoginMutation = useLoginEmail();

    const handleMobileLogin = () => {
        if (mobile.length !== 10) {
            Alert.alert("Invalid mobile");
            return;
        }

        sendOtpMutation.mutate(`${mobile}`, {
            onSuccess: () => {

            },
            onError: (err: any) => {
                console.log("error", err)
                Alert.alert("Error", err.response?.data?.message || "Failed");
            },
        });
    };



    const handleEmailLogin = () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter both email and password');
            return;
        }

        emailLoginMutation.mutate({ email: email.trim(), password: password.trim() }, {
            onSuccess: () => {
                navigation.navigate("OTPVerification", { mobile });
            },
            onError: (err: any) => {
                Alert.alert("Error", err.response?.data?.message || "Failed");
            },
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="headlineLarge" style={styles.title}>
                        Invoice Manager
                    </Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Manage your business invoices with ease
                    </Text>
                </View>

                <View style={styles.form}>
                    <SegmentedButtons
                        value={loginMethod}
                        onValueChange={setLoginMethod}
                        buttons={[
                            { value: 'mobile', label: 'Mobile OTP' },
                            { value: 'email', label: 'Email' },
                        ]}
                        style={styles.segmentedButtons}
                    />

                    {loginMethod === 'mobile' ? (
                        <>
                            <TextInput
                                label="Mobile Number"
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                                maxLength={10}
                                left={<TextInput.Affix text="+91" />}
                                style={styles.input}
                                mode="outlined"
                            />
                            <Button
                                mode="contained"
                                onPress={handleMobileLogin}
                                loading={sendOtpMutation.isPending}
                                disabled={sendOtpMutation.isPending}
                                style={styles.button}>
                                Send OTP
                            </Button>
                        </>
                    ) : (
                        <>
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                                mode="outlined"
                            />
                            <Button
                                mode="contained"
                                onPress={handleEmailLogin}
                                loading={emailLoginMutation.isPending}
                                disabled={emailLoginMutation.isPending}
                                style={styles.button}>
                                Login
                            </Button>
                        </>
                    )}

                    <Divider style={styles.divider} />

                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('Register')}
                        style={styles.registerButton}>
                        Create New Account
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
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
    form: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
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
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
    errorText: {
        color: '#d32f2f',
        textAlign: 'center',
        marginTop: 12,
    },
    divider: {
        marginVertical: 20,
    },
    registerButton: {
        borderColor: '#2196F3',
    },
});

export default LoginScreen;