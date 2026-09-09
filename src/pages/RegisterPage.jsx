import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MountainSnow, Loader2, AlertCircle } from "lucide-react";
import { AuthShell, Field } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters long.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password, confirmPassword);
      navigate("/planner", { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <Link
        to="/"
        className="mb-8 flex items-center gap-2 font-display text-lg font-extrabold text-ink lg:hidden"
      >
        <span className="surface-brand flex size-8 items-center justify-center rounded-lg text-primary-foreground shadow-sm">
          <MountainSnow className="size-4" />
        </span>
        EthioExplore
      </Link>
      <h1 className="mb-1 font-display text-2xl font-extrabold text-ink">Create your account</h1>
      <p className="mb-7 text-sm text-muted-foreground">
        Start building your Ethiopia itinerary in minutes.
      </p>

      {errorMessage && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Full name"
          placeholder="e.g. Abebe Bikila"
          name="name"
          icon="user"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        <Field
          label="Email address"
          type="email"
          placeholder="you@email.com"
          name="email"
          icon="mail"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        <Field
          label="Password (min. 6 characters)"
          type="password"
          placeholder="••••••••"
          name="password"
          icon="lock"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        <Field
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          name="confirmPassword"
          icon="lock"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

export default RegisterPage;
