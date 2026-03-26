export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Jalur tidak diizinkan' });

    const { falKey } = req.body;
    if (!falKey) return res.status(401).json({ error: 'API Key kosong' });

    try {
        // Mengetuk pintu kasir resmi Fal.ai
        const response = await fetch("https://api.fal.ai/v1/account/billing?expand=credits", {
            method: "GET",
            headers: {
                "Authorization": `Key ${falKey}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error('Kunci tidak valid atau saldo hangus');

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
