import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main>
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          style={{
            maxWidth: "100%",
            height: "auto"
          }}
        />
      </main>
    </div>
  )
} 