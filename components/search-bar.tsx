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
  onClear?: () => void;
  placeholder?: string;
  showDetails?: boolean;
  value?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onPress,
  onChangeText,
  onFilterPress,
  onClear,
  placeholder = "Where to?",
  showDetails = true,
  value,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const hasValue = value && value.length > 0;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <IconSymbol name="magnifyingglass" size={18} color={colors.textSecondary} />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onChangeText={onChangeText}
          editable={!onPress}
          value={value}
          returnKeyType="search"
        />
        {showDetails && !hasValue && (
          <Text style={[styles.details, { color: colors.textSecondary }]}>
            Any week · Add guests
          </Text>
        )}
      </View>
      {hasValue && onClear ? (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <View style={[styles.clearCircle, { backgroundColor: colors.textSecondary }]}>
            <Text style={styles.clearX}>✕</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <IconSymbol name="slider.horizontal.3" size={18} color={colors.text} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: "#F7F7F7",
  },
  inputContainer: { flex: 1, marginLeft: 8 },
  input: { fontSize: 14, fontWeight: "500", paddingVertical: 0 },
  details: { fontSize: 11, marginTop: 1 },
  filterButton: { padding: 6, marginLeft: 6 },
  clearButton: { padding: 6, marginLeft: 6 },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  clearX: { color: "white", fontSize: 10, fontWeight: "700" },
});
