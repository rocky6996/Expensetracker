import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ViewExpensesScreen() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const loadExpenses = async () => {
      const stored = await AsyncStorage.getItem('expenses');
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
    };
    loadExpenses();
  }, []);

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity style={styles.expenseItem}>
      <View style={styles.expenseIcon}>
        <Ionicons name="receipt-outline" size={24} color="#3498db" />
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
      <Text style={styles.expenseAmount}>₹{item.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Expenses</Text>
        <Text style={styles.subtitle}>Track your spending history</Text>
      </View>

      {expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyStateText}>No expenses yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first expense to get started</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
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
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#23243A',
    borderBottomWidth: 1,
    borderBottomColor: '#23243A',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A4B8',
  },
  listContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23243A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#35364A',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#181A20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: '#A0A4B8',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F8CFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#A0A4B8',
    textAlign: 'center',
  },
});
