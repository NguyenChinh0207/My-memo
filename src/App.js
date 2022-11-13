import "./App.scss";
import "antd/dist/antd.css";
import AppRouter from "./routers";
import { QueryClient, QueryClientProvider } from "react-query";
import AppContextProvider from "./context/AppContext";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AppRouter />
      </AppContextProvider>
    </QueryClientProvider>
  );
}

export default App;
