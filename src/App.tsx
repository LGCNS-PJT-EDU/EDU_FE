import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './route/Router';
import LoadingOverlay from './components/common/LoadingOverlay';
import Snackbar from './components/common/Snackbar';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <LoadingOverlay />
      <Snackbar />
    </QueryClientProvider>
  )
}

export default App;
