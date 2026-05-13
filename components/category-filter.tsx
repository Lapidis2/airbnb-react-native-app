import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

interface CategoryFilterProps {
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const defaultCategories = [
  "All",
  "Chefs",
  "Beach",
  "Amazing pools",
  "Islands",
  "Lakefront",
  "Farms",
  "Cabins",
  "Tiny homes",
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories = defaultCategories,
  selectedCategory,
  onSelectCategory,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            {
              borderColor:
                selectedCategory === category ? "#000" : colors.border,
              borderBottomWidth: selectedCategory === category ? 2 : 1,
            },
          ]}
          onPress={() => onSelectCategory?.(category)}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory === category ? "#000" : colors.textSecondary,
                fontWeight: selectedCategory === category ? "600" : "400",
              },
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderBottomWidth: 1,
  },
  categoryText: {
    fontSize: 13,
  },
});
