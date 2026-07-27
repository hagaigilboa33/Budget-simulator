import { useState, useCallback } from "react";
import LandingScreen from "./components/LandingScreen";
import BudgetScreen  from "./components/BudgetScreen";
import BudgetBuilder from "./components/BudgetBuilder";
import ResultCard    from "./components/ResultCard";
import { CATEGORIES } from "./data/budgetData";
import "./index.css";

const initValues = () =>
  Object.fromEntries(CATEGORIES.map((c) => [c.id, c.current]));

export default function App() {
  const [screen,          setScreen]          = useState("landing");
  const [values,          setValues]          = useState(initValues);
  const [name,            setName]            = useState("");
  const [totalBudget,     setTotalBudget]     = useState(613);
  const [financingMethod, setFinancingMethod] = useState(null);

  const handleStart  = useCallback((n) => { setName(n); setScreen("budget"); }, []);

  const handleBudgetSet = useCallback((total, method) => {
    setTotalBudget(total);
    setFinancingMethod(method);
    setScreen("builder");
  }, []);

  const handleBackToBudget = useCallback(() => setScreen("budget"), []);

  const handleFinish  = useCallback(() => setScreen("result"), []);

  const handleRestart = useCallback(() => {
    setValues(initValues());
    setTotalBudget(613);
    setFinancingMethod(null);
    setScreen("landing");
  }, []);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#07080f" }}>
      {screen === "landing" && (
        <LandingScreen onStart={handleStart} />
      )}
      {screen === "budget" && (
        <BudgetScreen onBudgetSet={handleBudgetSet} />
      )}
      {screen === "builder" && (
        <BudgetBuilder
          values={values}
          setValues={setValues}
          onFinish={handleFinish}
          onBack={handleBackToBudget}
          name={name}
          totalBudget={totalBudget}
          financingMethod={financingMethod}
        />
      )}
      {screen === "result" && (
        <ResultCard
          values={values}
          name={name}
          totalBudget={totalBudget}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
