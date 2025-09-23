import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { Chrome, Lock, User, Eye, EyeOff, Sparkles, Shield, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import FormField from "../components/forms/FormField";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";

const authSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  displayName: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

const firebaseErrorMessage = (error: unknown) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Username atau password tidak valid.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan login. Coba lagi beberapa saat lagi.";
      case "auth/email-already-in-use":
        return "Username sudah terdaftar. Silakan gunakan nama lain.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan yang tidak diketahui.";
};

const LoginPage = () => {
  const { signInWithUsername, registerWithUsername, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setFormError(null);
    try {
      if (mode === "login") {
        await signInWithUsername(values.username, values.password);
      } else {
        if (!values.displayName || values.displayName.trim().length < 2) {
          setError("displayName", { type: "manual", message: "Nama lengkap wajib diisi" });
          return;
        }
        await registerWithUsername(values.username, values.password, values.displayName.trim());
      }
      reset();
    } catch (error) {
      const message = firebaseErrorMessage(error);
      setFormError(message);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setFormError(null);
    reset();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-blue-900/20 dark:to-blue-800/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-300/10 to-blue-500/10 blur-2xl"
        />
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-100, -120, -100],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute h-2 w-2 rounded-full bg-blue-500/40"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="relative z-10 w-full max-w-md p-6"
      >
        <Card className="relative overflow-hidden rounded-3xl border-0 bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-gray-900/80">
          {/* Card Header Decoration */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />
          
          <CardHeader className="relative space-y-4 pb-8 pt-8 text-center">
            {/* Icon Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  {mode === "login" ? (
                    <Lock className="h-8 w-8 text-white" />
                  ) : (
                    <UserPlus className="h-8 w-8 text-white" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
                  </motion.span>
                </AnimatePresence>
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={mode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mode === "login"
                      ? "Masuk ke dashboard dengan akun Anda"
                      : "Daftar untuk mengakses sistem manajemen"}
                  </motion.span>
                </AnimatePresence>
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Username Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FormField id="username" label="Username" error={errors.username}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="username"
                      placeholder="Masukkan username"
                      autoComplete="username"
                      className="pl-10 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
                      {...register("username")}
                    />
                  </div>
                </FormField>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <FormField id="password" label="Password" error={errors.password}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      className="pl-10 pr-10 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>
              </motion.div>

              {/* Display Name Field for Register */}
              <AnimatePresence>
                {mode === "register" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, x: -20 }}
                    animate={{ height: "auto", opacity: 1, x: 0 }}
                    exit={{ height: 0, opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField id="displayName" label="Nama Lengkap" error={errors.displayName}>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="displayName"
                          placeholder="Masukkan nama lengkap"
                          className="pl-10 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
                          {...register("displayName")}
                        />
                      </div>
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="rounded-xl bg-red-50 border border-red-200 p-3 dark:bg-red-900/20 dark:border-red-800"
                  >
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {formError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-900 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                  disabled={isSubmitting}
                >
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    animate={isSubmitting ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0 }}
                  >
                    {isSubmitting && <Sparkles className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Memproses..." : mode === "login" ? "Masuk Sekarang" : "Daftar Sekarang"}
                  </motion.div>
                </Button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-600" />
              <span className="text-xs font-medium uppercase text-blue-600 tracking-wider bg-white px-3 py-1 rounded-full dark:bg-gray-800 dark:text-blue-400">
                atau
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-600" />
            </motion.div>

            {/* Google Sign In */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-gray-200 bg-white py-3 font-medium transition-all hover:bg-gray-50 hover:scale-[1.02] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={async () => {
                  setFormError(null);
                  try {
                    await signInWithGoogle();
                  } catch (error) {
                    setFormError(firebaseErrorMessage(error));
                  }
                }}
              >
                <Chrome className="mr-3 h-5 w-5 text-blue-600" />
                Masuk dengan Google
              </Button>
            </motion.div>

            {/* Toggle Mode */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  type="button"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors dark:text-blue-500 dark:hover:text-blue-400"
                  onClick={toggleMode}
                >
                  {mode === "login" ? "Daftar sekarang" : "Masuk di sini"}
                </button>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
