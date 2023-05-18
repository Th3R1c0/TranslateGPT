import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";



const RenderHistory = ({history}) => {
  const entryStyle = {
    border: '1px solid gray',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: 'white',
    marginBottom: '10px',
  }

  return (
    <div>
      {[...history].reverse().map((item, index) => (
        <div key={index} style={entryStyle}>
          <div><b>Input:</b> <br />{item.input}</div>
          <div><b>to {item.targetLanguage}:</b><br/>  {item.output}</div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [UserSentence, setUserSentence] = useState("");
  const [result, setResult] = useState();
  const [targetLanguage, setTargetLanguage] = useState("japanese");
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false);
  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: UserSentence, targetLanguage: targetLanguage }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setLoading(false);
      const entry = {
        input: UserSentence,
        output: data.result,
        targetLanguage: targetLanguage
      }
      setHistory([...history, entry])
      setUserSentence("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>TranslateGPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>TranslateGPT</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor='animal'>Enter a sentence in english</label>
          <input
            type="text"
            name="animal"
            placeholder="Enter a sentence in english"
            value={UserSentence}
            onChange={(e) => setUserSentence(e.target.value)}
          />
          <label for='targetSentence'>Enter Target Language</label>
            <input
            type="text"
            name="targetSentence"
            placeholder="Enter Target Language"
            
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          />
          
          <input type="submit" value={loading ? 'Translating....': 'Translate'} />
        </form>
        <div  className={styles.result}>
          {history.length > 0 ? <><button style={{padding: '5px', marginBottom: '10px', border: '2px solid gray', borderRadius: '5px', color: 'green', width: 'max-content'}} onClick={() => setHistory([])}>X clear history</button> <RenderHistory history={history} /></> : 'no history'}
          
        </div>
      </main>
    </div>
  );
}
