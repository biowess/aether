import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { LocationProvider } from './contexts/LocationContext';
import { WeatherProvider  } from './contexts/WeatherContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppShell from './components/shell/AppShell';
import Home      from './pages/Home';
import Forecast  from './pages/Forecast';
import Locations from './pages/Locations';
import Settings  from './pages/Settings';
import About     from './pages/About';

export default function App() {
  return (
    <HashRouter>
      <SettingsProvider>
        <LocationProvider>
          <WeatherProvider>
            <ErrorBoundary>
              <Routes>
                <Route element={<AppShell />}>
                  <Route path="/"          element={<Home />}      />
                  <Route path="/forecast"  element={<Forecast />}  />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/settings"  element={<Settings />}  />
                  <Route path="/about"     element={<About />}     />
                  <Route path="*"          element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </ErrorBoundary>
          </WeatherProvider>
        </LocationProvider>
      </SettingsProvider>
    </HashRouter>
  );
}
