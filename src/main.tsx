
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DataProvider } from "@/context/DataContext"
import { Toaster } from '@/components/ui/toaster'

// Initialize the root and render the app
const root = createRoot(document.getElementById("root")!);
root.render(
  <DataProvider>
    <App />
    <Toaster />
  </DataProvider>
);
