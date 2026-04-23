import Link from "next/link";
import { Button } from "@/components/ui/button";

function PlusIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 5v14" />
			<path d="M5 12h14" />
		</svg>
	);
}

export default function ShadcnTestPage() {
	return (
		<main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-12">
			<section className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">shadcn Button Demo</h1>
				<p className="text-zinc-600">
					`components/ui/button.jsx`의 주요 사용법을 한 페이지에 정리했습니다.
				</p>
			</section>

			<section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold">1) Variant</h2>
				<div className="flex flex-wrap gap-3">
					<Button>Default</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="link">Link</Button>
				</div>
			</section>

			<section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold">2) Size</h2>
				<div className="flex flex-wrap items-center gap-3">
					<Button size="default">default</Button>
					<Button size="xs">xs</Button>
					<Button size="sm">sm</Button>
					<Button size="lg">lg</Button>
					<Button size="icon" aria-label="Add item">
						<PlusIcon />
					</Button>
					<Button size="icon-xs" aria-label="Add item extra small">
						<PlusIcon />
					</Button>
					<Button size="icon-sm" aria-label="Add item small">
						<PlusIcon />
					</Button>
					<Button size="icon-lg" aria-label="Add item large">
						<PlusIcon />
					</Button>
				</div>
			</section>

			<section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold">3) asChild</h2>
				<div className="flex flex-wrap gap-3">
					<Button asChild>
						<Link href="/about">Go to About</Link>
					</Button>
					<Button asChild variant="outline">
						<a href="https://nextjs.org" target="_blank" rel="noreferrer">
							Open Next.js
						</a>
					</Button>
				</div>
			</section>

			<section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold">4) Disabled</h2>
				<div className="flex flex-wrap gap-3">
					<Button disabled>Disabled</Button>
					<Button variant="outline" disabled>
						Disabled Outline
					</Button>
				</div>
			</section>
		</main>
	);
}
