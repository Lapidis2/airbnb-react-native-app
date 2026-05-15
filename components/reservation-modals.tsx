import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApiListing } from "@/types/listings";
import React, { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ReservationModalProps {
  visible: boolean;
  listing: ApiListing | null;
  onClose: () => void;
}

type PaymentMethod = "mtn_momo" | "paypal" | "visa" | "mastercard";

type PaymentDetails = {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  phoneNumber?: string;
};

type PaymentMethodData = PaymentMethod;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop";

function getPrimaryPhoto(listing: ApiListing): string {
  const primary = listing.photos.find((p) => p.isPrimary);
  return primary?.url ?? listing.photos[0]?.url ?? FALLBACK_IMAGE;
}

function ListingCardPreview({ listing, colors }: { listing: ApiListing; colors: any }) {
  return (
    <View style={[styles.listingCard, { borderColor: colors.border }]}>
      <Image
        source={{ uri: getPrimaryPhoto(listing) }}
        style={styles.listingImage}
      />
      <View style={styles.listingInfo}>
        <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={2}>
          {listing.title}
        </Text>
        <Text style={[styles.listingLocation, { color: colors.textSecondary }]}>
           {listing.location}
        </Text>
        {listing.rating !== null && (
          <Text style={[styles.listingRating, { color: colors.text }]}>
            ★ {listing.rating.toFixed(1)}
          </Text>
        )}
      </View>
    </View>
  );
}

export function ReservationModals({
  visible,
  listing,
  onClose,
}: ReservationModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("mtn_momo");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    phoneNumber: "",
  });
  const [checkInDate, setCheckInDate] = useState("Jun 5, 2026");
  const [checkOutDate, setCheckOutDate] = useState("Jun 7, 2026");
  const [guests, setGuests] = useState(1);

  const handleResetFlow = () => {
    setStep(1);
    setSelectedPayment("mtn_momo");
    setPaymentDetails({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      phoneNumber: "",
    });
    onClose();
  };

  if (!listing) return null;

  const totalPrice = listing.pricePerNight * (guests || 1) * 2;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {step === 1 && (
        <ReviewAndContinueModal
          listing={listing}
          colors={colors}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guests={guests}
          selectedPayment={selectedPayment}
          onPaymentChange={setSelectedPayment}
          onSetCheckInDate={setCheckInDate}
          onSetCheckOutDate={setCheckOutDate}
          onSetGuests={setGuests}
          onNext={() => setStep(2)}
          onClose={handleResetFlow}
          totalPrice={totalPrice}
        />
      )}

      {step === 2 && (
        <PaymentDetailsModal
          selectedPayment={selectedPayment}
          paymentDetails={paymentDetails}
          onPaymentDetailsChange={setPaymentDetails}
          colors={colors}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ConfirmAndPayModal
          listing={listing}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guests={guests}
          selectedPayment={selectedPayment}
          paymentDetails={paymentDetails}
          colors={colors}
          totalPrice={totalPrice}
          onConfirm={() => {
            alert("Payment processed successfully!");
            handleResetFlow();
          }}
          onBack={() => setStep(2)}
        />
      )}
    </Modal>
  );
}

interface ReviewAndContinueModalProps {
  listing: ApiListing;
  colors: any;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  selectedPayment: PaymentMethodData;
  onPaymentChange: (method: PaymentMethodData) => void;
  onSetCheckInDate: (date: string) => void;
  onSetCheckOutDate: (date: string) => void;
  onSetGuests: (guests: number) => void;
  onNext: () => void;
  onClose: () => void;
  totalPrice: number;
}

