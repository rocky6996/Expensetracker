import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const EXPENSE_CATEGORIES = [
  { id: 'food', name: ' Dining', icon: 'restaurant-outline', color: '#FF6B6B' },
  { id: 'transport', name: '', icon: 'car-outline', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', icon: 'cart-outline', color: '#45B7D1' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'receipt-outline', color: '#96CEB4' },
  { id: 'entertainment', name: 'Activities', icon: 'game-controller-outline', color: '#FFEEAD' },
  { id: 'health', name: 'Health', icon: 'medical-outline', color: '#D4A5A5' },
  { id: 'education', name: 'Education', icon: 'school-outline', color: '#9B59B6' },
  { id: 'travel', name: 'Travel', icon: 'airplane-outline', color: '#3498DB' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#95A5A6' },
];

export default function AnalyticsScreen() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [categoryData, setCategoryData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budget, setBudget] = useState(50000); // Default monthly budget
  const [editBudget, setEditBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  useEffect(() => {
    loadExpenses();
    loadBudget();
  }, []);

  const loadExpenses = async () => {
    try {
      const stored = await AsyncStorage.getItem('expenses');
      if (stored) {
        const parsedExpenses = JSON.parse(stored);
        setExpenses(parsedExpenses);
        processExpenseData(parsedExpenses);
      } else {
        // Initialize with empty data if no expenses exist
        setExpenses([]);
        processExpenseData([]);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      // Initialize with empty data on error
      setExpenses([]);
      processExpenseData([]);
    }
  };

  const loadBudget = async () => {
    try {
      const storedBudget = await AsyncStorage.getItem('monthlyBudget');
      if (storedBudget) {
        setBudget(Number(storedBudget));
      }
    } catch (e) {
      // ignore
    }
  };

  const saveBudget = async (newBudget) => {
    try {
      await AsyncStorage.setItem('monthlyBudget', String(newBudget));
      setBudget(Number(newBudget));
    } catch (e) {
      // ignore
    }
  };

  const processExpenseData = (expenseData) => {
    if (!expenseData || expenseData.length === 0) {
      // Set default values when no data exists
      setTotalSpent(0);
      setMonthlyData({
        labels: [],
        datasets: [{ data: [] }]
      });
      setCategoryData([]);
      return;
    }

    // Calculate total spent
    const total = expenseData.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    setTotalSpent(total);

    // Process monthly data
    const monthly = {};
    expenseData.forEach(expense => {
      if (expense.date) {
        const month = expense.date.substring(0, 7); // YYYY-MM
        monthly[month] = (monthly[month] || 0) + (expense.amount || 0);
      }
    });

    const monthlyChartData = {
      labels: Object.keys(monthly).slice(-6), // Last 6 months
      datasets: [{
        data: Object.values(monthly).slice(-6),
      }],
    };
    setMonthlyData(monthlyChartData);

    // Process category data
    const categoryTotals = {};
    expenseData.forEach(expense => {
      if (expense.category) {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + (expense.amount || 0);
      }
    });

    const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: EXPENSE_CATEGORIES.find(c => c.id === category)?.name || category,
      amount,
      color: EXPENSE_CATEGORIES.find(c => c.id === category)?.color || '#95A5A6',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
      legendFontWeight: 'bold',
      legendFontFamily: 'Poppins-Bold',

    }));

    setCategoryData(pieData);
  };

  const chartConfig = {
    backgroundGradientFrom: '#23243A',
    backgroundGradientTo: '#23243A',
    color: (opacity = 1) => `rgba(79, 140, 255, ${opacity})`,
    labelColor: () => '#fff',
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4F8CFF',
    },
    propsForBackgroundLines: {
      stroke: '#35364A',
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Analytics</Text>
        <Text style={styles.subtitle}>Track your spending patterns</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>₹{totalSpent.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.summaryCard} onPress={() => { setTempBudget(String(budget)); setEditBudget(true); }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.summaryLabel}>Monthly Budget</Text>
              <Text style={styles.summaryValue}>₹{budget.toLocaleString()}</Text>
            </View>
            <Ionicons name="pencil-outline" size={22} color="#7f8c8d" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={editBudget}
        transparent
        animationType="fade"
        onRequestClose={() => setEditBudget(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.budgetModalContainer}>
            <Text style={styles.budgetModalTitle}>Set Monthly Budget</Text>
            <TextInput
              style={styles.budgetInput}
              keyboardType="numeric"
              value={tempBudget}
              onChangeText={setTempBudget}
              placeholder="Enter budget (₹)"
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setEditBudget(false)} style={styles.budgetModalButton}>
                <Text style={styles.budgetModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (tempBudget && !isNaN(Number(tempBudget))) {
                    saveBudget(tempBudget);
                    setEditBudget(false);
                  }
                }}
                style={[styles.budgetModalButton, { backgroundColor: '#3498db', marginLeft: 12 }]}
              >
                <Text style={[styles.budgetModalButtonText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {expenses.length > 0 ? (
        <>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Spending Trend</Text>
            {monthlyData.labels.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={monthlyData}
                  width={Math.max(Dimensions.get('window').width - 48, monthlyData.labels.length * 60)}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </ScrollView>
            ) : (
              <Text style={styles.noDataText}>No monthly data available</Text>
            )}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Category Breakdown</Text>
            {categoryData.length > 0 ? (
              <>
                <PieChart
                  data={categoryData}
                  width={Dimensions.get('window').width - 48}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  style={styles.pieChart}
                  hasLegend={false}
                />
                <View style={styles.pieLegendContainer}>
                  {categoryData.map((item, idx) => (
                    <View key={idx} style={styles.pieLegendRow}>
                      <View style={[styles.pieLegendColor, { backgroundColor: item.color }]} />
                      <Text style={styles.pieLegendLabel}>{item.name}</Text>
                      <Text style={styles.pieLegendValue}>₹{item.amount.toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>No category data available</Text>
            )}
          </View>

          {categoryData.length > 0 && (
            <View style={styles.categoryList}>
              {categoryData.map((item, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.categoryAmount}>₹{item.amount.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyStateText}>No expenses yet</Text>
          <Text style={styles.emptyStateSubtext}>Add some expenses to see analytics</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#23243A',
    borderBottomWidth: 1,
    borderBottomColor: '#23243A',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A4B8',
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    marginTop: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#23243A',
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#A0A4B8',
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  chartCard: {
    backgroundColor: '#23243A',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    padding: 20,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#23243A',
  },
  pieChart: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#23243A',
    alignSelf: 'center',
  },
  pieLegendContainer: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  pieLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pieLegendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  pieLegendLabel: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  pieLegendValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F8CFF',
    marginLeft: 8,
  },
  categoryList: {
    backgroundColor: '#23243A',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#23243A',
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F8CFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#A0A4B8',
    textAlign: 'center',
    fontWeight: '500',
  },
  noDataText: {
    textAlign: 'center',
    color: '#A0A4B8',
    fontSize: 16,
    marginVertical: 24,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24,26,32,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetModalContainer: {
    backgroundColor: '#23243A',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  budgetModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: '#35364A',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#181A20',
  },
  budgetModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#35364A',
  },
  budgetModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 