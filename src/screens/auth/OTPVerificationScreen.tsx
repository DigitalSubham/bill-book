import React, { useState } from 'react';
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
} from 'react-native-paper';
import { RootStackParamList } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface OTPVerificationProps {
    navigation: NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;
    route: {
        params: {
            phoneNumber: string;
            registrationData?: FormData;
        };
    };
}

export const OTPVerificationScreen: React.FC<OTPVerificationProps> = ({
    navigation,
    route,
}) => {
    const { phoneNumber } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = React.useRef<any[]>([]);


    React.useEffect(() => {
        // Start countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleOTPChange = (text: string, index: number) => {
        if (!/^\d*$/.test(text)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all digits are entered
        if (newOtp.every((digit) => digit !== '') && text) {
            handleVerifyOTP(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async (otpCode?: string) => {


    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        try {

            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
        } catch (error: any) {
            console.error('Failed to resend OTP:', error);
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="headlineLarge" style={styles.title}>
                        Verify OTP
                    </Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Enter the 6-digit code sent to
                    </Text>
                    <Text variant="bodyLarge" style={styles.phoneNumber}>
                        {phoneNumber}
                    </Text>
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={`${index}-${digit}`}
                                    ref={(ref: any) => (inputRefs.current[index] = ref)}
                                    value={digit}
                                    onChangeText={(text) => handleOTPChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    mode="outlined"
                                    style={styles.otpInput}
                                    textAlign="center"
                                />
                            ))}
                        </View>
                        <Button
                            mode="contained"
                            onPress={() => handleVerifyOTP()}
                            // loading={loading}
                            // disabled={loading || otp.some((digit) => !digit)}
                            style={styles.verifyButton}>
                            Verify OTP
                        </Button>

                        <View style={styles.resendContainer}>
                            {canResend ? (
                                <Button
                                    mode="text"
                                    onPress={handleResendOTP}
                                    disabled={!canResend}>
                                    Resend OTP
                                </Button>
                            ) : (
                                <Text variant="bodyMedium" style={styles.timerText}>
                                    Resend OTP in {timer}s
                                </Text>

                            )}
                        </View>

                        <Button
                            mode="outlined"
                            onPress={() => navigation.goBack()}
                            style={styles.changeNumberButton}>
                            Change Phone Number
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
};

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
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 12,
        color: '#333',
    },
    input: {
        marginBottom: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    checkboxLabel: {
        flex: 1,
        color: '#666',
    },
    link: {
        color: '#2196F3',
        fontWeight: '600',
    },
    registerButton: {
        marginTop: 8,
        paddingVertical: 6,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpInput: {
        width: 50,
        height: 60,
        fontSize: 24,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#f44336',
        textAlign: 'center',
        marginBottom: 12,
    },
    verifyButton: {
        marginTop: 8,
        paddingVertical: 6,
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    timerText: {
        color: '#666',
    },
    changeNumberButton: {
        marginTop: 12,
    },
    bottomSpace: {
        height: 20,
    },
});

export default OTPVerificationScreen;