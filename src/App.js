import React from "react";

import randomWords from "random-words";

const NUMB_OF_WORDS = 200;
const SECONDS = 10;

function App() {
  const [words, setWords] = React.useState([]);
  const [countdown, setCountdown] = React.useState(SECONDS);
  const [currentInput, setCurrentInput] = React.useState("");
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentChar, setCurrentChar] = React.useState("");
  const [currentCharIndex, setCurrentCharIndex] = React.useState(-1);
  const [correct, setCorrect] = React.useState(0);
  const [incorrect, setIncorrect] = React.useState(0);
  const [status, setStatus] = React.useState("waiting...");
  const textInput = React.useRef(null);

  React.useEffect(() => {
    setWords(generateWords());
  }, []);

  React.useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  const startCountdown = () => {
    if (status === "finished") {
      setWords(generateWords());
      setCurrentWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrentCharIndex(-1);
      setCurrentChar("");
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrentInput("");
            return SECONDS;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  };

  const generateWords = () => {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  };

  const handleKeyDown = ({ keyCode, key }) => {
    // if space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrentInput("");
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentCharIndex(-1);
      // move to new word
      setCurrentWordIndex(currentWordIndex + 1);
    } else if (keyCode === 8) {
      setCurrentCharIndex(currentCharIndex - 1);
      setCurrentChar("");
    } else {
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar(key);
    }
  };

  const checkMatch = () => {
    const wordToCompare = words[currentWordIndex];
    const isMatch = wordToCompare === currentInput.trim();
    if (isMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  };

  const getCharClass = (wordIdx, charIdx, char) => {
    if (
      wordIdx === currentWordIndex &&
      charIdx === currentCharIndex &&
      currentChar &&
      status !== "finished"
    ) {
      if (char === currentChar) {
        return "has-text-success";
      } else {
        return "has-text-danger";
      }
    } else if (
      wordIdx === currentWordIndex &&
      currentCharIndex >= words[currentWordIndex].length
    ) {
      return "has-text-danger";
    } else {
      return "";
    }
  };

  const markWholeWord = () => {
    return "has-text-success";
  };

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countdown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input
          ref={textInput}
          disabled={status !== "started"}
          onKeyDown={handleKeyDown}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          type="text"
          className="input"
        />
      </div>
      <div className="section">
        <button
          onClick={startCountdown}
          className="button button is-info is-fullwidth"
        >
          Start
        </button>
      </div>

      {status === "started" && (
        <div className="section">
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i} className={markWholeWord}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span key={idx} className={getCharClass(i, idx, char)}>
                          {char}
                        </span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute:</p>
              <p className="has-text-primary is-size-1">{correct}</p>
            </div>
            <div className="column has-text-centered">
              <div className="is-size-5">Accuracy: </div>
              <p className="has-text-info is-size-1">
                {Math.round((correct / (correct + incorrect)) * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
