import { supabase, HealthActivity } from '../lib/supabase';

export async function logActivity(
  activityType: 'water' | 'steps' | 'sleep',
  value: number,
  notes?: string
) {
  const { data, error } = await supabase
    .from('health_activities')
    .insert({
      activity_type: activityType,
      value,
      notes,
      logged_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTodayStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from('health_activities')
    .select('*')
    .gte('logged_at', today.toISOString())
    .lt('logged_at', tomorrow.toISOString())
    .order('logged_at', { ascending: false });

  if (error) throw error;

  const stats = {
    water: 0,
    steps: 0,
    sleep: 0,
  };

  data?.forEach((activity: HealthActivity) => {
    stats[activity.activity_type] += activity.value;
  });

  return stats;
}

export async function getActivitiesLastSevenDays() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('health_activities')
    .select('*')
    .gte('logged_at', sevenDaysAgo.toISOString())
    .order('logged_at', { ascending: false });

  if (error) throw error;
  return data as HealthActivity[];
}
