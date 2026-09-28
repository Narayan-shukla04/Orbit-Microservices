"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await apiFetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            router.push("/");
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : "Unable to sign in.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" />
            <section className="auth-card">
                <div className="auth-brand"><span className="auth-brand-mark">o</span><span>Launch club</span></div>
                <div className="auth-intro"><div className="auth-kicker"><Sparkles size={13} /> Your people are here</div><h1>Good to see you again.</h1><p>Pick up where you left off with the people and projects that matter.</p></div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required autoComplete="email" /></label>
                    <label>Password<div className="auth-input-wrap"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required minLength={8} autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
                    <div className="auth-row"><label className="check-label"><input type="checkbox" /> Remember me</label><Link href="/auth/forgot-password">Forgot password?</Link></div>
                    <button className="auth-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 size={17} className="spin" /> : <ArrowRight size={17} />}{isSubmitting ? "Signing in..." : "Sign in"}</button>
                </form>
                <div className="auth-divider"><span>or continue with</span></div>
                <a className="google-button" href="http://localhost:3000/api/auth/google"><span>G</span> Google</a>
                <p className="auth-footer">New to the club? <Link href="/auth/register">Create an account</Link></p>
                <div className="auth-security"><LockKeyhole size={13} /> Your session is protected with secure cookies</div>
            </section>
            <aside className="auth-side-note"><Mail size={16} /><span>Small teams. Clear work. Better conversations.</span></aside>
        </main>
    );
}