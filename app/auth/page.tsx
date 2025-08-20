import AuthForm from "@/components/auth-form"

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welkom bij GrafVinder</h1>
          <p className="text-muted-foreground">Log in om graven toe te voegen en herinneringen te delen</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
