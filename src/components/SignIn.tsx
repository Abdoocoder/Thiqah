import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-none bg-surface border border-surface-container-highest rounded-2xl",
            headerTitle: "font-bold text-2xl",
            headerSubtitle: "text-on-surface-variant",
            formButtonPrimary: "bg-primary text-on-primary hover:bg-primary/90 rounded-full",
            formFieldInput: "rounded-xl border-outline-variant",
            footerActionLink: "text-primary hover:text-primary/80",
          },
        }}
      />
    </div>
  );
}