function ReviewAndContinueModal({
  listing,
  colors,
  checkInDate,
  checkOutDate,
  guests,
  selectedPayment,
  onPaymentChange,
  onSetCheckInDate,
  onSetCheckOutDate,
  onSetGuests,
  onNext,
  onClose,
  totalPrice,
}: ReviewAndContinueModalProps) {
  const [editingDates, setEditingDates] = useState(false);
  const [editingGuests, setEditingGuests] = useState(false);
  const [tempCheckIn, setTempCheckIn] = useState(checkInDate);
  const [tempCheckOut, setTempCheckOut] = useState(checkOutDate);
  const [tempGuests, setTempGuests] = useState(String(guests));

  // sync props -> temp when modal opens or props change
  React.useEffect(() => {
    setTempCheckIn(checkInDate);
    setTempCheckOut(checkOutDate);
    setTempGuests(String(guests));
  }, [checkInDate, checkOutDate, guests]);

  const toggleEditingDates = () => {
    if (editingDates) {
      // committing changes
      onSetCheckInDate(tempCheckIn.trim() || checkInDate);
      onSetCheckOutDate(tempCheckOut.trim() || checkOutDate);
      setEditingDates(false);
    } else {
      setEditingDates(true);
    }
  };

  const toggleEditingGuests = () => {
    if (editingGuests) {
      const parsed = parseInt(tempGuests, 10);
      const final = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
      onSetGuests(final);
      setEditingGuests(false);
    } else {
      setEditingGuests(true);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Review and continue
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ListingCardPreview listing={listing} colors={colors} />

        {/* Dates Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Dates
            </Text>
            <TouchableOpacity onPress={toggleEditingDates}>
              <Text style={styles.changeLink}>{editingDates ? "Done" : "Change"}</Text>
            </TouchableOpacity>
          </View>
          {editingDates ? (
            <View style={styles.editDatesRow}>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={tempCheckIn}
                onChangeText={setTempCheckIn}
                placeholder="Check-in date"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={[styles.dateSeparator, { color: colors.text }]}>–</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={tempCheckOut}
                onChangeText={setTempCheckOut}
                placeholder="Check-out date"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          ) : (
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {checkInDate} – {checkOutDate}
            </Text>
          )}
        </View>

        {/* Guests Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Guests
            </Text>
            <TouchableOpacity onPress={toggleEditingGuests}>
              <Text style={styles.changeLink}>{editingGuests ? "Done" : "Change"}</Text>
            </TouchableOpacity>
          </View>
          {editingGuests ? (
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
              value={tempGuests}
              onChangeText={setTempGuests}
              placeholder="Number of guests"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          ) : (
            <Text style={[styles.guestValue, { color: colors.text }]}>
              {guests} adult{guests !== 1 ? "s" : ""}
            </Text>
          )}
        </View>

        {/* Price Section */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Total price
          </Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text
                style={[styles.priceLabel, { color: colors.textSecondary }]}
              >
                ${listing.pricePerNight} x 2 nights
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                ${listing.pricePerNight * 2}
              </Text>
            </View>
            <View
              style={[styles.priceDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.priceRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total
              </Text>
              <Text style={[styles.totalPrice, { color: colors.text }]}>
                ${totalPrice.toFixed(2)} USD
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Choose payment method
          </Text>
          <View style={styles.paymentOptions}>
            {[
              { id: "mtn_momo" as PaymentMethodData, name: "MTN MOMO", icon: "📱" },
              { id: "paypal" as PaymentMethodData, name: "PayPal", icon: "🅿️" },
              { id: "visa" as PaymentMethodData, name: "Visa Card", icon: "💳" },
              {
                id: "mastercard" as PaymentMethodData,
                name: "Mastercard",
                icon: "💳",
              },
            ].map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  {
                    borderColor:
                      selectedPayment === method.id ? "#FF385C" : colors.border,
                    backgroundColor:
                      selectedPayment === method.id
                        ? "rgba(255, 56, 92, 0.05)"
                        : colors.background,
                  },
                ]}
                onPress={() => onPaymentChange(method.id)}
              >
                <View style={styles.paymentOptionLeft}>
                  <Text style={styles.paymentIcon}>{method.icon}</Text>
                  <Text style={[styles.paymentName, { color: colors.text }]}>
                    {method.name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor:
                        selectedPayment === method.id
                          ? "#FF385C"
                          : colors.border,
                      backgroundColor:
                        selectedPayment === method.id
                          ? "#FF385C"
                          : "transparent",
                    },
                  ]}
                >
                  {selectedPayment === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Free cancellation
          </Text>
          <Text
            style={[styles.cancellationText, { color: colors.textSecondary }]}
          >
            Cancel before Jun 4 for a full refund.{" "}
            <Text style={[styles.policyLink, { color: "#FF385C" }]}>
              Full policy
            </Text>
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: "#FF385C" }]}
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface PaymentDetailsModalProps {
  selectedPayment: PaymentMethod;
  paymentDetails: PaymentDetails;
  onPaymentDetailsChange: (details: PaymentDetails) => void;
  colors: any;
  onNext: () => void;
  onBack: () => void;
}

function PaymentDetailsModal({
  selectedPayment,
  paymentDetails,
  onPaymentDetailsChange,
  colors,
  onNext,
  onBack,
}: PaymentDetailsModalProps) {
  const handleInputChange = (field: string, value: string) => {
    onPaymentDetailsChange({
      ...paymentDetails,
      [field]: value,
    });
  };

  const isMTNMOMO = selectedPayment === "mtn_momo";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isMTNMOMO ? "Enter phone number" : "Enter card details"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={[styles.formLabel, { color: colors.text }]}>
            {isMTNMOMO ? "Payment method" : "Payment method"}
          </Text>
          <View
            style={[
              styles.methodBadge,
              { backgroundColor: "rgba(255, 56, 92, 0.1)" },
            ]}
          >
            <Text style={styles.methodBadgeText}>
              {selectedPayment === "mtn_momo"
                ? "📱 MTN MOMO"
                : selectedPayment === "paypal"
                  ? "🅿️ PayPal"
                  : `💳 ${selectedPayment.charAt(0).toUpperCase() + selectedPayment.slice(1)}`}
            </Text>
          </View>
        </View>

        {isMTNMOMO ? (
          <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: colors.text }]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="+233 XX XXX XXXX"
              placeholderTextColor={colors.textSecondary}
              value={paymentDetails.phoneNumber}
              onChangeText={(val) => handleInputChange("phoneNumber", val)}
              keyboardType="phone-pad"
            />
          </View>
        ) : (
          <>
            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: colors.text }]}>
                Cardholder Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="John Doe"
                placeholderTextColor={colors.textSecondary}
                value={paymentDetails.cardholderName}
                onChangeText={(val) => handleInputChange("cardholderName", val)}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: colors.text }]}>
                Card Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.textSecondary}
                value={paymentDetails.cardNumber}
                onChangeText={(val) => handleInputChange("cardNumber", val)}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formSection, { flex: 1 }]}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Expiry Date
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textSecondary}
                  value={paymentDetails.expiryDate}
                  onChangeText={(val) => handleInputChange("expiryDate", val)}
                />
              </View>
              <View style={[styles.formSection, { flex: 1, marginLeft: 12 }]}>
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  CVV
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="123"
                  placeholderTextColor={colors.textSecondary}
                  value={paymentDetails.cvv}
                  onChangeText={(val) => handleInputChange("cvv", val)}
                  keyboardType="number-pad"
                  secureTextEntry
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: "#FF385C" }]}
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface ConfirmAndPayModalProps {
  listing: ApiListing;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  selectedPayment: PaymentMethod;
  paymentDetails: PaymentDetails;
  colors: any;
  totalPrice: number;
  onConfirm: () => void;
  onBack: () => void;
}

