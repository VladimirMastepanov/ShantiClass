import { Text } from "tamagui";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  DiagramColorsDescription,
  DiagramKey,
  StatisticDescription,
} from "../types/dbTypes";
import { getVisitStatistic } from "../database/api/getVisitStatistic";
import { useSQLiteContext } from "expo-sqlite";
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import * as d3 from "d3-scale";

export const Diagram = () => {
  const [visitData, setVisitData] = useState<StatisticDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const db = useSQLiteContext();

  const keys = ["signed", "unsigned"] as const;
  const colors: DiagramColorsDescription = {
    signed: "#8FD2E6",
    unsigned: "#EBCDA7",
  };

  const CHART_HEIGHT = 300;
  const BAR_WIDTH = 30;
  const BAR_GAP = 16;
  const chartWidth = useMemo(() => {
    return visitData.length * (BAR_WIDTH + BAR_GAP);
  }, [visitData.length]);

  const maxValue = useMemo(() => {
    if (visitData.length === 0) return 10; // Значение по умолчанию для пустых данных
    return Math.max(
      ...visitData.map((d) => d.signed + d.unsigned),
      1 // Минимальное значение для предотвращения деления на ноль
    );
  }, [visitData]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, maxValue]).range([0, CHART_HEIGHT]);
  }, [maxValue]);

  // Scroll to the end when data is loaded
  useEffect(() => {
    if (visitData.length > 0 && scrollViewRef.current) {
      // Небольшая задержка, чтобы убедиться, что ScrollView полностью отрендерился
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visitData]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await getVisitStatistic(db);
        
        if (data && data.length > 0) {
          const formattedData = data.map((item) => ({
            ...item,
            visitDate: new Date(item.visitDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          }));
          
          setVisitData(formattedData.reverse());
        } else {
          setVisitData([]);
        }
      } catch (err) {
        console.error("Error fetching visit statistics:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, [db]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8FD2E6" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (visitData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { width: chartWidth > 0 ? chartWidth + 40 : '100%' }
        ]}
      >
        <View style={styles.chartRow}>
          {visitData.map((item, index) => {
            const total = item.signed + item.unsigned;
            const signedHeight = (item.signed / maxValue) * 100;
            const unsignedHeight = (item.unsigned / maxValue) * 100;

            return (
              <View key={`${item.visitDate}-${index}`} style={styles.barGroup}>
                <Text style={styles.totalText}>{total}</Text>
                <View style={styles.barArea}>
                  <View style={styles.barBackground}>
                    {/* Signed segment */}
                    <View
                      style={[
                        styles.barSegment,
                        {
                          height: `${signedHeight}%`,
                          backgroundColor: colors.signed,
                        },
                      ]}
                      accessibilityLabel={`Signed: ${item.signed}`}
                    >
                      {item.signed > 0 && (
                        <Text style={styles.valueText}>{item.signed}</Text>
                      )}
                    </View>
                    
                    {/* Unsigned segment */}
                    <View
                      style={[
                        styles.barSegment,
                        {
                          height: `${unsignedHeight}%`,
                          backgroundColor: colors.unsigned,
                        },
                      ]}
                      accessibilityLabel={`Unsigned: ${item.unsigned}`}
                    >
                      {item.unsigned > 0 && (
                        <Text style={styles.valueText}>{item.unsigned}</Text>
                      )}
                    </View>
                  </View>
                </View>
                <Text style={styles.label}>{item.visitDate}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Легенда */}
      <View style={styles.legend}>
        {keys.map((key) => (
          <View key={key} style={styles.legendItem}>
            <View 
              style={[styles.colorBox, { backgroundColor: colors[key] }]}
              accessibilityLabel={`${key} color indicator`}
            />
            <Text style={styles.legendLabel}>{key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  barGroup: {
    alignItems: "center",
    marginHorizontal: 10,
    position: "relative",
  },
  barArea: {
    height: 160,
    width: 28,
    justifyContent: "flex-end",
    position: "relative",
  },
  barBackground: {
    flexDirection: "column-reverse",
    height: "100%",
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  barSegment: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  valueText: {
    fontSize: 10,
    color: "#333",
    fontWeight: "500",
  },
  totalText: {
    marginBottom: 6,
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    fontWeight: "500",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
  legend: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: "#555",
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: "#D32F2F",
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: "#757575",
    textAlign: 'center',
  },
});