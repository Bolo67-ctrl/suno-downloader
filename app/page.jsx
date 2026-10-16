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
  const type = useMemo(() => getType(link), [link]);
  function submit(e) { e.preventDefault(); setChecked(true); }

  let safe = "";
  try {
    const u = new URL(link.trim());
    if (["http:", "https:"].includes(u.protocol)) safe = u.href;
  } catch {}

  return (
    <main className="shell">
      <nav>
        <a className="brand" href="/"><span className="mark">♫</span> sonora<span className="lime">.</span></a>
        <span className="pill"><i /> Music link tool</span>
      </nav>
      <section className="hero">
        <div className="eyebrow">✳ &nbsp; YOUR MUSIC, YOUR WAY</div>
        <h1>Your next track.<br /><span>One link away.</span></h1>
        <p className="intro">Paste your Suno share link to get to your track and its official download options. Direct audio-file links can also be opened here.</p>
        <div className="panel">
          <div className="panel-head">
            <span className="music">♫</span>
            <div><h2>Song link</h2><p>Suno share links or direct audio URLs</p></div>
          </div>
          <form onSubmit={submit}>
            <label htmlFor="song">PASTE YOUR LINK</label>
            <div className="input">
              <span>↗</span>
              <input id="song" type="url" placeholder="https://suno.com/s/your-song" value={link} onChange={e => { setLink(e.target.value); setChecked(false); }} required />
              {link && <button type="button" className="clear" onClick={() => { setLink(""); setChecked(false); }}>×</button>}
            </div>
            <button className="primary" type="submit">Get download options <span>→</span></button>
          </form>
          {checked && <div className="result">
            <strong>{type === "suno" ? "Your Suno track is ready to open" : type === "audio" ? "Direct audio link detected" : type === "other" ? "Link looks valid" : "Please check the link"}</strong>
            <p>{type === "suno"
              ? "For a Suno link, downloads must be made through Suno’s available download options. Open the song, sign in if asked, then use the More Actions (•••) menu and choose Download. Available downloads depend on your account."
              : type === "audio"
                ? "This looks like a direct audio file. Use the button to open it; your browser or the file host determines whether it downloads or plays."
                : "Paste a valid http or https link. A Suno share link or direct audio URL works best."}</p>
            {safe && type !== "invalid" && <a href={safe} target="_blank" rel="noreferrer" className="result-link">{type === "suno" ? "Open song on Suno" : type === "audio" ? "Open audio file" : "Open link"} ↗</a>}
            {type === "suno" && <p><a href="https://help.suno.com/en/articles/13876865" target="_blank" rel="noreferrer">Read Suno’s official download guide ↗</a></p>}
          </div>}
          <div className="privacy">⌁ &nbsp; No account required · We don’t store your links</div>
        </div>
        <div className="steps">
          <div><b>01</b><section><strong>Copy your link</strong><p>Copy the share URL from Suno.</p></section></div>
          <div><b>02</b><section><strong>Get options</strong><p>We identify the link type.</p></section></div>
          <div><b>03</b><section><strong>Save your track</strong><p>Use an available official download or direct audio file.</p></section></div>
        </div>
      </section>
      <footer>
        <strong>sonora<span className="lime">.</span></strong>
        <p>Independent link helper. Not affiliated with Suno.</p>
        <small>Downloads are available only through methods the source makes available.</small>
      </footer>
    </main>
  );
}