function ConfirmAndPayModal({
  listing,
  checkInDate,
  checkOutDate,
  guests,
  selectedPayment,
  colors,
  totalPrice,
  onConfirm,
  onBack,
}: ConfirmAndPayModalProps) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Confirm and pay
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ListingCardPreview listing={listing} colors={colors} />

        {/* Dates */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Dates
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.dateValue, { color: colors.text }]}>
            {checkInDate} – {checkOutDate}
          </Text>
        </View>

        {/* Guests */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Guests
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.guestValue, { color: colors.text }]}>
            {guests} adult{guests !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Price Breakdown */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Price breakdown
          </Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text
                style={[styles.priceLabel, { color: colors.textSecondary }]}
              >
                ${listing.pricePerNight} x 2 nights
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                ${listing.pricePerNight * 2}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text
                style={[styles.priceLabel, { color: colors.textSecondary }]}
              >
                Service fee
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                $0
              </Text>
            </View>
            <View
              style={[styles.priceDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.priceRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total
              </Text>
              <Text style={[styles.totalPrice, { color: colors.text }]}>
                ${totalPrice.toFixed(2)} USD
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment method
          </Text>
          <View
            style={[
              styles.methodDisplay,
              {
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
          >
            <Text style={styles.methodIcon}>
              {selectedPayment === "mtn_momo"
                ? "📱"
                : selectedPayment === "paypal"
                  ? "🅿️"
                  : "💳"}
            </Text>
            <Text style={[styles.methodName, { color: colors.text }]}>
              {selectedPayment === "mtn_momo"
                ? "MTN MOMO"
                : selectedPayment === "paypal"
                  ? "PayPal"
                  : `${selectedPayment.charAt(0).toUpperCase() + selectedPayment.slice(1)}`}
            </Text>
            <TouchableOpacity>
              <IconSymbol
                name="chevron.right"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Free Cancellation */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Free cancellation
          </Text>
          <Text
            style={[styles.cancellationText, { color: colors.textSecondary }]}
          >
            Cancel before Jun 4 for a full refund.{" "}
            <Text style={[styles.policyLink, { color: "#FF385C" }]}>
              Full policy
            </Text>
          </Text>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            By selecting the button, I agree to the{" "}
            <Text style={[styles.termsLink, { color: "#FF385C" }]}>
              booking terms
            </Text>
            .
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: "#FF1654" }]}
          onPress={onConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm and pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  closeBtn: { padding: 8 },
  scrollContent: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

  // Listing Card
  listingCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  listingLocation: { fontSize: 12, color: "#666", marginBottom: 2 },
  listingInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  listingTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  listingRating: { fontSize: 12, fontWeight: "500" },

  // Sections
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  changeLink: { color: "#FF385C", fontSize: 14, fontWeight: "500" },
  dateValue: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  guestValue: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  editDatesRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateSeparator: { fontSize: 14, fontWeight: "500" },

  // Price Breakdown
  priceBreakdown: { marginTop: 8 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: { fontSize: 13 },
  priceValue: { fontSize: 13, fontWeight: "500" },
  priceDivider: { height: 1, marginVertical: 8 },
  totalLabel: { fontSize: 14, fontWeight: "600" },
  totalPrice: { fontSize: 18, fontWeight: "700" },

  paymentOptions: { marginTop: 12 },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  paymentOptionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  paymentIcon: { fontSize: 24 },
  paymentName: { fontSize: 14, fontWeight: "500" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },

  
  cancellationText: { fontSize: 13, lineHeight: 20 },
  policyLink: { fontWeight: "600" },

  
  formSection: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  methodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  methodBadgeText: { color: "#FF385C", fontWeight: "600", fontSize: 13 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  formRow: { flexDirection: "row" },


  methodDisplay: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  methodIcon: { fontSize: 28 },
  methodName: { flex: 1, fontSize: 14, fontWeight: "500" },

  
  termsSection: { paddingVertical: 12 },
  termsText: { fontSize: 12, lineHeight: 18 },
  termsLink: { fontWeight: "600" },
});
