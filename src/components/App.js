import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import RecipePage from "./pages/RecipePage";
import IngredientPage from "./pages/IngredientPage";
import MealPrepPage from "./pages/MealPrepPage";
import ToolsPage from "./pages/ToolsPage";
import ErrorPage from "./pages/ErrorPage";
import "./App.scss";

const App = () => {
  return (
  <Router>
    <Routes>
      <Route exact path="/" element={<RecipePage />} />
      <Route exact path="/:id" element={<RecipePage />} />
      <Route exact path="/pantry" element={<IngredientPage />} />
      <Route exact path="/pantry/:id" element={<IngredientPage />} />
      <Route exact path="/pantry" element={<IngredientPage />} />
      <Route exact path="/meal-prep" element={<MealPrepPage />} />
      <Route exact path="/tools" element={<ToolsPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </Router>
  );
};
export default App;
