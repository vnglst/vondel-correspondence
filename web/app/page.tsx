import Link from "next/link";
import { query } from "@/app/db";

export default async function Home() {
  const letters = await query("SELECT id, sender, recipient, subject FROM letters ORDER BY id ASC");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
      <h1 className="text-4xl font-bold">Letters</h1>
      <h2 className="text-2xl my-2 font-bold">Joost van den Vondel</h2>
      <hr className="w-full my-8 max-w-xs border-slate-500" />
      <ul className="text-center max-w-xl">
        {letters.rows.map((letter) => (
          <li key={letter.id} className="my-4">
            <Link href={`/letter/${letter.id}`}>
              <h3 className="text-xl font-bold">{letter.subject || "No subject"}</h3>
              <p className="text-md">
                {letter.sender || "Unknown"} → {letter.recipient || "Unknown"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
