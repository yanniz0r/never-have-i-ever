import '../styles/globals.css'
import "tailwindcss/tailwind.css";
import { QueryClient, QueryClientProvider } from 'react-query';

function MyApp({ Component, pageProps }) {
  return <QueryClientProvider client={new QueryClient()}>
    <Component {...pageProps} />
  </QueryClientProvider>
}

export default MyApp
