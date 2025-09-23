import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const { signInWithUsername, registerWithUsername, signInWithGoogle, usernameToEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formError, setFormError] = useState<string | null>(null);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-foreground">
            {mode === "login" ? "Masuk ke Dashboard" : "Daftar Akun Baru"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Gunakan username sekolah atau masuk dengan Google."
              : "Buat akun admin dengan username unik dan password aman."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField id="username" label="Username" error={errors.username}>
              <Input id="username" placeholder="contoh: operator" autoComplete="username" {...register("username")} />
            </FormField>
            <FormField id="password" label="Password" error={errors.password}>
              <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
            </FormField>
            {mode === "register" ? (
              <FormField id="displayName" label="Nama Lengkap" error={errors.displayName}>
                <Input id="displayName" placeholder="Nama Lengkap" {...register("displayName")} />
              </FormField>
            ) : null}
            {formError ? <p className="text-sm font-medium text-destructive">{formError}</p> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
            </Button>
          </form>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase text-muted-foreground">atau</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              setFormError(null);
              try {
                await signInWithGoogle();
              } catch (error) {
                setFormError(firebaseErrorMessage(error));
              }
            }}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Masuk dengan Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button type="button" className="font-medium text-primary" onClick={toggleMode}>
              {mode === "login" ? "Daftar sekarang" : "Masuk"}
            </button>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Username akan otomatis dikonversi menjadi alamat email internal (contoh:{" "}
            <code className="rounded bg-muted px-1">{usernameToEmail("operator")}</code>) untuk proses autentikasi Firebase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
