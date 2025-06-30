"use client";

import { useState, useEffect } from "react";

interface CalculationHistory {
  id: number;
  baseCost: number;
  markupValue: number;
  markupType: "percentage" | "fixed";
  finalPrice: number;
  profit: number;
  markupAmount: number;
  date: string;
}

export function useCalculatorHistory() {
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("dropshipping-calculations");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveCalculation = (
    calculation: Omit<CalculationHistory, "id" | "date">
  ) => {
    const newCalculation: CalculationHistory = {
      ...calculation,
      id: Date.now(),
      date: new Date().toISOString(),
    };

    const updatedHistory = [newCalculation, ...history].slice(0, 50); // Keep only last 50
    setHistory(updatedHistory);
    localStorage.setItem(
      "dropshipping-calculations",
      JSON.stringify(updatedHistory)
    );

    return newCalculation;
  };

  const deleteCalculation = (id: number) => {
    const updatedHistory = history.filter((calc) => calc.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(
      "dropshipping-calculations",
      JSON.stringify(updatedHistory)
    );
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("dropshipping-calculations");
  };

  return {
    history,
    saveCalculation,
    deleteCalculation,
    clearHistory,
  };
}
