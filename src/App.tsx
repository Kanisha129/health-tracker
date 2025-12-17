import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { LogActivityScreen } from './screens/LogActivityScreen';
import { HistoryScreen } from './screens/HistoryScreen';

function AppContent() {
  const { currentScreen } = useNavigation();

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    case 'log-activity':
      return <LogActivityScreen />;
    case 'history':
      return <HistoryScreen />;
    default:
      return <WelcomeScreen />;
  }
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
