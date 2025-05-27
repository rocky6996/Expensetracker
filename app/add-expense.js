import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Dining', icon: 'restaurant-outline' },
  { id: 'transport', name: 'Fuel', icon: 'car-outline' },
  { id: 'shopping', name: 'Shopping', icon: 'cart-outline' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'receipt-outline' },
  { id: 'entertainment', name: 'Activities', icon: 'game-controller-outline' },
  { id: 'health', name: 'Health ', icon: 'medical-outline' },
  { id: 'education', name: 'Education', icon: 'school-outline' },
  { id: 'travel', name: 'Travel', icon: 'airplane-outline' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline' },
];

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [note, setNote] = useState('');

  const handleAddExpense = async () => {
    if (!amount || !category || !date) {
      alert('Please fill in all fields');
      return;
    }

    const newExpense = {
      amount: parseFloat(amount),
      category,
      date,
      note,
      id: Date.now().toString(),
    };

    try {
      const existing = await AsyncStorage.getItem('expenses');
      const expenses = existing ? JSON.parse(existing) : [];
      expenses.push(newExpense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      alert('Expense saved successfully!');
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
    } catch (e) {
      console.error('Error saving expense:', e);
      alert('Failed to save expense. Please try again.');
    }
  };

  const onDayPress = (day) => {
    setDate(day.dateString);
    setShowCalendar(false);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        category === item.id && styles.selectedCategory
      ]}
      onPress={() => {
        setCategory(item.id);
        setShowCategories(false);
      }}
    >
      <Ionicons name={item.icon} size={24} color={category === item.id ? '#fff' : '#3498db'} />
      <Text style={[
        styles.categoryText,
        category === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Expense</Text>
        <Text style={styles.subtitle}>Enter your expense details below</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount (₹)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={30} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#fff"
              keyboardType="numeric"
              onChangeText={setAmount}
              value={amount}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity 
            style={styles.inputWrapper}
            onPress={() => setShowCategories(true)}
          >
            <Ionicons 
              name={EXPENSE_CATEGORIES.find(c => c.id === category)?.icon || 'pricetag-outline'} 
              size={30} 
              color="#7f8c8d" 
              style={styles.inputIcon} 
            />
            <Text style={[styles.input, !category && styles.placeholder]}>
              {EXPENSE_CATEGORIES.find(c => c.id === category)?.name || 'Select category'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity 
            style={styles.inputWrapper}
            onPress={() => setShowCalendar(true)}
          >
            <Ionicons name="calendar-outline" size={30} color="#7f8c8d" style={styles.inputIcon} />
            <Text style={[styles.input, !date && styles.placeholder]}>
              {date || 'Select date'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddExpense} activeOpacity={0.85}>
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="save-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Save Expense</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                [date]: { selected: true, selectedColor: '#4F8CFF' }
              }}
              theme={{
                backgroundColor: '#23243A',
                calendarBackground: '#23243A',
                textSectionTitleColor: '#A0A4B8',
                selectedDayBackgroundColor: '#4F8CFF',
                selectedDayTextColor: '#fff',
                todayTextColor: '#4F8CFF',
                dayTextColor: '#fff',
                textDisabledColor: '#35364A',
                monthTextColor: '#fff',
                indicatorColor: '#4F8CFF',
                arrowColor: '#4F8CFF',
                textDayFontWeight: '600',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
                borderRadius: 20,
              }}
              style={{ borderRadius: 20, overflow: 'hidden' }}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCategories}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategories(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.categoriesContainer}>
            <View style={styles.categoriesHeader}>
              <Text style={styles.categoriesTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategories(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={EXPENSE_CATEGORIES}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        </View>
      </Modal>
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
    paddingBottom: 300,
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
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A4B8',
    fontWeight: '500',
  },
  form: {
    padding: 20,
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23243A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#35364A',
    paddingHorizontal: 16,
    height: 56,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 12,
    color: '#4F8CFF',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 0,
    textAlignVertical: 'center',
  },
  placeholder: {
    color: '#E0E6F0',
    fontSize: 18,
    textAlignVertical: 'center',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 32,
    marginBottom: 24,
    alignSelf: 'stretch',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 0,
    backgroundColor: '#4F8CFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24,26,32,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#23243A',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  closeButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#4F8CFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
    color: '#fff',
    backgroundColor: '#23243A',
  },
  categoriesContainer: {
    backgroundColor: '#23243A',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#35364A',
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  categoriesList: {
    padding: 16,
  },
  categoryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#181A20',
    borderWidth: 1,
    borderColor: '#35364A',
  },
  selectedCategory: {
    backgroundColor: '#4F8CFF',
    borderColor: '#4F8CFF',
  },
  categoryText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});
