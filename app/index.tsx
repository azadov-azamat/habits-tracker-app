import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useHabitsStore, hasMainHabit } from '@/store/habits-store';

export default function Index() {
  const completed = useOnboardingStore((s) => s.completed);
  const hasHabit = useHabitsStore(hasMainHabit);

  if (!completed || !hasHabit) {
    return <Redirect href="/(onboarding)/welcome" />;
  }
  return <Redirect href="/(tabs)" />;
}
