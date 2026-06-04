"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const handleSignUp = async () => {
		setLoading(true);
		setError("");
		setMessage("");

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			setError(error.message);
		} else {
			setMessage("가입 성공! 이메일을 확인해주세요.");
		}

		setLoading(false);
	};

	const handleLogin = async () => {
		setLoading(true);
		setError("");
		setMessage("");

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			setError(error.message);
		} else {
			setMessage("로그인 성공!");
			router.replace("/profile");
			router.refresh();
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
				<h1 className="text-2xl font-bold text-slate-900 text-center">로그인 / 회원가입</h1>
				<p className="mt-2 text-center text-sm text-slate-600">이메일과 비밀번호를 입력해 주세요.</p>

				<form
					className="mt-6 space-y-4"
					onSubmit={(event) => {
						event.preventDefault();
					}}
				>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-slate-700">
							이메일
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="you@example.com"
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-400"
							required
							disabled={loading}
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-slate-700">
							비밀번호
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="비밀번호를 입력하세요"
							className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-400"
							required
							disabled={loading}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3 pt-2">
						<button
							type="button"
							onClick={handleLogin}
							disabled={loading}
							className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? "처리 중..." : "로그인"}
						</button>
						<button
							type="button"
							onClick={handleSignUp}
							disabled={loading}
							className="rounded-md bg-slate-200 px-4 py-2 text-slate-900 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? "처리 중..." : "회원가입"}
						</button>
					</div>

					{error ? <p className="text-sm text-red-600">{error}</p> : null}
					{message ? <p className="text-sm text-emerald-600">{message}</p> : null}
				</form>
			</div>
		</div>
	);
}
