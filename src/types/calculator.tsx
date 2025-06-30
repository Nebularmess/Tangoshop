export type MarkupType = "percentage" | "fixed"

export interface CalculationResult {
  baseCost: number
  markupValue: number
  markupType: MarkupType
  finalPrice: number
  profit: number
  markupAmount: number
}

export interface CalculationHistory extends CalculationResult {
  id: number
  date: string
}

export interface PriceCalculatorProps {
  initialCost?: string
  onCalculationChange?: (result: CalculationResult | null) => void
}
