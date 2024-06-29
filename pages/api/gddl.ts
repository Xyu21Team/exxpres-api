import type { NextApiRequest, NextApiResponse } from 'next';
const FongsiDev_Scraper = require("@fongsidev/scraper");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'Query parameter "url" harus berupa string.' });
  }

  try {
    // Lakukan scraping menggunakan FongsiDev_Scraper
    const result = await FongsiDev_Scraper.Drive(url as string);

    // Kirim hasil scraping sebagai respons
    res.status(200).json(result);
  } catch (error: any) { // Menentukan tipe error sebagai 'any'
    // Tangani error jika scraping gagal
    res.status(500).json({ error: `Gagal melakukan scraping: ${error.message || error}` });
  }
}
