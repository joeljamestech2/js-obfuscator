const JavaScriptObfuscator = require("javascript-obfuscator");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { code, level } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Missing 'code' in request body" });
    }

    // 🔹 Obfuscation levels
    const presets = {
      low: {
        compact: true,
        stringArray: false,
      },
      medium: {
        compact: true,
        stringArray: true,
        rotateStringArray: true,
      },
      high: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        stringArrayEncoding: ["rc4"],
        rotateStringArray: true,
      },
    };

    const options = presets[level?.toLowerCase()] || presets.medium;

    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, options);

    res.status(200).json({
      level: level || "medium",
      original: code,
      obfuscated: obfuscationResult.getObfuscatedCode(),
    });
  } catch (err) {
    res.status(500).json({ error: "Obfuscation failed", details: err.message });
  }
}