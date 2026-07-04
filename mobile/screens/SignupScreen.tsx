import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register as registerUser, clearError } from "@/store/authSlice";
import { authStyles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colour";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = useCallback(
    async (data: SignupForm) => {
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        setSuccess(true);
        setTimeout(() => router.replace("/(auth)/login"), 1200);
      }
    },
    [dispatch, router]
  );

  return (
    <KeyboardAvoidingView
      style={authStyles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={authStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={authStyles.title}>Create Account</Text>
        <Text style={authStyles.subtitle}>Sign up to get started</Text>

        {success && (
          <View style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: "#16a34a", fontSize: 14, textAlign: "center" }}>Account created! Redirecting to login...</Text>
          </View>
        )}

        {error && (
          <View style={{ flexDirection: "row", backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, alignItems: "center" }}>
            <Text style={{ color: "#dc2626", flex: 1, fontSize: 14 }}>{error}</Text>
            <TouchableOpacity onPress={() => dispatch(clearError())}>
              <Ionicons name="close" size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        )}

        <View style={authStyles.formContainer}>
          <View style={authStyles.inputContainer}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[authStyles.textInput, errors.name && { borderColor: "#dc2626" }]}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.textLight}
                  autoCapitalize="words"
                  autoComplete="name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text style={{ color: "#dc2626", fontSize: 13, marginTop: 4 }}>{errors.name.message}</Text>
            )}
          </View>

          <View style={authStyles.inputContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[authStyles.textInput, errors.email && { borderColor: "#dc2626" }]}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text style={{ color: "#dc2626", fontSize: 13, marginTop: 4 }}>{errors.email.message}</Text>
            )}
          </View>

          <View style={authStyles.inputContainer}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    style={[authStyles.textInput, { paddingRight: 44 }, errors.password && { borderColor: "#dc2626" }]}
                    placeholder="Min 8 characters"
                    placeholderTextColor={COLORS.textLight}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <TouchableOpacity style={authStyles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text style={{ color: "#dc2626", fontSize: 13, marginTop: 4 }}>{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[authStyles.authButton, (isLoading || success) && authStyles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || success}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : success ? (
              <Text style={authStyles.buttonText}>Account Created!</Text>
            ) : (
              <Text style={authStyles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={authStyles.linkContainer}>
          <Text style={authStyles.linkText}>
            Already have an account?{" "}
            <Text style={authStyles.link} onPress={() => { dispatch(clearError()); router.back(); }}>
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
