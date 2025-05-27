import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const getCategoryIcon = (category) => {
  const icons = {
    food: 'restaurant-outline',
    transport: 'car-outline',
    shopping: 'cart-outline',
    bills: 'receipt-outline',
    entertainment: 'game-controller-outline',
    health: 'medical-outline',
    education: 'school-outline',
    travel: 'airplane-outline',
    other: 'ellipsis-horizontal-outline',
  };
  return icons[category] || 'pricetag-outline';
};

const getCategoryColor = (category) => {
  const colors = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    shopping: '#45B7D1',
    bills: '#96CEB4',
    entertainment: '#FFEEAD',
    health: '#D4A5A5',
    education: '#9B59B6',
    travel: '#3498DB',
    other: '#95A5A6',
  };
  return colors[category] || '#95A5A6';
};

const ExpenseItem = ({ expense }) => {
  const icon = getCategoryIcon(expense.category);
  const color = getCategoryColor(expense.category);

  return (
    <View style={styles.item}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.details}>
        <Text style={styles.category}>{expense.category}</Text>
        <Text style={styles.date}>{expense.date}</Text>
      </View>
      <Text style={styles.amount}>₹{expense.amount}</Text>
    </View>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
});
