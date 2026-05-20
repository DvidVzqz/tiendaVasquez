import { Outlet } from 'react-router-dom';
import './App.css'
import Sidebar from './components/Sidebar'

function App() {

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-gray-900 text-white">
        <Outlet />
      </main>
      <Sidebar />
    </div>
  );
}

export default App
