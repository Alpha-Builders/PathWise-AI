import React, { useState, useEffect } from 'react';
import { BookOpen, Beaker, TrendingUp, ArrowRight, ArrowLeft, X,Bell, User  } from 'lucide-react';
import { scienceQuestions, artQuestions, commercialQuestions } from "../data/HighSchoolQuestions";

function HighSchoolPath() {
  const [currentPage, setCurrentPage] = useState('fieldSelection');
  const [selectedField, setSelectedField] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [firstname, setFirstname] = useState('');

  useEffect(() => {
    const getStoredFirstName = () => {
      let name = localStorage.getItem("firstName") || localStorage.getItem("firstname");
      if (name) return name;

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          return parsedUser.firstName || parsedUser.firstname || '';
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
      return '';
    };

    const rawName = getStoredFirstName();
    if (rawName) {
      const formatted =
        rawName.trim().charAt(0).toUpperCase() +
        rawName.trim().slice(1).toLowerCase();
      setFirstname(formatted);
    }
  }, []);

  const getQuestionsForField = (field) => {
    switch(field) {
      case 'science': return scienceQuestions;
      case 'art': return artQuestions;
      case 'commercial': return commercialQuestions;
      default: return [];
    }
  };

  const handleFieldSelection = (field) => {
    setSelectedField(field);
    setCurrentPage('questions');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (answer) => {
    const questions = getQuestionsForField(selectedField);
    const newAnswers = {
      ...answers,
      [currentQuestion]: answer
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers, questions);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCancel = () => {
    setCurrentPage('fieldSelection');
    setSelectedField(null);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const calculateResults = (finalAnswers, questions) => {
    const careerScores = {};

    questions.forEach((q, index) => {
      const answer = finalAnswers[index];
      const weight = answer === 'yes' ? 1 : answer === 'maybe' ? 0.5 : 0;

      Object.entries(q.careerTags).forEach(([career, tagWeight]) => {
        if (!careerScores[career]) {
          careerScores[career] = 0;
        }
        careerScores[career] += weight * tagWeight;
      });
    });

    const sortedCareers = Object.entries(careerScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([career, score]) => ({ career, score }));

    setResults(sortedCareers);
    setCurrentPage('results');
  };

  const resetQuiz = () => {
    setCurrentPage('fieldSelection');
    setSelectedField(null);
    setCurrentQuestion(0);
    setAnswers({});
    setResults([]);
  };

  if (currentPage === 'fieldSelection') {
    return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background blurs */}
      <div
        className="absolute pointer-events-none animate-pulse"
        style={{
          top: '-10%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(1,116,43,0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <div
        className="absolute pointer-events-none animate-pulse"
        style={{
          bottom: '-15%',
          right: '0%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
          animationDelay: '1s'
        }}
      />

      {/* Header */}
      <div className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex justify-between items-center px-8 py-5">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            PATHWISE AI
          </h1>
          <div className="flex gap-6 items-center">
            <button className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-300">
              <Bell className="w-6 h-6 text-gray-300 hover:text-green-400 transition-colors" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300">
              <User className="w-6 h-6 text-gray-300 hover:text-green-400 transition-colors" />
            </button>
          </div>
        </div>
       </div>
           <div className='pt-10'>
            <p className="text-green-400 text-center text-[3rem] mb-2">Let's find your perfect career!</p>
            <p className="text-gray-300 text-xl mb-6 max-w-2xl text-center mx-auto leading-relaxed">
              Select your field of study to get personalized career recommendations based on your interests and skills
            </p>
          </div>

          <div className="bg-green-600 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-[2em] font-semibold text-center mb-4">
              What field are you studying?
            </h3>
            <p className="text-center text-green-100 text-sm mb-8">
              Choose your field to answer 15 tailored questions
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <button
                onClick={() => handleFieldSelection('science')}
                className="bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-200 p-8 rounded-2xl shadow-lg"
              >
                <Beaker className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Science</h2>
                <p className="text-gray-600 text-sm">
                  Medicine, Engineering, Research & Technology
                </p>
              </button>

              <button
                onClick={() => handleFieldSelection('art')}
                className="bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-200 p-8 rounded-2xl shadow-lg"
              >
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Arts</h2>
                <p className="text-gray-600 text-sm">
                  Design, Media, Entertainment & Creative Fields
                </p>
              </button>

              <button
                onClick={() => handleFieldSelection('commercial')}
                className="bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-200 p-8 rounded-2xl shadow-lg"
              >
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Commercial</h2>
                <p className="text-gray-600 text-sm">
                  Business, Finance, Marketing & Management
                </p>
              </button>
            </div>
          </div>

          <div className="mt-20 mb-10">
            <h4 className="text-center text-white text-lg font-semibold mb-6">Popular Fields</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Science", field: "science" },
                { name: "Arts", field: "art" },
                { name: "Commercial", field: "commercial" }
              ].map((item) => (
                <button
                  key={item.field}
                  onClick={() => handleFieldSelection(item.field)}
                  className="px-6 py-3 bg-white backdrop-blur-sm rounded-full border-2 border-green-200 cursor-pointer hover:bg-purple-50 hover:border-orange-300 transition-all duration-200 text-gray-700 font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
     
    );
  }

  if (currentPage === 'questions') {
    const questions = getQuestionsForField(selectedField);
    const currentQ = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="pt-10 px-10">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 text-white font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-green-600 rounded-2xl p-8 shadow-2xl">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-white bg-white/20 px-4 py-1 rounded-full">
                    {selectedField.charAt(0).toUpperCase() + selectedField.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-10 text-center">
                {currentQ.question}
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer('yes')}
                  className="w-full p-6 text-left bg-white hover:bg-gray-50 hover:scale-105 rounded-2xl transition-all duration-200 shadow-lg"
                >
                  <span className="font-bold text-green-600 text-xl">Yes, definitely!</span>
                </button>
                
                <button
                  onClick={() => handleAnswer('maybe')}
                  className="w-full p-6 text-left bg-white hover:bg-gray-50 hover:scale-105 rounded-2xl transition-all duration-200 shadow-lg"
                >
                  <span className="font-bold text-yellow-600 text-xl">Maybe / Sometimes</span>
                </button>
                
                <button
                  onClick={() => handleAnswer('no')}
                  className="w-full p-6 text-left bg-white hover:bg-gray-50 hover:scale-105 rounded-2xl transition-all duration-200 shadow-lg"
                >
                  <span className="font-bold text-red-600 text-xl">No, not really</span>
                </button>
              </div>

              {/* Back Button */}
              {currentQuestion > 0 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-full transition-all duration-200 text-gray-800 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
         {/* Animated background blurs */}
            <div
            className="absolute pointer-events-none animate-pulse"
            style={{
                top: '-10%',
                left: '5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(1,116,43,0.3) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }}
            />
            <div
            className="absolute pointer-events-none animate-pulse"
            style={{
                bottom: '-15%',
                right: '0%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
                animationDelay: '1s'
            }}
            />

            {/* Header */}
            <div className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
            <div className="flex justify-between items-center px-8 py-5">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                PATHWISE AI
                </h1>
                <div className="flex gap-6 items-center">
                <button className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-300">
                    <Bell className="w-6 h-6 text-gray-300 hover:text-green-400 transition-colors" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300">
                    <User className="w-6 h-6 text-gray-300 hover:text-green-400 transition-colors" />
                </button>
                </div>
            </div>
        </div>
        <div className="pt-10 px-10">
          <div className="text-center mb-8">
            <h2 className="text-[4rem] font-bold mb-2">
              Your Career Matches! 🎯
            </h2>
            <p className="text-green-400 text-center text-[2rem]">Based on your answers</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-green-600 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-semibold text-center mb-2">
                Top 3 Career Paths for You
              </h3>
              <p className="text-center text-green-100 mb-8">
                These careers align best with your interests and strengths
              </p>

              <div className="space-y-6 mb-8">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white rounded-2xl shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full text-xl">
                            {index + 1}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {result.career}
                          </h3>
                        </div>
                        <div className="ml-13">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${(result.score / results[0].score) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-green-600">
                              {Math.round((result.score / results[0].score) * 100)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={resetQuiz}
                  className="bg-gray-900 hover:bg-gray-800 hover:scale-105 text-white font-semibold py-4 px-10 rounded-full transition-all duration-200 flex items-center gap-3"
                >
                  Take Quiz Again
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HighSchoolPath;