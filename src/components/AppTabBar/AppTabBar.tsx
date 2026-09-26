import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/components/AppTabBar/styles';
import { CustomText } from '@/components/CustomText';
import { useTheme } from '@/theme';

const tabIcons = {
  performance: { ios: 'chart.line.uptrend.xyaxis', android: 'show_chart', web: 'show_chart' },
  position: { ios: 'briefcase', android: 'work', web: 'work' },
  orders: { ios: 'list.bullet.rectangle', android: 'receipt_long', web: 'receipt_long' },
  rules: { ios: 'checklist', android: 'rule', web: 'rule' },
} as const;

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export function AppTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const icon = tabIcons[route.name as keyof typeof tabIcons];
        const color = focused ? colors.primary : colors.textMuted;

        return (
          <Pressable
            key={route.key}
            testID={`tab-${route.name}`}
            nativeID={`tab-${route.name}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            style={styles.item}
          >
            {icon ? <SymbolView name={icon} tintColor={color} size={22} /> : null}
            <CustomText
              id={`tab-${route.name}-label`}
              variant="label"
              style={[styles.label, { color }]}
            >
              {label}
            </CustomText>
          </Pressable>
        );
      })}
    </View>
  );
}
