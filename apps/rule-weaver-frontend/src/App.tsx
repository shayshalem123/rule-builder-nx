import { Toaster } from "@/shared/components/inputs/sonner";
import { TooltipProvider } from "@/shared/components/inputs/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./core/pages/NotFound";
import Layout from "./core/layout/Layout";
import SchemasPage from "./features/schemas/pages/SchemasPage";
import CreateSchemaPage from "./features/schemas/pages/CreateSchemaPage";
import EditSchemaPage from "./features/schemas/pages/EditSchemaPage";
import SchemaDetailsPage from "./features/schemas/pages/SchemaDetailsPage";
import { UserProvider } from "./features/users/contexts/UserContext";
import RulesPage from "./features/rules/rulesList/RulesPage";
import { RulePage } from "./features/rules/ruleForm/RulePage";
import JsonToolsPage from "./features/jsonTools/JsonToolsPage";
import RuleDetailsPage from "./features/rules/ruleDetails/RuleDetailsPage";
import { ConfigurationManagementPage } from "./features/categories";

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
        <Toaster position="bottom-right" richColors closeButton={false} />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/rules" replace />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route
                path="/rules/create"
                element={<RulePage mode="create" />}
              />
              <Route
                path="/rules/edit/:id"
                element={<RulePage mode="edit" />}
              />
              <Route path="/rules/:id" element={<RuleDetailsPage />} />
              <Route path="/schemas" element={<SchemasPage />} />
              <Route path="/schemas/create" element={<CreateSchemaPage />} />
              <Route path="/schemas/edit/:id" element={<EditSchemaPage />} />
              <Route path="/schemas/:id" element={<SchemaDetailsPage />} />
              <Route
                path="/categories"
                element={<ConfigurationManagementPage />}
              />

              <Route
                path="/json-tools"
                element={<Navigate to="/json-tools/plain-json" replace />}
              />
              <Route
                path="/json-tools/schema-validation"
                element={<JsonToolsPage defaultTab="schema-validation" />}
              />
              <Route
                path="/json-tools/diff"
                element={<JsonToolsPage defaultTab="diff" />}
              />
              <Route
                path="/json-tools/plain-json"
                element={<JsonToolsPage defaultTab="plain-json" />}
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
