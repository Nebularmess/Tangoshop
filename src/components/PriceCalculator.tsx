import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, Clipboard, Share, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS } from '@/src/constants/colors'
import { moderateScale, verticalScale } from 'react-native-size-matters'

type MarkupType = "percentage" | "fixed"

interface CalculationResult {
  baseCost: number
  markupValue: number
  markupType: MarkupType
  finalPrice: number
  profit: number
  markupAmount: number
}

interface PriceCalculatorProps {
  initialCost?: string
  onCalculationChange?: (result: CalculationResult | null) => void
}

export function PriceCalculator({ initialCost = "1000", onCalculationChange }: PriceCalculatorProps) {
  const [baseCost, setBaseCost] = useState<string>(initialCost)
  const [markupType, setMarkupType] = useState<MarkupType>("percentage")
  const [markupValue, setMarkupValue] = useState<string>("10")
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculatePrice = () => {
    const cost = Number.parseFloat(baseCost) || 0
    const markup = Number.parseFloat(markupValue) || 0

    if (cost <= 0 || markup <= 0) {
      setResult(null)
      onCalculationChange?.(null)
      return
    }

    let markupAmount: number
    let finalPrice: number

    if (markupType === "percentage") {
      markupAmount = (cost * markup) / 100
      finalPrice = cost + markupAmount
    } else {
      markupAmount = markup
      finalPrice = cost + markup
    }

    const profit = markupAmount
    const newResult = {
      baseCost: cost,
      markupValue: markup,
      markupType,
      finalPrice,
      profit,
      markupAmount,
    }

    setResult(newResult)
    onCalculationChange?.(newResult)
  }

  useEffect(() => {
    calculatePrice()
  }, [baseCost, markupValue, markupType])

  const copyPrice = async () => {
    if (result) {
      Clipboard.setString(result.finalPrice.toFixed(2))
      Alert.alert('¡Precio copiado!', `$${result.finalPrice.toFixed(2)}`)
    }
  }

  const shareResult = async () => {
    if (result) {
      try {
        await Share.share({
          title: 'Cálculo Dropshipping',
          message: `Precio final: $${result.finalPrice.toFixed(2)} - Ganancia: $${result.profit.toFixed(2)}`,
        })
      } catch (error) {
        copyPrice()
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Product Card */}
      <View style={styles.productCard}>
        <View style={styles.productCardContent}>
          <View style={styles.productHeader}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="package-variant" size={24} color="white" />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.costLabel}>Costo</Text>
              <Text style={styles.costValue}>${Number.parseFloat(baseCost || "0").toFixed(0)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cost Input */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Costo del producto</Text>
          <TextInput
            style={styles.textInput}
            placeholder="1000"
            value={baseCost}
            onChangeText={setBaseCost}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      {/* Markup Type Selection */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ganancia</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.typeButton, markupType === "percentage" && styles.typeButtonActive]}
              onPress={() => setMarkupType("percentage")}
            >
              <Text style={[styles.typeButtonText, markupType === "percentage" && styles.typeButtonTextActive]}>
                % Porcentual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, markupType === "fixed" && styles.typeButtonActive]}
              onPress={() => setMarkupType("fixed")}
            >
              <Text style={[styles.typeButtonText, markupType === "fixed" && styles.typeButtonTextActive]}>
                $ Fija
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Markup Value Input */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {markupType === "percentage" ? "Ingrese ganancia porcentual" : "Ingrese ganancia fija"}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={markupType === "percentage" ? "10" : "1000"}
            value={markupValue}
            onChangeText={setMarkupValue}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      {/* Results Summary */}
      {result && (
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Resumen</Text>

          <View style={styles.resultsContent}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Costo:</Text>
              <Text style={styles.resultValue}>${result.baseCost.toFixed(0)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Sobreprecio:</Text>
              <Text style={styles.resultValue}>
                {result.markupType === "percentage"
                  ? `${result.markupValue}%`
                  : `$${result.markupAmount.toFixed(0)}`}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Precio de venta:</Text>
              <Text style={styles.resultValue}>${result.finalPrice.toFixed(0)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Ganancia:</Text>
              <Text style={styles.resultValue}>${result.profit.toFixed(0)}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={copyPrice}>
              <MaterialCommunityIcons name="content-copy" size={16} color="white" />
              <Text style={styles.actionButtonText}>Copiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareResult}>
              <MaterialCommunityIcons name="share-variant" size={16} color="white" />
              <Text style={styles.actionButtonText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  productCard: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productCardContent: {
    padding: moderateScale(16),
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  productInfo: {
    flex: 1,
  },
  costLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: moderateScale(14),
  },
  costValue: {
    color: 'white',
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: verticalScale(12),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  typeButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  resultsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsTitle: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(16),
  },
  resultsContent: {
    marginBottom: verticalScale(16),
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  resultLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: moderateScale(14),
  },
  resultValue: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(8),
  },
  actionButtonText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginLeft: moderateScale(8),
  },
});