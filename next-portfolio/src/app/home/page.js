export default function HomePage() {
	return (
		<main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-14">
			<section className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
				<p className="mb-4 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-700">
					WELCOME
				</p>
				<h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
					안녕하세요, 도현의 포트폴리오입니다
				</h1>
				<p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
					Next.js와 Tailwind CSS로 구성한 첫 프로젝트 공간입니다. 앞으로 만든
					웹 서비스, UI 실험, 풀스택 결과물을 차곡차곡 정리해 보여드릴 예정입니다.
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700">
						Next.js
					</span>
					<span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700">
						Tailwind CSS
					</span>
					<span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700">
						JavaScript
					</span>
				</div>
			</section>
		</main>
	);
}
