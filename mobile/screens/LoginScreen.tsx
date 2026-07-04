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
import { login, clearError } from "@/store/authSlice";
import { authStyles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colour";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      dispatch(login(data));
    },
    [dispatch]
  );

  return (
    <KeyboardAvoidingView
      style={authStyles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={authStyles.title}>Welcome Back</Text>
        <Text style={authStyles.subtitle}>Sign in to continue</Text>

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
                    placeholder="Enter your password"
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
            style={[authStyles.authButton, isLoading && authStyles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={authStyles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={authStyles.linkContainer}>
          <Text style={authStyles.linkText}>
            Don't have an account?{" "}
            <Text
              style={authStyles.link}
              onPress={() => {
                dispatch(clearError());
                router.push("/(auth)/register");
              }}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
