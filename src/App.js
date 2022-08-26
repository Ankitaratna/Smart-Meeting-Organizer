import { BrowserRouter } from 'react-router-dom';
import ApplicationRoutes from './routes';
import './App.css';

function App() {
  return (
    // <div>Heys</div>
    <BrowserRouter>
        <ApplicationRoutes />
      </BrowserRouter>
  );
}

export default App;
