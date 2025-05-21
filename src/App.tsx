import { RouterProvider } from 'react-router-dom';
import router from './route/Router';
import LoadingOverlay from './components/common/LoadingOverlay';
import Snackbar from './components/common/Snackbar';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <LoadingOverlay />
      <Snackbar />
    </>
  );
}

export default App;
