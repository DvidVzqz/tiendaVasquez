import { Outlet } from 'react-router-dom';
import './App.css'
import Sidebar from './components/Sidebar'
import { SaleManagerProvider } from './contexts/SaleManagerContext';

function App() {

  return (
    <SaleManagerProvider>
      <div className="flex h-screen">
        <main className="flex-1 bg-gray-900 text-white">
          <Outlet />
        </main>
        <Sidebar />
      </div>
    </SaleManagerProvider>
  );
}

export default App
