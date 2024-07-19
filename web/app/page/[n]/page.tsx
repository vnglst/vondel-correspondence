import Link from "next/link";
import { query } from "@/app/db";
import Image from "next/image";

export async function generateStaticParams() {
  const { rows } = await query("SELECT page_number FROM pages");
  const pageNumbers = rows.map((row) => row.page_number);

  return pageNumbers.map((pageNumber) => ({
    n: pageNumber.toString(),
  }));
}

export default async function Page({ params }: { params: { n: string } }) {
  const { rows } = await query(
    "SELECT page_number, image_jpeg, ocr_text, ocr_improved FROM pages WHERE page_number = $1",
    [params.n]
  );

  const { page_number, image_jpeg, ocr_text, ocr_improved } = rows[0];
  const base64Image = Buffer.from(image_jpeg).toString("base64");

  // fetch connected letter from database
  const connectedLetter = await query("SELECT id FROM letters WHERE start_page <= $1 AND end_page >= $1", [params.n]);
  const connectedLetterId = connectedLetter.rows[0]?.id;

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-6 lg:p-24">
      <nav className="flex flex-col lg:flex-row justify-between w-full mb-4 italic bg-slate-300 p-4 text-sm">
        {connectedLetterId ? <Link href={`/letter/${connectedLetterId}`}>← Go to letter</Link> : null}
        <div className="flex flex-row justify-between ml-auto gap-2">
          <Link href={`/page/${parseInt(params.n) - 1}`}>← Previous</Link>
          <span className="px-2"> {page_number} </span>
          <Link href={`/page/${parseInt(params.n) + 1}`}>Next →</Link>
        </div>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 gap-y-8">
        <div>
          <h3 className="text-lg font-bold py-4">OCR</h3>
          <p>{ocr_text}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold py-4">OCR + GPT-4o</h3>
          <p>{ocr_improved}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold py-4">Image</h3>
          <div style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <Image alt="" src={`data:image/jpeg;base64,${base64Image}`} width={1162} height={1762} />
          </div>
        </div>
      </div>
    </main>
  );
}
