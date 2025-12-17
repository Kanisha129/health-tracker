import { useState } from 'react';
import { ArrowLeft, Droplets, Footprints, Moon, CheckCircle } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { logActivity } from '../services/healthService';

export function LogActivityScreen() {
  const { navigateTo } = useNavigation();
  const [activityType, setActivityType] = useState<'water' | 'steps' | 'sleep'>('water');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ value?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activityConfig = {
    water: {
      icon: Droplets,
      label: 'Water Intake',
      unit: 'glasses',
      color: 'blue',
      placeholder: 'e.g., 8',
    },
    steps: {
      icon: Footprints,
      label: 'Steps',
      unit: 'steps',
      color: 'green',
      placeholder: 'e.g., 10000',
    },
    sleep: {
      icon: Moon,
      label: 'Sleep',
      unit: 'hours',
      color: 'purple',
      placeholder: 'e.g., 7.5',
    },
  };

  const config = activityConfig[activityType];
  const Icon = config.icon;

  const validateForm = () => {
    const newErrors: { value?: string } = {};

    if (!value.trim()) {
      newErrors.value = 'Value is required';
    } else if (isNaN(Number(value))) {
      newErrors.value = 'Value must be a number';
    } else if (Number(value) <= 0) {
      newErrors.value = 'Value must be greater than 0';
    } else if (activityType === 'water' && Number(value) > 50) {
      newErrors.value = 'Water intake seems too high (max 50 glasses)';
    } else if (activityType === 'steps' && Number(value) > 100000) {
      newErrors.value = 'Steps seem too high (max 100,000)';
    } else if (activityType === 'sleep' && Number(value) > 24) {
      newErrors.value = 'Sleep hours cannot exceed 24';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await logActivity(activityType, Number(value), notes.trim() || undefined);
      setSuccess(true);
      setTimeout(() => {
        navigateTo('dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error logging activity:', error);
      setErrors({ value: 'Failed to log activity. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValue('');
    setNotes('');
    setErrors({});
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Activity Logged!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold">Log Activity</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Activity Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(activityConfig) as Array<keyof typeof activityConfig>).map((type) => {
                const ActivityIcon = activityConfig[type].icon;
                const isSelected = activityType === type;

                let buttonClass = 'p-4 rounded-lg border-2 transition-all ';
                let iconClass = 'w-8 h-8 mx-auto mb-2 ';

                if (isSelected) {
                  if (type === 'water') {
                    buttonClass += 'border-blue-600 bg-blue-50';
                    iconClass += 'text-blue-600';
                  } else if (type === 'steps') {
                    buttonClass += 'border-green-600 bg-green-50';
                    iconClass += 'text-green-600';
                  } else {
                    buttonClass += 'border-purple-600 bg-purple-50';
                    iconClass += 'text-purple-600';
                  }
                } else {
                  buttonClass += 'border-gray-200 hover:border-gray-300';
                  iconClass += 'text-gray-400';
                }

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActivityType(type);
                      handleReset();
                    }}
                    className={buttonClass}
                  >
                    <ActivityIcon className={iconClass} />
                    <p className={`text-sm font-medium ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                      {activityConfig[type].label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-semibold text-gray-700 mb-2">
              Value ({config.unit})
            </label>
            <div className="relative">
              <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                activityType === 'water' ? 'text-blue-600' :
                activityType === 'steps' ? 'text-green-600' :
                'text-purple-600'
              }`} />
              <input
                type="text"
                id="value"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (errors.value) setErrors({});
                }}
                placeholder={config.placeholder}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.value
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
            </div>
            {errors.value && (
              <p className="mt-2 text-sm text-red-600">{errors.value}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this activity..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging...' : 'Log Activity'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Recommended water intake: 8 glasses per day</li>
            <li>• Target steps: 10,000 steps per day</li>
            <li>• Recommended sleep: 7-9 hours per night</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
