export default function AboutPage() {
	return (
		<main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
			<section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:grid-cols-3 sm:p-10">
				<div className="sm:col-span-2">
					<p className="mb-3 inline-flex rounded-full bg-black px-3 py-1 text-xs font-semibold tracking-wide text-white">
						ABOUT ME
					</p>
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
						About Me
					</h1>
					<p className="mt-5 text-base leading-7 text-zinc-700 sm:text-lg">
						안녕하세요, AI 풀스택 개발자 도현입니다.
					</p>
					<p className="mt-3 text-base leading-7 text-zinc-600">
						문제 정의부터 사용자 경험 설계, 프론트엔드 구현, 백엔드 연동까지
						하나의 흐름으로 완성하는 개발을 좋아합니다. 특히 AI 기능을 실제
						서비스에 녹여내는 데 관심이 많습니다.
					</p>
				</div>
				<div className="rounded-xl bg-zinc-50 p-5">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
						Core Skills
					</h2>
					<ul className="mt-4 space-y-2 text-sm text-zinc-700">
						<li>React / Next.js 기반 UI 개발</li>
						<li>Node.js 기반 API 설계 및 구현</li>
						<li>AI 기능 연동 및 제품화</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
