import { Text } from "tamagui";
import { useEffect, useMemo, useState } from "react";
import {
  DiagramColorsDescription,
  DiagramKey,
  StatisticDescription,
} from "../types/dbTypes";
import { getVisitStatistic } from "../database/api/getVisitStatistic";
import { useSQLiteContext } from "expo-sqlite";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Svg, G, Rect, Text as SvgText } from "react-native-svg";
import * as d3 from "d3-scale";

export const Diagram = () => {
  const [visitData, setVisitData] = useState<StatisticDescription[]>([]);
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
  }, [visitData]);

  const maxValue = useMemo(() => {
    return Math.max(...visitData.map((d) => d.signed + d.unsigned));
  }, [visitData]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, maxValue]).range([0, CHART_HEIGHT]);
  }, [maxValue]);

  useEffect(() => {
    const getData = async () => {
      const data = await getVisitStatistic(db);
      console.log("useEffect getdata data: ", data);
      const formattedData = data.map((item) => ({
        ...item,
        visitDate: new Date(item.visitDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));

      console.log("Formatted data:", formattedData);
      setVisitData(formattedData.reverse());
    };
    getData();
  }, []);

  return (
    <View style={styles.chartContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartRow}>
          {visitData.map((item) => {
            const total = item.signed + item.unsigned;
            const signedHeight = (item.signed / maxValue) * 100;
            const unsignedHeight = (item.unsigned / maxValue) * 100;

            return (
              <View key={item.visitDate} style={styles.barGroup}>
                <Text style={styles.totalText}>{total}</Text>
                <View style={styles.barArea}>
                  {/* Bar container */}
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
            <View style={[styles.colorBox, { backgroundColor: colors[key] }]} />
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
  },
  totalText: {
    marginBottom: 6,
    fontSize: 12,
    color: "#000",
    textAlign: "center",
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
    justifyContent: "flex-start",
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
});
