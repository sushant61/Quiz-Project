import axios from "axios";
import React, { useState, useContext } from "react";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
  celebrities: 26,
  animals: 27,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";
const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });
  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);
    const resp = await axios(url).catch((err) => console.log(err));
    if (resp) {
      const data = resp.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setWaiting(false);
        setError(false);
      } else {
        setWaiting(true);
        setError(true);
      }
    } else setWaiting(true);
  };
  const nextQuestion = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else openModal();
  };
  const checkAnswer = (value) => {
    if (value) setCorrect(correct + 1);
    nextQuestion();
  };
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    setWaiting(true);
    setCorrect(0);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({ ...quiz, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
  };
  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        modal,
        nextQuestion,
        checkAnswer,
        closeModal,
        handleChange,
        handleSubmit,
        quiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
