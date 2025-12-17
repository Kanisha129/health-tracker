import { Heart } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

export function WelcomeScreen() {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-6 rounded-full shadow-lg">
            <Heart className="w-16 h-16 text-white" fill="white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Personal Health Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Track your daily water intake, steps, and sleep hours to maintain a healthy lifestyle.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Get Started
          </button>
          <p className="text-sm text-gray-500">
            Start tracking your health journey today
          </p>
        </div>
      </div>
    </div>
  );
}
