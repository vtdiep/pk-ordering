
import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { Home } from './components/Home';

function App() {


  return (
    <div className="App">
      <Home></Home>
      <Link to='item'> abc </Link>

      <Outlet />


      
    </div>
  );
}

export default App;

