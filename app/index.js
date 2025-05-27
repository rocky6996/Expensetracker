import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animated gradient progress
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);
  }, []);

  // Animated gradient colors
  const animatedGradientStyle = useAnimatedStyle(() => {
    const color1 = interpolateColor(progress.value, [0, 1], ['#4F8CFF', '#8F5CFF']);
    const color2 = interpolateColor(progress.value, [0, 1], ['#23243A', '#4F8CFF']);
    return {};
  });

  // Animated title fade-in
  const titleOpacity = useSharedValue(0);
  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 1200 });
  }, []);
  const animatedTitleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

  // Get current colors for gradient
  const color1 = interpolateColor(progress.value, [0, 1], ['#4F8CFF', '#8F5CFF']);
  const color2 = interpolateColor(progress.value, [0, 1], ['#23243A', '#4F8CFF']);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#181A20' }}>
      <StatusBar style="light" backgroundColor="#181A20" />
      {/* Curved colored background */}
      <View
        style={{
          height: 180, // Initial height for the curved background
          backgroundColor: '#6C47FF',
          borderBottomLeftRadius: 60,
          borderBottomRightRadius: 60,
        }}
      />
      {/* Main content container with negative margin to overlap curved background */}
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <Animated.View 
          style={[
            styles.header, 
            animatedGradientStyle, 
            { 
              zIndex: 1, 
              marginTop: 0, 
              paddingTop: insets.top + 24, // Increased top padding to push content down
              paddingBottom: 24, // Increased bottom padding
              paddingHorizontal: 24, // Increased horizontal padding
            }
          ]}
        >
          <LinearGradient
            colors={[color1, color2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.Text style={[styles.title, animatedTitleStyle]}>Expense Tracker</Animated.Text>
          <Text style={styles.subtitle}>Manage your expenses with ease</Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/add-expense')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#4F8CFF', '#357ABD']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Add Expense</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/view-expenses')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#23243A', '#35364A']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="list-outline" size={24} color="#4F8CFF" />
              <Text style={[styles.buttonText, { color: '#4F8CFF' }]}>View Expenses</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/analytics')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#23243A', '#4F8CFF']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="analytics-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Analytics</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    paddingHorizontal: 24, // Match header horizontal padding
    paddingTop: 0, // Ensure no extra top padding on container
  },
  header: {
    marginBottom: 48, // Increased space between header and buttons
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'flex-start', // Align title/subtitle to the left within header
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8, // Reduced space between title and subtitle
    letterSpacing: -0.5,
    zIndex: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A4B8',
    fontWeight: '500',
    zIndex: 1,
  },
  buttonContainer: {
    gap: 16, // Reduced space between buttons
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export const options = {
  headerShown: false,
};
