export default async function handler(req, res) {
    // Cuma terima jalur POST yang aman
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Jalur tidak diizinkan, Bos!' });
    }

    // Tangkap data dari web babeh.ai
    const { falKey, prompt, imageUrl, mode } = req.body;

    if (!falKey) {
        return res.status(401).json({ error: 'Kunci API kosong!' });
    }

    try {
        // Tentukan model AI berdasarkan mode (Gambar atau Video)
        const endpoint = mode === 'foto' 
            ? "https://queue.fal.run/fal-ai/fast-sdxl" 
            : "https://queue.fal.run/fal-ai/kling-video/v1/standard/image-to-video";

        // Susun paket data untuk dikirim ke Fal.ai
        const payload = mode === 'foto' 
            ? { prompt: prompt, image_size: "portrait_4_3" }
            : { prompt: prompt, image_url: imageUrl };

        // Tembak server Fal.ai beneran!
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Key ${falKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Cek kalau saldo pelanggan habis atau kunci salah
        if (!response.ok) {
            throw new Error(data.detail || 'Gagal konek ke AI Fal.ai');
        }

        // Kembalikan hasil asli ke web Bos
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
