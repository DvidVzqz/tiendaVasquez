import './App.css'
import Sidebar from './components/Sidebar'

function App() {

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold">Contenido principal</h1>
      </main>
    </div>
  );
}

export default App
