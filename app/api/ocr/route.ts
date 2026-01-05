import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const image = form.get("image") as File | null;

    if (!image) {
      return NextResponse.json({ error: "No image received" }, { status: 400 });
    }

    const body = new FormData();
    body.append("file", image);
    body.append("apikey", "helloworld");
    body.append("language", "eng");

    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body,
    });

    const json = await res.json();
    const text = json?.ParsedResults?.[0]?.ParsedText || "";

    return NextResponse.json({ text });
  } catch (err) {
    console.log("OCR ERROR:", err);
    return NextResponse.json(
      { text: "", error: "OCR extraction failed" },
      { status: 500 }
    );
  }
}
