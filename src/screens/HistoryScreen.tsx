import { useState, useEffect } from 'react';
import { ArrowLeft, Droplets, Footprints, Moon, RefreshCw, Calendar } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { getActivitiesLastSevenDays } from '../services/healthService';
import { HealthActivity } from '../lib/supabase';

export function HistoryScreen() {
  const { navigateTo } = useNavigation();
  const [activities, setActivities] = useState<HealthActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await getActivitiesLastSevenDays();
      setActivities(data);
    } catch (err) {
      setError('Failed to load activities');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleRefresh = () => {
    loadActivities(true);
  };

  const groupActivitiesByDate = () => {
    const grouped: { [key: string]: HealthActivity[] } = {};

    activities.forEach((activity) => {
      const date = new Date(activity.logged_at);
      const dateKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    return grouped;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'water':
        return { Icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'steps':
        return { Icon: Footprints, color: 'text-green-600', bg: 'bg-green-100' };
      case 'sleep':
        return { Icon: Moon, color: 'text-purple-600', bg: 'bg-purple-100' };
      default:
        return { Icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'water':
        return 'Water';
      case 'steps':
        return 'Steps';
      case 'sleep':
        return 'Sleep';
      default:
        return type;
    }
  };

  const getActivityUnit = (type: string) => {
    switch (type) {
      case 'water':
        return 'glasses';
      case 'steps':
        return 'steps';
      case 'sleep':
        return 'hours';
      default:
        return '';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const groupedActivities = groupActivitiesByDate();
  const dates = Object.keys(groupedActivities);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Activity History</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-blue-100 mt-1">Last 7 days</p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading activities...</p>
          </div>
        ) : dates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Activities Yet</h3>
            <p className="text-gray-600 mb-6">Start logging your activities to see them here</p>
            <button
              onClick={() => navigateTo('log-activity')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Log Your First Activity
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">
                    {isToday(groupedActivities[date][0].logged_at) ? 'Today' : date}
                  </h2>
                  <span className="text-sm text-gray-500">
                    ({groupedActivities[date].length} {groupedActivities[date].length === 1 ? 'activity' : 'activities'})
                  </span>
                </div>

                <div className="space-y-2">
                  {groupedActivities[date].map((activity) => {
                    const { Icon, color, bg } = getActivityIcon(activity.activity_type);
                    return (
                      <div
                        key={activity.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${bg}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {getActivityLabel(activity.activity_type)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {formatTime(activity.logged_at)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">
                                  {activity.value}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getActivityUnit(activity.activity_type)}
                                </p>
                              </div>
                            </div>

                            {activity.notes && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                <span className="font-medium">Note:</span> {activity.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
