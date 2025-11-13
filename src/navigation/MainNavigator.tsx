import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Spacing } from '@constants/index';
import { useTaskModal } from '@/contexts/TaskModalContext';
import { useTodoModal } from '@/contexts/TodoModalContext';
import { useHabitModal } from '@/contexts/HabitModalContext';

// Screens
import TodoScreen from '@screens/TodoScreen';
import TimelineScreen from '@screens/TimelineScreen';
import HabitsScreen from '@screens/HabitsScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// FAB Color Configuration - Maps screen names to colors
const FAB_COLORS: Record<string, string> = {
  Timeline: Colors.primary.main,      // #4A90E2 - Blue for scheduled tasks
  Todo: Colors.accent.teal,           // #26A69A - Teal for unscheduled todos
  Habits: Colors.accent.orange,       // #FFA726 - Orange for habits/energy
  Settings: Colors.primary.main,      // Default blue
};

// Helper to get color index for interpolation
const getColorIndex = (route?: string): number => {
  switch (route) {
    case 'Timeline':
      return 0;
    case 'Todo':
      return 1;
    case 'Habits':
      return 2;
    case 'Settings':
    default:
      return 0; // Default to Timeline color
  }
};

// Custom FAB Button Component
function FABButton({
  onPress,
  backgroundColor,
  shadowColor
}: {
  onPress: () => void;
  backgroundColor: Animated.AnimatedInterpolation<string | number>;
  shadowColor: Animated.AnimatedInterpolation<string | number>;
}) {
  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.fab, { backgroundColor, shadowColor }]}>
        <View style={styles.fabInner}>
          <View style={styles.plusIcon}>
            <View style={styles.plusHorizontal} />
            <View style={styles.plusVertical} />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// FAB Wrapper that has access to modal contexts
function FABWrapper({ currentRoute }: { currentRoute?: string }) {
  const { openModal: openTaskModal } = useTaskModal();
  const { openModal: openTodoModal } = useTodoModal();
  const { openCreateModal: openHabitModal } = useHabitModal();

  // Animated value for color interpolation
  const colorAnim = useRef(new Animated.Value(getColorIndex(currentRoute))).current;
  const prevRoute = useRef(currentRoute);

  // Animate color when route changes
  useEffect(() => {
    if (prevRoute.current !== currentRoute) {
      Animated.timing(colorAnim, {
        toValue: getColorIndex(currentRoute),
        duration: 200,
        useNativeDriver: false, // Color animations don't support native driver
      }).start();
      prevRoute.current = currentRoute;
    }
  }, [currentRoute]);

  // Interpolate background color
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      FAB_COLORS.Timeline,    // 0: Blue
      FAB_COLORS.Todo,        // 1: Teal
      FAB_COLORS.Habits,      // 2: Orange
    ],
  });

  // Shadow color matches background
  const shadowColor = backgroundColor;

  const handlePress = () => {
    if (currentRoute === 'Todo') {
      openTodoModal();
    } else if (currentRoute === 'Timeline') {
      openTaskModal();
    } else if (currentRoute === 'Habits') {
      openHabitModal();
    } else {
      openTaskModal(); // Default
    }
  };

  return (
    <FABButton
      onPress={handlePress}
      backgroundColor={backgroundColor}
      shadowColor={shadowColor}
    />
  );
}

// Placeholder component for the center tab (won't be visible)
function PlaceholderScreen() {
  return null;
}

export default function MainNavigator() {
  const [currentRoute, setCurrentRoute] = React.useState<string>('Timeline');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.navigation.active,
        tabBarInactiveTintColor: Colors.navigation.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingBottom: Platform.OS === 'ios' ? 4 : 8,
        },
      }}
      screenListeners={{
        state: (e) => {
          // Update current route when tab changes
          const data = e.data as any;
          if (data?.state) {
            const index = data.state.index;
            const routeName = data.state.routes[index]?.name;
            if (routeName && routeName !== 'Add') {
              setCurrentRoute(routeName);
            }
          }
        },
      }}
    >
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.calendarIcon, { borderColor: color }]}>
                <View style={[styles.calendarTop, { backgroundColor: color }]} />
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.checkIcon, { borderColor: color }]}>
                <View style={[styles.checkMark, { backgroundColor: color }]} />
              </View>
            </View>
          ),
        }}
      />

      {/* Center placeholder for FAB */}
      <Tab.Screen
        name="Add"
        component={PlaceholderScreen}
        options={{
          tabBarButton: () => <FABWrapper currentRoute={currentRoute} />,
          tabBarLabel: () => null,
        }}
      />

      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.targetIcon, { borderColor: color }]}>
                <View style={[styles.targetInner, { borderColor: color }]} />
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.gearIcon, { borderColor: color }]}>
                <View style={[styles.gearCenter, { backgroundColor: color }]} />
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 64,
    backgroundColor: Colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.mediumGray,
    paddingTop: Spacing.sm,
  },

  // FAB styles
  fabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    // backgroundColor: Dynamic via animated prop
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: Dynamic via animated prop
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 4,
    borderColor: Colors.neutral.white,
  },
  fabInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: Colors.neutral.white,
    borderRadius: 2,
  },
  plusVertical: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: Colors.neutral.white,
    borderRadius: 2,
  },

  // Icon styles
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    width: 8,
    height: 4,
    transform: [{ rotate: '-45deg' }],
  },
  calendarIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 3,
  },
  calendarTop: {
    width: '100%',
    height: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  targetIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  gearIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
