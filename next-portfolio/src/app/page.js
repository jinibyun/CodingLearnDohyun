import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <Image
        src="/testImage.jpg"
        alt="Test image"
        width={300}
        height={300}
        priority
      />
    </main>
  );
}
