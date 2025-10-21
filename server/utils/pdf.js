import PDFDocument from "pdfkit";

export function buildManifestPDF({ site, devices, progress }) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.fontSize(18).text("True911+ Staging Manifest", { underline: true });
  doc.moveDown().fontSize(12)
    .text(`Site: ${site.site_id} – ${site.name}`)
    .text(`Address: ${site.address}`)
    .text(`Status: ${site.status}`)
    .moveDown()
    .text("Devices:");

  devices.forEach((d, i) => {
    doc.text(
      `${i + 1}. ${d.type} | ID: ${d.device_id} | Serial/IMEI: ${d.imei || d.serial || "—"} | ICCID: ${d.iccid || "—"} | Status: ${d.status}`
    );
  });

  doc.moveDown().text(`Staging Progress: ${progress.scanned}/${progress.total} scanned, ${progress.configured} configured, ${progress.validated} validated, ${progress.shipped} shipped`);
  doc.moveDown().text(`Generated: ${new Date().toISOString()}`);

  doc.end();
  return doc;
}
