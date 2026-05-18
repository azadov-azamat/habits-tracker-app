import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useHabitsStore, hasMainHabit } from '@/store/habitsStore';

export default function Index() {
  const completed = useOnboardingStore((s) => s.completed);
  const hasHabit = useHabitsStore(hasMainHabit);

  if (!completed || !hasHabit) {
    return <Redirect href="/(onboarding)/welcome" />;
  }
  return <Redirect href="/(tabs)" />;
}
