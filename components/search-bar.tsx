import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface SearchBarProps {
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showDetails?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onPress,
  onChangeText,
  onFilterPress,
  placeholder = "Where to?",
  showDetails = true,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <IconSymbol name="magnifyingglass" size={18} color={colors.text} />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onChangeText={onChangeText}
          editable={!onPress}
        />
        {showDetails && (
          <Text style={[styles.details, { color: colors.textSecondary }]}>
            Any week · Add guests
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <IconSymbol name="slider.horizontal.3" size={18} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 32,
    marginVertical: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "#F7F7F7",
  },
  inputContainer: {
    flex: 1,
    marginLeft: 8,
  },
  input: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 0,
  },
  details: {
    fontSize: 11,
    marginTop: 1,
  },
  filterButton: {
    padding: 6,
    marginLeft: 6,
  },
});
