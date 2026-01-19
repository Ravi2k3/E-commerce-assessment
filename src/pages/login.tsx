import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl z-10">
                <LoginForm />
            </div>
        </div>
    )
}
