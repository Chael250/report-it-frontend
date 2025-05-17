
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ComplaintsList from "./pages/complaints/ComplaintsList";
import ComplaintDetail from "./pages/complaints/ComplaintDetail";
import ComplaintForm from "./pages/complaints/ComplaintForm";
import AgenciesList from "./pages/agencies/AgenciesList";
import AgencyDetail from "./pages/agencies/AgencyDetail";
import AgencyForm from "./pages/agencies/AgencyForm";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            
            {/* Complaints Routes */}
            <Route path="complaints" element={<ComplaintsList />} />
            <Route path="complaints/:id" element={<ComplaintDetail />} />
            <Route path="complaints/new" element={<ComplaintForm />} />
            <Route path="complaints/edit/:id" element={<ComplaintForm />} />

            {/* Agencies Routes */}
            <Route path="agencies" element={<AgenciesList />} />
            <Route path="agencies/:id" element={<AgencyDetail />} />
            <Route path="agencies/new" element={<AgencyForm />} />
            <Route path="agencies/edit/:id" element={<AgencyForm />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
