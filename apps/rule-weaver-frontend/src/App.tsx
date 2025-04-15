
import { Toaster } from "@/shared/components/inputs/toaster";
import { Toaster as Sonner } from "@/shared/components/inputs/sonner";
import { TooltipProvider } from "@/shared/components/inputs/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./core/pages/Index";
import NotFound from "./core/pages/NotFound";
import Layout from "./core/layout/Layout";
import RulesPage from "./features/rules/pages/RulesPage";
import CreateRulePage from "./features/rules/pages/CreateRulePage";
import EditRulePage from "./features/rules/pages/EditRulePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/rules/create" element={<CreateRulePage />} />
            <Route path="/rules/edit/:id" element={<EditRulePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
