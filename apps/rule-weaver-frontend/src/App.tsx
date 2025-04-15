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
import SchemasPage from "./features/schemas/pages/SchemasPage";
import CreateSchemaPage from "./features/schemas/pages/CreateSchemaPage";
import EditSchemaPage from "./features/schemas/pages/EditSchemaPage";
import SchemaDetailsPage from "./features/schemas/pages/SchemaDetailsPage";
import { UserProvider } from "./features/users/contexts/UserContext";

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
    <UserProvider>
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
              <Route path="/schemas" element={<SchemasPage />} />
              <Route path="/schemas/create" element={<CreateSchemaPage />} />
              <Route path="/schemas/edit/:id" element={<EditSchemaPage />} />
              <Route path="/schemas/:id" element={<SchemaDetailsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
