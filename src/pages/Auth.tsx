import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().optional(),
});

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signUp, signIn, signInWithGoogle, isPasswordRecovery, updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password Recovery Form
  if (isPasswordRecovery) {
    return (
      <>
        <Helmet>
          <title>Reset Password | Interior of AI</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center px-8">
          <div className="max-w-md w-full">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="font-display text-2xl font-bold">Interior of AI</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Set New Password</h1>
            <p className="text-muted-foreground mb-6">Enter your new password below.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (newPassword.length < 6) {
                  toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
                  return;
                }
                if (newPassword !== confirmPassword) {
                  toast({ title: "Passwords don't match", description: "Please make sure both passwords match.", variant: "destructive" });
                  return;
                }
                setIsLoading(true);
                const { error } = await updatePassword(newPassword);
                setIsLoading(false);
                if (error) {
                  toast({ title: "Error", description: error.message, variant: "destructive" });
                } else {
                  toast({ title: "Password updated!", description: "You can now sign in with your new password." });
                  navigate("/");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-0",
                      "text-foreground placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary"
                    )}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-0",
                      "text-foreground placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary"
                    )}
                  />
                </div>
              </div>
              <Button type="submit" variant="gold" className="w-full py-6" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({ title: "Google sign in failed", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const validateForm = () => {
    try {
      authSchema.parse({ email, password, displayName });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") newErrors.email = err.message;
          if (err.path[0] === "password") newErrors.password = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ title: "Account exists", description: "This email is already registered. Please sign in instead.", variant: "destructive" });
          } else {
            toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
          }
          return;
        }
        // Don't navigate — show verification message instead
        toast({
          title: "Check your email",
          description: "We've sent you a verification link. Please check your inbox to confirm your account.",
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Sign in failed", description: "Invalid email or password. Please try again.", variant: "destructive" });
          return;
        }
        toast({ title: "Welcome back!", description: "You've signed in successfully." });
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? "Sign Up" : "Sign In"} | Interior of AI</title>
        <meta name="description" content="Sign in to Interior of AI to save your favorite AI-generated interior designs and build your personal collection." />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="max-w-md mx-auto w-full">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
                <span className="font-display text-2xl font-bold">Interior of AI</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp ? "Join our community of design enthusiasts" : "Sign in to access your saved designs"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className={cn("w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-0", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary")}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={cn("w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-0", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary", errors.email && "ring-2 ring-destructive")}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn("w-full pl-10 pr-12 py-3 rounded-xl bg-secondary border-0", "text-foreground placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-primary", errors.password && "ring-2 ring-destructive")}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>

              {!isSignUp && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        toast({ title: "Enter your email first", description: "We need your email to send a reset link.", variant: "destructive" });
                        return;
                      }
                      try {
                        await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
                        setForgotPasswordSent(true);
                        toast({ title: "Check your email", description: "We've sent you a password reset link." });
                      } catch {
                        toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
                      }
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    {forgotPasswordSent ? "Reset link sent ✓" : "Forgot password?"}
                  </button>
                </div>
              )}

              <Button type="submit" variant="gold" className="w-full py-6" disabled={isLoading}>
                {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full py-6" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-6">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }} className="text-primary hover:underline font-medium">
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="hidden lg:flex flex-1 bg-gradient-card items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-gold flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Save Your Favorite Designs</h2>
            <p className="text-muted-foreground text-lg">Create a personal collection of AI-generated interior designs. Never lose inspiration again.</p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient-gold">∞</div>
                <div className="text-xs text-muted-foreground">Unlimited Saves</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient-gold">10+</div>
                <div className="text-xs text-muted-foreground">Design Styles</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient-gold">AI</div>
                <div className="text-xs text-muted-foreground">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
