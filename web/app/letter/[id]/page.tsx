import Link from "next/link";
import { query } from "@/app/db";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export async function generateStaticParams() {
  const { rows } = await query("SELECT id FROM letters");
  return rows.map((row) => ({
    id: row.id.toString(),
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const { rows } = await query(
    "SELECT markdown, start_page, end_page, sender, recipient, subject, send_date, location, geolocation, language, summary, english FROM letters WHERE id = $1",
    [params.id]
  );

  const {
    markdown,
    start_page,
    end_page,
    sender,
    recipient,
    subject,
    send_date,
    location,
    geolocation,
    language,
    summary,
    english,
  } = rows[0];

  const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify);
  const parsedLetter = processor.processSync(markdown).toString();
  const parsedEnglish = processor.processSync(english).toString();

  // fetch previous letter id from database
  const previousLetter = await query("SELECT id FROM letters WHERE id < $1 ORDER BY id DESC LIMIT 1", [params.id]);

  // fetch next letter id from database
  const nextLetter = await query("SELECT id FROM letters WHERE id > $1 ORDER BY id ASC LIMIT 1", [params.id]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-6 lg:p-24">
      <nav className="grid grid-cols-1 lg:grid-cols-2 w-full gap-y-1">
        <div className="flex mr-4">
          <Link href="/">← Home</Link>
          {previousLetter.rows.length > 0 ? (
            <Link href={`/letter/${previousLetter.rows[0].id}`} className="ml-auto">
              ← Previous
            </Link>
          ) : null}
        </div>
        <div className="flex ml-4">
          {nextLetter.rows.length > 0 ? <Link href={`/letter/${nextLetter.rows[0].id}`}>Next →</Link> : null}

          <span className="text-sm ml-auto">
            Page{" "}
            <Link href={`/page/${start_page}`} className="underline">
              {start_page}
            </Link>
            {start_page !== end_page ? (
              <>
                {" "}
                to{" "}
                <Link href={`/page/${end_page}`} className="underline">
                  {end_page}
                </Link>
              </>
            ) : null}
          </span>
        </div>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg py-4">ORIGINAL</h3>
          <div className="prose" dangerouslySetInnerHTML={{ __html: parsedLetter }} />
        </div>
        <div>
          <h3 className="text-lg py-4">TRANSLATION</h3>
          <div className="prose" dangerouslySetInnerHTML={{ __html: parsedEnglish }} />
        </div>
        <div className="bg-gray-200 p-4 mt-8">
          <h3 className="mb-4 text-lg font-bold">Metadata</h3>
          <ul>
            <li>
              <strong>Sender: </strong>
              {sender || "Unknown"}
            </li>
            <li>
              <strong>Recipient: </strong>
              {recipient || "Unknown"}
            </li>
            <li>
              <strong>Subject: </strong>
              {subject || "Unknown"}
            </li>
            <li>
              <strong>Send Date: </strong>
              {new Date(send_date).toLocaleDateString("en", { year: "numeric" })}
            </li>
            <li>
              <strong>Location: </strong>
              {location || "Unknown"}
            </li>
            <li>
              <strong>Geolocation: </strong>
              {geolocation ? (
                <a
                  className="underline"
                  href={`https://www.google.com/maps/search/?api=1&query=${geolocation[0]},${geolocation[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {geolocation.join(", ")}
                </a>
              ) : (
                "Unknown"
              )}
            </li>
            <li>
              <strong>Language: </strong>
              {language || "Unknown"}
            </li>
            <li>
              <strong>Summary: </strong>
              {summary}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
