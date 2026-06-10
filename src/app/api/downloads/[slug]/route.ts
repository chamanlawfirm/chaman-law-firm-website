import { NextResponse } from "next/server";
import { getLeadMagnet } from "@/lib/lead-magnets";

type DownloadRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(value: string, maxLength = 88) {
  if (!value) {
    return [""];
  }

  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}

function createPdf(title: string, lines: string[]) {
  const contentLines = [
    "BT",
    "/F1 20 Tf",
    "72 748 Td",
    `(${escapePdfText(title)}) Tj`,
    "/F1 10 Tf",
    "0 -28 Td",
    ...lines.flatMap((line) =>
      line
        ? wrapText(line).flatMap((wrappedLine) => [`(${escapePdfText(wrappedLine)}) Tj`, "0 -15 Td"])
        : ["0 -9 Td"]
    ),
    "ET"
  ];
  const content = contentLines.join("\n");
  const contentLength = new TextEncoder().encode(content).length;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Root 1 0 R /Size ${objects.length + 1} >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

export async function GET(_request: Request, context: DownloadRouteContext) {
  const { slug } = await context.params;
  const magnet = getLeadMagnet(slug);

  if (!magnet) {
    return NextResponse.json({ ok: false, message: "Download not found" }, { status: 404 });
  }

  const pdf = createPdf(magnet.title, magnet.lines);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${magnet.filename}"`,
      "Cache-Control": "public, max-age=86400"
    }
  });
}
