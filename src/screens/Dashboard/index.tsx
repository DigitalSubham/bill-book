import type React from "react"
import { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl } from "react-native"
import { Card, Text, FAB as Fab, Chip, Avatar, IconButton, Divider } from "react-native-paper"
import { useSelector } from "react-redux"
import { LineChart } from "react-native-chart-kit"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList, DashboardStats, Invoice } from "../../types"
import { useQuery } from "@tanstack/react-query"
import { getProfileApi } from "../../apis/authApi"

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">

interface Props {
    navigation: DashboardScreenNavigationProp
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false)
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalInvoices: 0,
        pendingAmount: 0,
        lowStockItems: 0,
        todaySales: 0,
        monthSales: 0,
    })

    const invoices = useSelector((state: any) => state.invoices.list) as Invoice[]
    const products = useSelector((state: any) => state.products.list)
    const { data: business } = useQuery({
        queryKey: ['business'],
        queryFn: getProfileApi,
    })


    useEffect(() => {
        calculateStats()
    }, [invoices, products])

    const calculateStats = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
        const totalInvoices = invoices.length
        const pendingAmount = invoices
            .filter((inv) => inv.status === "pending" || inv.status === "partial")
            .reduce((sum, inv) => sum + (inv.totalAmount - inv.receivedAmount), 0)

        const lowStockItems = products.filter((p: any) => p.minStock && p.stock <= p.minStock).length

        const todaySales = invoices
            .filter((inv) => new Date(inv.invoiceDate) >= today)
            .reduce((sum, inv) => sum + inv.totalAmount, 0)

        const monthSales = invoices
            .filter((inv) => new Date(inv.invoiceDate) >= startOfMonth)
            .reduce((sum, inv) => sum + inv.totalAmount, 0)

        setStats({
            totalSales,
            totalInvoices,
            pendingAmount,
            lowStockItems,
            todaySales,
            monthSales,
        })
    }

    const onRefresh = async () => {
        setRefreshing(true)
        calculateStats()
        setTimeout(() => setRefreshing(false), 1000)
    }

    const sortedInvoices = [...invoices].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
    })

    const recentInvoices = sortedInvoices.slice(0, 5)


    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date
    })

    const chartData = last7Days.map((date) => {
        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)

        const daySales = invoices
            .filter((inv) => {
                const invDate = new Date(inv.invoiceDate)
                return invDate >= dayStart && invDate <= dayEnd
            })
            .reduce((sum, inv) => sum + inv.totalAmount, 0)

        return daySales
    })

    const chartLabels = last7Days.map((date) => {
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        return `${day}/${month}`
    })

    return (
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.gradientHeader}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text variant="headlineMedium" style={styles.welcomeText}>
                                {business?.name || "Welcome"}
                            </Text>
                            <Text variant="bodyMedium" style={styles.dateText}>
                                {new Date().toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </Text>
                        </View>
                        <IconButton
                            icon="cog"
                            size={26}
                            iconColor="#fff"
                            style={styles.settingsBtn}
                            onPress={() => navigation.navigate("BusinessSettings")}
                        />
                    </View>
                </View>

                <View style={styles.primaryStatsContainer}>
                    <Card style={[styles.primaryStatCard, { backgroundColor: "#1E7BE6" }]}>
                        <Card.Content style={styles.primaryStatContent}>
                            <View style={styles.primaryStatHeader}>
                                <Text style={styles.primaryStatLabel}>Total Sales</Text>
                                <Avatar.Icon size={40} icon="currency-inr" style={styles.primaryIconOverlay} />
                            </View>
                            <Text style={styles.primaryStatValue}>₹{(stats.totalSales / 100000)?.toFixed(1)}L</Text>
                            <Text style={styles.primaryStatSubtext}>All time revenue</Text>
                        </Card.Content>
                    </Card>

                    <Card style={[styles.primaryStatCard, { backgroundColor: "#8B5CF6" }]}>
                        <Card.Content style={styles.primaryStatContent}>
                            <View style={styles.primaryStatHeader}>
                                <Text style={styles.primaryStatLabel}>Invoices</Text>
                                <Avatar.Icon size={40} icon="file-document" style={styles.primaryIconOverlay} />
                            </View>
                            <Text style={styles.primaryStatValue}>{stats.totalInvoices}</Text>
                            <Text style={styles.primaryStatSubtext}>Total created</Text>
                        </Card.Content>
                    </Card>
                </View>

                <View style={styles.secondaryStatsRow}>
                    <Card style={styles.secondaryCard}>
                        <Card.Content style={styles.secondaryContent}>
                            <View style={styles.secondaryIcon}>
                                <Text style={{ fontSize: 20 }}>⏳</Text>
                            </View>
                            <Text style={styles.secondaryLabel}>Pending</Text>
                            <Text style={styles.secondaryValue}>₹{(stats.pendingAmount / 1000)?.toFixed(0)}K</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.secondaryCard}>
                        <Card.Content style={styles.secondaryContent}>
                            <View style={styles.secondaryIcon}>
                                <Text style={{ fontSize: 20 }}>📦</Text>
                            </View>
                            <Text style={styles.secondaryLabel}>Low Stock</Text>
                            <Text style={styles.secondaryValue}>{stats.lowStockItems}</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.secondaryCard}>
                        <Card.Content style={styles.secondaryContent}>
                            <View style={styles.secondaryIcon}>
                                <Text style={{ fontSize: 20 }}>📈</Text>
                            </View>
                            <Text style={styles.secondaryLabel}>Today</Text>
                            <Text style={styles.secondaryValue}>₹{(stats.todaySales / 1000)?.toFixed(0)}K</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Card style={styles.chartCard}>
                    <Card.Content style={styles.chartContent}>
                        <View style={styles.chartHeader}>
                            <View>
                                <Text style={styles.chartTitle}>Sales Trend</Text>
                                <Text style={styles.chartSubtitle}>Last 7 days performance</Text>
                            </View>
                        </View>
                        <LineChart
                            data={{
                                labels: chartLabels,
                                datasets: [
                                    {
                                        data: chartData.length > 0 ? chartData : [0],
                                    },
                                ],
                            }}
                            width={Dimensions.get("window").width - 48}
                            height={200}
                            chartConfig={{
                                backgroundColor: "transparent",
                                backgroundGradientFrom: "#f8f9fa",
                                backgroundGradientTo: "#f8f9fa",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
                                style: {
                                    borderRadius: 12,
                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#0066CC",
                                },
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </Card.Content>
                </Card>

                <View style={styles.monthStatsContainer}>
                    <Card style={styles.monthCard}>
                        <Card.Content>
                            <Text style={styles.monthLabel}>This Month</Text>
                            <Text style={styles.monthValue}>₹{(stats.monthSales / 100000)?.toFixed(2)}L</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Card style={styles.recentCard}>
                    <Card.Content style={styles.recentCardContent}>
                        <View style={styles.recentHeader}>
                            <Text style={styles.recentTitle}>Recent Invoices</Text>
                            <IconButton icon="arrow-right" size={20} onPress={() => navigation.getParent()?.navigate("InvoicesTab")} />
                        </View>

                        {recentInvoices.length > 0 ? (
                            recentInvoices.map((invoice, index) => (
                                <View key={invoice.id}>
                                    <View
                                        style={styles.invoiceItemModern}
                                        onTouchEnd={() =>
                                            navigation.getParent()?.navigate("InvoicesTab")
                                        }
                                    >
                                        <View style={styles.invoiceLeftModern}>
                                            <View style={styles.invoiceNumberBadge}>
                                                <Text style={styles.invoiceNumberText}>#{invoice.invoiceNo}</Text>
                                            </View>
                                            <View style={styles.invoiceDetailsModern}>
                                                <Text style={styles.invoiceCustomerModern}>{invoice.customer.name}</Text>
                                                <Text style={styles.invoiceDateModern}>
                                                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.invoiceRightModern}>
                                            <Text style={styles.invoiceAmountModern}>₹{invoice.totalAmount?.toFixed(0)}</Text>
                                            <Chip
                                                mode="flat"
                                                style={[styles.statusChipModern, { backgroundColor: getStatusColor(invoice.status) }]}
                                                textStyle={styles.chipTextModern}
                                            >
                                                {invoice.status.toUpperCase()}
                                            </Chip>
                                        </View>
                                    </View>
                                    {index < recentInvoices.length - 1 && <Divider style={styles.dividerModern} />}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No invoices yet</Text>
                        )}
                    </Card.Content>
                </Card>

                <View style={styles.quickActionsModern}>
                    <Card
                        style={[styles.actionCardModern, { backgroundColor: "#DCF4FF" }]}
                        onPress={() => navigation.getParent()?.navigate("InvoicesTab", {
                            screen: "CreateInvoice",
                        })}
                    >
                        <Card.Content style={styles.actionContentModern}>
                            <View style={styles.actionIconBg}>
                                <Text style={styles.actionEmoji}>📝</Text>
                            </View>
                            <Text style={styles.actionLabelModern}>New Invoice</Text>
                        </Card.Content>
                    </Card>

                    <Card
                        style={[styles.actionCardModern, { backgroundColor: "#F3E8FF" }]}
                        onPress={() => navigation.getParent()?.navigate("ProductsTab")}
                    >
                        <Card.Content style={styles.actionContentModern}>
                            <View style={styles.actionIconBg}>
                                <Text style={styles.actionEmoji}>📦</Text>
                            </View>
                            <Text style={styles.actionLabelModern}>Products</Text>
                        </Card.Content>
                    </Card>

                    <Card
                        style={[styles.actionCardModern, { backgroundColor: "#DCF4FF" }]}
                        onPress={() => navigation.getParent()?.navigate("CustomersTab")
                        }
                    >
                        <Card.Content style={styles.actionContentModern}>
                            <View style={styles.actionIconBg}>
                                <Text style={styles.actionEmoji}>👥</Text>
                            </View>
                            <Text style={styles.actionLabelModern}>Customers</Text>
                        </Card.Content>
                    </Card>
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>

            <Fab
                icon="plus"
                style={styles.fabModern}
                onPress={() => navigation.getParent()?.navigate("InvoicesTab", {
                    screen: "CreateInvoice",
                })}
                label="New Invoice"
            />
        </View>
    )
}

const getStatusColor = (status: string): string => {
    switch (status) {
        case "paid":
            return "#10B981"
        case "pending":
            return "#F59E0B"
        case "partial":
            return "#3B82F6"
        case "overdue":
            return "#EF4444"
        default:
            return "#9CA3AF"
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    gradientHeader: {
        backgroundColor: "#a864f1ff",
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    welcomeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 24,
    },
    dateText: {
        color: "#E0F0FF",
        marginTop: 4,
        fontWeight: "500",
    },
    settingsBtn: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    primaryStatsContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        gap: 12,
        marginTop: -12,
        marginBottom: 16,
    },
    primaryStatCard: {
        flex: 1,
        borderRadius: 16,
        elevation: 4,
    },
    primaryStatContent: {
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    primaryStatHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    primaryStatLabel: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 12,
        fontWeight: "600",
    },
    primaryIconOverlay: {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    primaryStatValue: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
    },
    primaryStatSubtext: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
    },
    secondaryStatsRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        gap: 10,
        marginBottom: 16,
    },
    secondaryCard: {
        flex: 1,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F0F4F8",
    },
    secondaryContent: {
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    secondaryIcon: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    secondaryLabel: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "500",
        marginBottom: 4,
    },
    secondaryValue: {
        fontSize: 16,
        color: "#1E7BE6",
        fontWeight: "700",
    },
    chartCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F0F4F8",
    },
    chartContent: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    chartHeader: {
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E7BE6",
    },
    chartSubtitle: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 2,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 12,
        alignSelf: "center",
    },
    monthStatsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    monthCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        elevation: 1,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: "#F0F4F8",
    },
    monthLabel: {
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    monthValue: {
        fontSize: 20,
        color: "#1E7BE6",
        fontWeight: "700",
        marginTop: 4,
    },
    recentCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F0F4F8",
    },
    recentCardContent: {
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    recentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E7BE6",
    },
    invoiceItemModern: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 12,
        alignItems: "center",
    },
    invoiceLeftModern: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    invoiceNumberBadge: {
        backgroundColor: "#E0F0FF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    invoiceNumberText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#1E7BE6",
    },
    invoiceDetailsModern: {
        flex: 1,
    },
    invoiceCustomerModern: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1F2937",
    },
    invoiceDateModern: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 2,
    },
    invoiceRightModern: {
        alignItems: "flex-end",
        gap: 6,
    },
    invoiceAmountModern: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F2937",
    },
    statusChipModern: {
        height: 24,
        minWidth: 60,
    },
    chipTextModern: {
        fontSize: 10,
        fontWeight: "600",
        color: "#fff",
    },
    dividerModern: {
        marginHorizontal: 12,
        backgroundColor: "#E5E7EB",
    },
    emptyText: {
        textAlign: "center",
        color: "#9CA3AF",
        paddingVertical: 24,
        fontSize: 14,
    },
    quickActionsModern: {
        flexDirection: "row",
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    actionCardModern: {
        flex: 1,
        borderRadius: 12,
        elevation: 1,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F0F4F8",
    },
    actionContentModern: {
        alignItems: "center",
        paddingVertical: 12,
    },
    actionIconBg: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    actionEmoji: {
        fontSize: 24,
    },
    actionLabelModern: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1F2937",
        textAlign: "center",
    },
    fabModern: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#1E7BE6",
    },
    bottomSpace: {
        height: 80,
    },
})

export default DashboardScreen
