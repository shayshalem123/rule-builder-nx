import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Layout from "../features/layout/components/Layout";
import RulesPage from "../features/rules/pages/RulesPage";
import CreateRulePage from "../features/rules/pages/CreateRulePage";
import EditRulePage from "../features/rules/pages/EditRulePage";

export const AppRoutes = () => (
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
); 