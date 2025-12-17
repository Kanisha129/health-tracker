import { useState, useEffect } from 'react';
import { Droplets, Footprints, Moon, Plus, History, RefreshCw } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { getTodayStats } from '../services/healthService';

export function DashboardScreen() {
  const { navigateTo } = useNavigation();
  const [stats, setStats] = useState({ water: 0, steps: 0, sleep: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodayStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Health Dashboard</h1>
        <p className="text-blue-100 mt-1">{formatDate()}</p>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Today's Summary</h2>
          <button
            onClick={loadStats}
            disabled={loading}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">WATER</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-800">{stats.water}</p>
              <p className="text-sm text-gray-600">glasses today</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Footprints className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">STEPS</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-800">{stats.steps.toLocaleString()}</p>
              <p className="text-sm text-gray-600">steps walked</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Moon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">SLEEP</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-800">{stats.sleep}</p>
              <p className="text-sm text-gray-600">hours slept</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => navigateTo('log-activity')}
              className="bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log New Activity
            </button>

            <button
              onClick={() => navigateTo('history')}
              className="bg-gray-700 text-white p-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <History className="w-5 h-5" />
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
