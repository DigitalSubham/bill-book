import { ScrollView, Alert, View, StyleSheet } from 'react-native';
import { Button, Divider, DataTable, Card, Text } from 'react-native-paper';
import { generateInvoicePDF, shareInvoicePDF } from '../../utils/pdfGenerator';
import { convertAmountToWords, dateFmt } from '../../utils/calculations';
import { Invoice } from '../../types';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProfileApi } from '../../apis/authApi';
import { createInvoices } from '../../apis/InvoiceApis';
import { QrGenerator } from '../../utils/generateQrBase64';

interface InvoicePreviewProps {
    navigation: any;
    route: {
        params: {
            invoice: Invoice;
            formType: string;
        };
    };
}

export const InvoicePreviewScreen: React.FC<InvoicePreviewProps> = ({
    navigation,
    route,
}) => {
    const { invoice, formType } = route.params;
    const { data: business } = useQuery({
        queryKey: ['business'],
        queryFn: getProfileApi,

    })
    console.log("business", business)
    const [qrBase64, setQrBase64] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const generateInvoice = useMutation({
        mutationFn: (payload: any) => createInvoices(payload),
        onSuccess: (data) => {
            Alert.alert('Success', 'Invoice saved successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('InvoiceList'),
                },
            ]);
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to save invoice');
        },
    })


    const handleSaveInvoice = () => {
        const payload = {
            customer_id: invoice.customer.id,
            invoice_type: "sale",
            invoice_date: invoice.invoiceDate,
            due_date: invoice.dueDate,
            status: invoice.status,
            payment_status: invoice.status === 'paid' ? 'paid' : (invoice.receivedAmount > 0 ? 'partial' : 'unpaid'),
            items: invoice.items.map(item => ({
                product_id: item.productId,
                product_name: item.productName,
                quantity: item.quantity,
                selling_rate: item.rate,
                tax_percent: item.taxRate,
                tax_amount: item.taxAmount,
                line_total: item.amount,
                cgst: Number(item.taxAmount) / 2,
                sgst: Number(item.taxAmount) / 2,
                igst: Number(item.taxAmount)
            })),
            total_tax: invoice.cgst + invoice.sgst,
            cgst_total: invoice.cgst,
            sgst_total: invoice.sgst,
            igst_total: invoice.cgst + invoice.sgst,
            total_amount: invoice.totalAmount,
            received_amount: invoice.receivedAmount,
            pdf_path: "",
            notes: " Thank you for your business! ",
        }
        generateInvoice.mutate(payload);
    };

    const handleGeneratePDF = async () => {
        try {
            setGenerating(true);
            const filePath = await generateInvoicePDF(invoice, business, qrBase64);
            shareInvoicePDF(filePath)
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Failed to generate PDF');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.previewContainer}>
                {/* Business Header */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="headlineMedium" style={styles.businessName}>
                            {business?.name}
                        </Text>
                        <Text variant="bodySmall" style={styles.businessInfo}>
                            {business?.address}
                        </Text>
                        <Text variant="bodySmall" style={styles.businessInfo}>
                            Mobile: {business?.mobile}
                        </Text>
                        {business?.email && (
                            <Text variant="bodySmall" style={styles.businessInfo}>
                                Email: {business?.email}
                            </Text>
                        )}
                        {business?.gst_number && (
                            <Text variant="bodySmall" style={styles.businessInfo}>
                                GSTIN: {business?.gst_number}
                            </Text>
                        )}
                    </Card.Content>
                </Card>

                {/* Invoice Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.invoiceTitle}>
                            TAX INVOICE
                        </Text>
                        <View style={styles.detailRow}>
                            <Text variant="bodyMedium">Invoice No:</Text>
                            <Text variant="bodyMedium" style={[styles.detailValue, styles.highlight]}>
                                {invoice.invoiceNo || invoice.invoice_number}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text variant="bodyMedium">Invoice Date:</Text>
                            <Text variant="bodyMedium" style={styles.detailValue}>
                                {dateFmt(invoice.invoiceDate || invoice.invoice_date) || "NA"}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text variant="bodyMedium">Due Date:</Text>
                            <Text variant="bodyMedium" style={styles.detailValue}>
                                {dateFmt(invoice.dueDate || invoice.due_date)}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Customer Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            BILL TO
                        </Text>
                        <Text variant="bodyLarge">name: {invoice.customer.name}</Text>
                        {!!invoice.customer.address && (
                            <Text variant="bodySmall" style={styles.customerInfo}>
                                address:  {invoice.customer.address}
                            </Text>
                        )}
                        <Text variant="bodySmall" style={styles.customerInfo}>
                            Mobile: {invoice.customer.mobile}
                        </Text>
                        <Text variant="bodySmall" style={styles.customerInfo}>
                            GSTIN: {invoice.customer.gst_number}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Items */}
                <Card style={styles.card}>
                    <Card.Content>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Item</DataTable.Title>
                                <DataTable.Title numeric>Qty</DataTable.Title>
                                <DataTable.Title numeric>Rate</DataTable.Title>
                                <DataTable.Title numeric>Tax</DataTable.Title>
                                <DataTable.Title numeric>Amount</DataTable.Title>
                            </DataTable.Header>

                            {invoice.items.map((item, index) => (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell>
                                        <View>
                                            <Text variant="bodyMedium">{item.productName}</Text>
                                            <Text variant="bodySmall" style={styles.itemSubtext}>
                                                Tax: {item.taxRate}%
                                            </Text>
                                        </View>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                                    <DataTable.Cell numeric>₹{item.rate || item.selling_rate}</DataTable.Cell>
                                    <DataTable.Cell numeric>₹{item.taxAmount || item.tax_amount}</DataTable.Cell>
                                    <DataTable.Cell numeric>
                                        ₹{item?.amount}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </Card.Content>
                </Card>

                {/* Totals */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.totalRow}>
                            <Text variant="bodyMedium">Taxable Amount</Text>
                            <Text variant="bodyMedium">
                                ₹{invoice.taxableAmount || invoice.total_tax}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text variant="bodyMedium">CGST</Text>
                            <Text variant="bodyMedium">₹{invoice.cgst || invoice.cgst_total}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text variant="bodyMedium">SGST</Text>
                            <Text variant="bodyMedium">₹{invoice.sgst || invoice.sgst_total}</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text variant="titleLarge" style={styles.totalLabel}>
                                Total Amount
                            </Text>
                            <Text variant="titleLarge" style={styles.totalAmount}>
                                ₹{invoice.totalAmount || invoice.total_amount}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text variant="bodyMedium">Received Amount</Text>
                            <Text variant="bodyMedium">
                                ₹{invoice.receivedAmount || 0}
                            </Text>
                        </View>
                        <Text variant="bodySmall" style={styles.amountWords}>
                            {convertAmountToWords(invoice.totalAmount)}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Terms */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleSmall" style={styles.termsTitle}>
                            TERMS AND CONDITIONS
                        </Text>
                        <Text variant="bodySmall" style={styles.termsText}>
                            • Please check stock properly before taking the stock
                        </Text>
                        <Text variant="bodySmall" style={styles.termsText}>
                            • Damaged items will not be taken back
                        </Text>
                    </Card.Content>
                </Card>

                <View style={styles.bottomSpace} />
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                {formType !== "edit" && <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.actionButton}>
                    Edit
                </Button>}
                <Button
                    mode="contained-tonal"
                    onPress={handleGeneratePDF}
                    loading={generating}
                    disabled={generating}
                    icon="file-pdf-box"
                    style={styles.actionButton}>
                    PDF
                </Button>
                {formType !== "edit" && <Button
                    mode="contained"
                    onPress={handleSaveInvoice}
                    icon="check"
                    style={styles.actionButton}>
                    Save
                </Button>}

                <QrGenerator
                    value={`upi://pay?pa=${business?.upi_id}&pn=${business?.name}`}
                    onGenerated={setQrBase64}
                />
            </View>
        </View>
    );
};

export default InvoicePreviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    previewContainer: {
        flex: 1,
    },
    card: {
        margin: 12,
    },
    businessName: {
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
    },
    highlight: {
        color: '#2196F3',
        fontWeight: "900"
    },
    businessInfo: {
        textAlign: 'center',
        color: '#666',
        marginTop: 2,
    },
    invoiceTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    detailValue: {
        fontWeight: '600',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    customerInfo: {
        color: '#666',
        marginTop: 2,
    },
    itemSubtext: {
        color: '#666',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    divider: {
        marginVertical: 8,
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalAmount: {
        fontWeight: 'bold',
        color: '#2196F3',
    },
    amountWords: {
        marginTop: 8,
        fontStyle: 'italic',
        color: '#666',
    },
    termsTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    termsText: {
        color: '#666',
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 8,
    },
    actionButton: {
        flex: 1,
    },
    bottomSpace: {
        height: 20,
    },
})