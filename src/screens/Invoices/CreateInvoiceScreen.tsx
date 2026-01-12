import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Card,
  IconButton,
  Divider,
  Portal,
  Modal,
  List,
  Searchbar,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {
  calculateItemAmount,
  calculateInvoiceTotals,
} from '../../utils/calculations';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerType, DatePickerType, formTypeEnum, InvoiceBase, InvoiceItem, ProductType, RootStackParamList } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../apis/productApis';
import { fetchCustomer } from '../../apis/customerApis';

type AddCustomerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList
>;

interface Props {
  navigation: AddCustomerScreenNavigationProp;
}

const CreateInvoiceScreen: React.FC<Props> = ({ navigation }) => {
  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [datePickerType, setDatePickerType] =
    useState<DatePickerType>('invoice');

  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [receivedAmount, setReceivedAmount] = useState<string>('0');

  const { data: customers = [] } = useQuery<CustomerType[]>({
    queryKey: ['customers'],
    queryFn: fetchCustomer,
    staleTime: 5 * 60 * 1000,
  });

  const { data: products = [] } = useQuery<ProductType[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const filteredCustomers = customers.filter(
    (c: CustomerType) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile.includes(searchQuery),
  );

  const filteredProducts = products.filter((p: ProductType) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );


  const selectCustomer = (selectedCustomer: CustomerType) => {
    setCustomer(selectedCustomer)
    setShowCustomerModal(false);
    setSearchQuery('');
  };

  const addProduct = (product: ProductType) => {
    const existingItem = items.find(item => item.productId === product.id);

    if (existingItem) {
      updateQuantity(existingItem.productId, existingItem.quantity + 1);
    } else {
      const calc = calculateItemAmount(1, product.rate, product.taxRate);
      const newItem = {
        productId: product?.id,
        productName: product.name,
        quantity: 1,
        mrp: product.mrp,
        sellingRate: product.rate,
        taxRate: product.taxRate,
        taxAmount: calc.taxAmount,
        amount: calc.totalAmount,
      };
      setItems([...items, newItem]);
    }
    setShowProductModal(false);
    setSearchQuery('');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(
      items.map(item => {
        if (item.productId === productId) {
          const calc = calculateItemAmount(
            newQuantity,
            item.sellingRate,
            item.taxRate,
          );
          return {
            ...item,
            quantity: newQuantity,
            taxAmount: calc.taxAmount,
            amount: calc.totalAmount,
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };


  const totals = calculateInvoiceTotals(items);
  const handlePreviewInvoice = () => {
    if (!customer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one product');
      return;
    }

    const invoice: InvoiceBase = {
      customer,
      invoiceDate,
      dueDate,
      items,
      ...totals,
      receivedAmount: Number.parseFloat(receivedAmount) || 0,
      status:
        Number(receivedAmount) >= totals.totalAmount
          ? 'paid'
          : Number(receivedAmount) > 0
            ? 'partial'
            : 'pending',
    };
    navigation.navigate('InvoicePreview', { invoice, formType: formTypeEnum.ADD });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Customer Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Customer Details
            </Text>
            {customer ? (
              <View style={styles.customerInfo}>
                <View style={styles.customerDetails}>
                  <Text variant="bodyLarge">{customer.name}</Text>
                  <Text variant="bodySmall">{customer.mobile}</Text>
                  {!!customer.gst_number &&
                    <Text variant="bodySmall">{customer.gst_number}</Text>
                  }
                  {!!customer.address && (
                    <Text variant="bodySmall">{customer.address}</Text>
                  )}
                </View>
                <IconButton
                  icon="pencil"
                  onPress={() => setShowCustomerModal(true)}
                />
              </View>
            ) : (
              <Button
                mode="outlined"
                onPress={() => setShowCustomerModal(true)}
                icon="account-plus"
              >
                Select Customer
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Dates */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text variant="labelMedium">Invoice Date</Text>
                <TouchableOpacity
                  onPress={() => {
                    setDatePickerType('invoice');
                    setShowDatePicker(true);
                  }}
                >
                  <Text variant="bodyLarge" style={styles.dateText}>
                    {invoiceDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateField}>
                <Text variant="labelMedium">Due Date</Text>
                <TouchableOpacity
                  onPress={() => {
                    setDatePickerType('due');
                    setShowDatePicker(true);
                  }}
                >
                  <Text variant="bodyLarge" style={styles.dateText}>
                    {dueDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Items */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.itemsHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Items
              </Text>
              <Button
                mode="contained-tonal"
                icon="plus"
                onPress={() => setShowProductModal(true)}
              >
                Add Item
              </Button>
            </View>

            {items.map((item, index) => (
              <View key={item.productId}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text variant="bodyLarge">{item.productName}</Text>
                    <Text variant="bodySmall" style={styles.itemDetails}>
                      Rate: ₹{item.sellingRate} | Tax: {item.taxRate}%
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    />
                    <Text variant="bodyLarge" style={styles.quantity}>
                      {item.quantity}
                    </Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    />
                    <Text variant="bodyLarge" style={styles.amount}>
                      ₹{item.amount?.toFixed(2)}
                    </Text>
                    <IconButton
                      icon="delete"
                      iconColor="#d32f2f"
                      size={20}
                      onPress={() => removeItem(item.productId)}
                    />
                  </View>
                </View>
                {index < items.length - 1 && <Divider />}
              </View>
            ))}

            {items.length === 0 && (
              <Text variant="bodyMedium" style={styles.emptyText}>
                No items added yet
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Totals */}
        {items.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.totalRow}>
                <Text variant="bodyMedium">Subtotal</Text>
                <Text variant="bodyMedium">₹{totals.subtotal?.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text variant="bodyMedium">CGST</Text>
                <Text variant="bodyMedium">₹{totals.cgstTotal?.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text variant="bodyMedium">SGST</Text>
                <Text variant="bodyMedium">₹{totals.sgstTotal?.toFixed(2)}</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.totalRow}>
                <Text variant="titleLarge" style={styles.totalLabel}>
                  Total
                </Text>
                <Text variant="titleLarge" style={styles.totalAmount}>
                  ₹{totals.totalAmount?.toFixed(2)}
                </Text>
              </View>
              <TextInput
                label="Received Amount"
                value={receivedAmount}
                onChangeText={setReceivedAmount}
                keyboardType="numeric"
                mode="outlined"
                style={styles.receivedInput}
              />
            </Card.Content>
          </Card>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePreviewInvoice}
          disabled={!customer || items.length === 0}
          style={styles.saveButton}
        >
          Preview Invoice
        </Button>
      </View>

      {/* Customer Modal */}
      <Portal>
        <Modal
          visible={showCustomerModal}
          onDismiss={() => {
            setShowCustomerModal(false);
            setSearchQuery('');
          }}
          contentContainerStyle={styles.modal}
        >
          <Searchbar
            placeholder="Search customers"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <ScrollView style={styles.modalScroll}>
            {filteredCustomers.map(c => (
              <List.Item
                key={c.id}
                title={c.name}
                description={`${c.mobile} - ${c.gst_number || 'N/A'}`}

                onPress={() => selectCustomer(c)}
              />
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Product Modal */}
      <Portal>
        <Modal
          visible={showProductModal}
          onDismiss={() => {
            setShowProductModal(false);
            setSearchQuery('');
          }}
          contentContainerStyle={styles.modal}
        >
          <Searchbar
            placeholder="Search products"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <ScrollView style={styles.modalScroll}>
            {filteredProducts.map(p => (
              <List.Item
                key={p.id}
                title={p.name}
                description={`Rate: ₹${p.rate} | Stock: ${p.stock}`}
                onPress={() => addProduct(p)}
              />
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Date Picker */}
      <DatePicker
        modal
        open={showDatePicker}
        date={datePickerType === 'invoice' ? invoiceDate : dueDate}
        mode="date"
        onConfirm={date => {
          setShowDatePicker(false);
          if (datePickerType === 'invoice') {
            setInvoiceDate(date);
          } else {
            setDueDate(date);
          }
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateField: {
    flex: 1,
  },
  dateText: {
    marginTop: 4,
    color: '#2196F3',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemDetails: {
    color: '#666',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    minWidth: 30,
    textAlign: 'center',
  },
  amount: {
    minWidth: 80,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
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
  receivedInput: {
    marginTop: 12,
  },
  footer: {
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    paddingVertical: 6,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  searchbar: {
    marginBottom: 12,
  },
  modalScroll: {
    maxHeight: 400,
  },
  bottomSpace: {
    height: 20,
  },
});

export default CreateInvoiceScreen;
