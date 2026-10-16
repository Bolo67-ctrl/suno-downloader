"use client";
import { useMemo, useState } from "react";

function getType(value) {
  try {
    const u = new URL(value.trim());
    if (!["https:", "http:"].includes(u.protocol)) return "invalid";
    if (u.hostname === "suno.com" || u.hostname.endsWith(".suno.com")) return "suno";
    if (/\.(mp3|wav|m4a|ogg|flac)$/i.test(u.pathname)) return "audio";
    return "other";
  } catch {
    return "invalid";
  }
}

export default function Home() {
  const [link, setLink] = useState("");
  const [checked, setChecked] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const type = useMemo(() => getType(link), [link]);
  function submit(e) { e.preventDefault(); setChecked(true); setDownloadStatus(""); }

  let safe = "";
  try {
    const u = new URL(link.trim());
    if (["http:", "https:"].includes(u.protocol)) safe = u.href;
  } catch {}

  async function downloadAudio() {
    if (!safe || type !== "audio") return;
    setDownloadStatus("Trying to download the audio file…");
    try {
      const response = await fetch(safe);
      if (!response.ok) throw new Error("The audio host did not allow this request.");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const pathname = new URL(safe).pathname;
      a.href = objectUrl;
      a.download = pathname.split("/").pop() || "audio-download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setDownloadStatus("Download started. Check your browser’s downloads.");
    } catch {
      setDownloadStatus("This host blocks direct downloading from other websites. Open the audio file below, then use your browser’s download/save option if available.");
    }
  }

  return (
    <main className="shell">
      <nav>
        <a className="brand" href="/"><span className="mark">♫</span> sonora<span className="lime">.</span></a>
        <span className="pill"><i /> Music link tool</span>
      </nav>
      <section className="hero">
        <div className="eyebrow">✳ &nbsp; YOUR MUSIC, YOUR WAY</div>
        <h1>Your next track.<br /><span>One link away.</span></h1>
        <p className="intro">Paste a direct audio-file URL to try downloading it here, or paste a Suno share link to open your track and its official options.</p>
        <div className="panel">
          <div className="panel-head">
            <span className="music">♫</span>
            <div><h2>Song link</h2><p>Suno share links or direct audio URLs</p></div>
          </div>
          <form onSubmit={submit}>
            <label htmlFor="song">PASTE YOUR LINK</label>
            <div className="input">
              <span>↗</span>
              <input id="song" type="url" placeholder="https://example.com/song.mp3" value={link} onChange={e => { setLink(e.target.value); setChecked(false); setDownloadStatus(""); }} required />
              {link && <button type="button" className="clear" onClick={() => { setLink(""); setChecked(false); setDownloadStatus(""); }}>×</button>}
            </div>
            <button className="primary" type="submit">Get download options <span>→</span></button>
          </form>
          {checked && <div className="result">
            <strong>{type === "suno" ? "Suno share link detected" : type === "audio" ? "Direct audio file detected" : type === "other" ? "Link looks valid, but may not be an audio file" : "Please check the link"}</strong>
            <p>{type === "suno"
              ? "This share link does not expose a downloadable audio file to this tool. Open your track and use a download option available to your account."
              : type === "audio"
                ? "Try downloading the audio directly. This works when the file host allows cross-site access; otherwise open the file and use the browser’s save option."
                : "Paste a valid http or https link. A direct .mp3, .wav, .m4a, .ogg, or .flac URL works best."}</p>
            {safe && type === "audio" && <button type="button" className="primary" onClick={downloadAudio}>Download audio file <span>↓</span></button>}
            {safe && type !== "invalid" && <a href={safe} target="_blank" rel="noreferrer" className="result-link">{type === "suno" ? "Open song on Suno" : type === "audio" ? "Open audio file (fallback)" : "Open link"} ↗</a>}
            {downloadStatus && <p role="status">{downloadStatus}</p>}
            {type === "suno" && <p><a href="https://help.suno.com/en/articles/13876865" target="_blank" rel="noreferrer">Read Suno’s official download guide ↗</a></p>}
          </div>}
          <div className="privacy">⌁ &nbsp; No account required · We don’t store your links</div>
        </div>
        <div className="steps">
          <div><b>01</b><section><strong>Paste your link</strong><p>Use a direct audio-file URL or a Suno share link.</p></section></div>
          <div><b>02</b><section><strong>Check the link</strong><p>We identify the kind of URL you provided.</p></section></div>
          <div><b>03</b><section><strong>Download or open</strong><p>Direct file downloads depend on host permissions.</p></section></div>
        </div>
      </section>
      <footer>
        <strong>sonora<span className="lime">.</span></strong>
        <p>Independent link helper. Not affiliated with Suno.</p>
        <small>Only download audio you own or have permission to save.</small>
      </footer>
    </main>
  );
}
