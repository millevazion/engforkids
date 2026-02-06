import Link from "next/link";
import { Rocket } from "lucide-react";

export default function Nav() {
  return (
    <nav className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sunrise text-white">
          <Rocket className="h-5 w-5" />
        </span>
        Engineer Quest
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="rounded-full bg-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
        >
          Mission Progress
        </Link>
        <Link
          href="/library"
          className="rounded-full bg-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
        >
          Artifact Library
        </Link>
        <Link
          href="/beyond"
          className="rounded-full bg-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
        >
          Beyond the Workshop
        </Link>
        <Link
          href="/sources"
          className="rounded-full bg-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
        >
          Sources
        </Link>
      </div>
    </nav>
  );
}
