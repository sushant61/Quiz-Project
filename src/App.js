import React from "react";
import { useGlobalContext } from "./context";

import SetupForm from "./SetupForm";
import Loading from "./Loading";
import Modal from "./Modal";
function App() {
  const {
    waiting,
    loading,
    questions,
    index,
    correct,
    nextQuestion,
    checkAnswer,
  } = useGlobalContext();
  if (waiting) return <SetupForm />;
  if (loading) return <Loading />;
  const { correct_answer, question, incorrect_answers } = questions[index];
  let answers = [...incorrect_answers];
  const temp = Math.floor(Math.random() * 4);
  if (temp === 3) answers.push(correct_answer);
  else {
    answers.push(answers[temp]);
    answers[temp] = correct_answer;
  }
  return (
    <main>
      <Modal />
      <section className="quiz">
        <p className="correct-answers">
          correct answers : {correct}/{index}
        </p>
        <article className="container">
          <h2 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="btn-container">
            {answers.map((ans, idx) => {
              return (
                <button
                  key={idx}
                  className="answer-btn"
                  dangerouslySetInnerHTML={{ __html: ans }}
                  onClick={() => checkAnswer(correct_answer === ans)}
                />
              );
            })}
          </div>
        </article>
        <button
          className="next-question"
          onClick={() => {
            nextQuestion();
          }}
        >
          next question
        </button>
      </section>
    </main>
  );
}

export default App;
