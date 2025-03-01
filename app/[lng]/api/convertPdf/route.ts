import { NextRequest, NextResponse } from "next/server";
import { fromPath } from "pdf2pic";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import fs from "fs/promises";


async function mergeImages(imagePaths: string[], outputPath: string) {
    const images = await Promise.all(imagePaths.map((path) => sharp(path).toBuffer()));
    const { width, height } = await sharp(imagePaths[0]).metadata();
    await sharp({
      create: {
        width: width!,
        height: height! * imagePaths.length,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      },
      limitInputPixels: false
    })
    .composite(images.map((img, i) => ({ input: img, top: i * 1000, left: 0 })))
    .toFile(outputPath);

    //console.log(outputPath);

    return outputPath;
    
  }

export async function POST(req: NextRequest) {
  try {
    const { pdfUrl } = await req.json();
    //console.log(pdfUrl)
    if (!pdfUrl) {
      return NextResponse.json({ error: "Missing PDF URL" }, { status: 400 });
    }

    // Generate a unique filename
    const tempPdfName = `${uuidv4()}.pdf`;
    const tempPdfPath = path.join("/tmp", tempPdfName); // Use system temp folder

    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(tempPdfPath, Buffer.from(buffer));

    // Ensure file exists before converting
    await fs.access(tempPdfPath);

    // Output directory
    const outputDir = path.join(process.cwd(), "public", "images");
    await fs.mkdir(outputDir, { recursive: true });

    // Convert PDF to Image
    const converter = fromPath(tempPdfPath, {
      density: 300,
      savePath: outputDir,
      format: "png",
      width: 1000,
      height: 1414,
    });

    const results = await converter.bulk(-1);

    const imagePaths = results.map(result => result.path!);
    //console.log(imagePaths);
    const combinedPath = path.join(outputDir, "combined.png");
    const outPath = await mergeImages(imagePaths, combinedPath);
    //console.log("DONE");
    // Cleanup
    await fs.unlink(tempPdfPath);

    return NextResponse.json({ success: true, imagePath: outPath });
  } catch (error) {
    console.error("Error processing IPFS PDF:", error);
    return NextResponse.json({ error: "Failed to convert PDF" }, { status: 500 });
  }
}
