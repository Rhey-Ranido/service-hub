const surveyData = {
  // Legend for the rating scale
  legend: {
    5: "Excellent",
    4: "Very Good",
    3: "Good",
    2: "Fair",
    1: "Poor",
  },

//   // Questions array - you can add your questions here
//   questions: [
//     "The location mapping feature works accurately.",
//     "Service providers can easily view and respond to client requests.",
//     "The system allows service providers to successfully post services.",
//     "The user interface is intuitive and easy to navigate.",
//     "Registering and logging into the platform is simple.",
//     "Information is well-organized and easy to find.",
//     "User data is stored securely within the platform.",
//     "The system prevents unauthorized access to user profiles.",
//     "The login and authentication processes are secure.",
//     "The platform is designed to support future feature enhancements.",
//     "The system structure allows for expansion to different geographic areas.",
//     "The platform can handle increased user data without slowing down.",
//     // Add more questions as needed
//   ],

  // Responses array - each number corresponds to the legend above
  benchmark: [
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
  ],

//   pilot: [
//     [4,4,4,4,4,4,4,4,4,4,4,4],
//     [4,4,3,3,4,4,4,4,3,3,4,4],
//     [5,4,3,4,4,3,4,4,4,5,5,4],
//     [5,4,5,4,4,4,5,5,5,4,5,3],
//     [5,4,5,5,5,4,5,5,5,5,5,5],
//     [4,5,5,5,5,5,5,5,5,5,5,5],
//     [4,5,5,5,5,5,5,5,5,4,4,5],
//     [3,4,4,4,3,4,3,2,2,3,3,4],
//     [4,5,5,5,5,5,5,5,5,5,5,5],
//     [5,5,5,5,5,5,4,5,5,5,4,5],
//     [5,5,5,5,5,5,5,5,5,5,5,5],
//     [5,4,5,5,5,4,4,5,5,5,5,4],
//     [4,4,5,5,5,5,4,4,4,5,5,4],
//     [5,4,4,5,5,4,5,5,4,4,5,5],
//     [5,5,5,4,4,5,4,4,4,5,5,4],
//     [5,5,5,5,4,4,4,5,5,5,4,4],
//     [5,4,4,4,4,4,5,4,3,3,3,4],
//     [5,4,5,4,4,4,5,5,4,5,5,5],
//     [5,5,5,5,5,5,5,5,5,5,5,5],
//     [4,4,4,5,4,4,5,5,5,5,5,5],
//     [5,4,5,4,4,5,4,4,3,4,5,4],
//     [5,5,5,5,5,5,4,4,4,5,4,5],
//     [5,5,5,4,5,5,5,5,5,5,5,4],
//     [4,4,4,5,4,4,4,5,5,5,5,5],
//     [5,4,4,4,5,5,5,5,5,4,5,5],
//     [5,5,4,5,4,5,5,5,4,4,5,5],
//     [5,5,5,5,5,5,5,5,5,5,5,5],
//     [5,5,5,5,5,5,5,5,5,5,5,5],
//     [5,5,5,5,4,4,4,4,5,5,5,5],
//     [5,5,5,4,4,5,5,5,4,5,5,5],
//   ],
questions: [
    "The system accurately detects and interprets hand gestures as intended.",
    "The system provides all the necessary features for controlling a presentation effectively.",
    "The system’s gesture recognition is consistent and reliable across different users.",
    "The system functions consistently without frequent errors or crashes. ",
    "The system maintains accuracy in gesture recognition over multiple uses. ",
    "The system is stable when used for an extended period. ",
    "The system responds quickly to hand gestures without noticeable delay. ",
    "The system performs well even under different lighting conditions. ",
    "The system operates smoothly without causing high CPU or memory usage.",
    "The system is easy to learn and use without requiring extensive training.",
    "The gesture-based controls are intuitive and user-friendly.",
    "Users can efficiently navigate through presentations using hand gestures.",
    // Add more questions as needed
  ],

  pilot: [
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,5,5,4,5,4,5,5,5],
    [4,4,5,5,5,5,4,4,4,5,5,5],
    [4,5,4,4,4,5,4,4,4,5,5,4],
    [5,5,5,4,5,4,4,4,5,5,5,5],
    [4,5,4,4,5,4,4,4,5,5,5,5],
    [5,5,5,5,5,5,4,4,5,5,5,5],
    [5,5,5,4,5,5,5,5,5,5,5,5],
    [5,4,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,3,4,3,3,4,3,5,3,4],
    [5,5,5,5,5,5,4,5,4,5,5,5],
    [4,5,5,4,5,5,4,4,4,5,5,5],
    [5,5,5,5,5,5,4,4,4,5,5,5],
    [4,4,3,3,4,3,3,3,4,3,4,3],
    [3,4,3,3,4,4,3,4,2,5,4,4],
    [5,5,5,5,4,5,5,5,5,5,4,4],
    [4,4,5,4,5,4,4,4,3,3,4,4],
    [3,3,3,3,3,3,4,3,3,3,4,3],
    [5,5,5,5,5,5,5,4,5,5,4,5],
  ],


  final: [
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,4,4,5,5,4,5,4,4,5,4,4],
    [5,4,5,4,4,4,5,5,4,5,5,4],
    [5,4,4,5,5,5,4,4,5,5,5,4],
    [5,5,5,4,4,5,5,4,5,4,5,5],
    [5,4,5,5,5,5,5,5,5,4,4,4],
    [5,4,5,5,5,5,4,4,5,5,4,5],
    [5,4,5,5,5,5,4,4,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,4,5,5,5,5,4,5,5,5,5,5],
    [5,4,4,5,5,5,4,5,5,4,5,4],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,4,5,5,5,4,4,5,5,5,5],
    [5,5,5,5,5,4,5,5,5,4,4,5],
    [5,5,5,5,5,5,4,4,5,5,5,5],
    [5,5,5,4,5,5,4,4,5,5,4,4],
    [5,5,5,5,5,4,4,4,5,5,5,5],
    [4,4,5,5,5,4,5,4,4,4,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,4,4,4,5,4,4,5,5,5], 
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,5,5,4,4,5,4,4,5,4,4],
    [5,4,4,5,5,5,4,4,4,4,5,5],
    [5,5,5,4,4,4,4,4,5,5,5,4],
    [5,5,5,4,4,4,5,5,5,5,5,5],
    [5,5,5,4,5,4,5,5,4,5,4,4],
    [4,4,5,4,5,5,4,5,5,5,5,5],
    [5,5,5,5,5,5,5,5,5,5,5,5],
    [5,5,4,5,5,4,4,4,5,5,5,5],
    [5,5,5,5,4,4,5,4,4,5,5,5],
  ]

};

// Function to validate a response (ensures it's between 1-5)
function validateResponse(rating) {
  return rating >= 1 && rating <= 5;
}

// Function to add a new response set to a specific dataset
function addResponseSet(responses, datasetName = 'pilot') {
  if (!Array.isArray(responses)) {
    throw new Error("Responses must be an array");
  }

  if (!responses.every(validateResponse)) {
    throw new Error("All ratings must be between 1 and 5");
  }

  if (!surveyData[datasetName]) {
    throw new Error(`Dataset '${datasetName}' does not exist`);
  }

  surveyData[datasetName].push(responses);
}

// Example of adding a new response set
// addResponseSet([5, 4, 4, 3, 5, 4, 3, 4, 5, 4, 3, 5]);

// Function to calculate mean for each question
function calculateMeans(dataset) {
  const means = [];
  const numQuestions = surveyData.questions.length;
  
  for (let i = 0; i < numQuestions; i++) {
    let sum = 0;
    let count = 0;
    
    dataset.forEach(responseSet => {
      if (responseSet[i]) {
        sum += responseSet[i];
        count++;
      }
    });
    
    means.push({
      question: surveyData.questions[i],
      mean: count > 0 ? (sum / count).toFixed(2) : 0
    });
  }
  
  return means;
}

// Function to calculate frequency of each rating (1-5) for each question
function calculateFrequencies(dataset) {
  const frequencies = [];
  const numQuestions = surveyData.questions.length;
  
  for (let i = 0; i < numQuestions; i++) {
    const frequency = {
      question: surveyData.questions[i],
      ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
    
    dataset.forEach(responseSet => {
      if (responseSet[i]) {
        frequency.ratings[responseSet[i]]++;
      }
    });
    
    frequencies.push(frequency);
  }
  
  return frequencies;
}

// Function to calculate percentages for each rating (1-5) for each question based on total respondents
function calculatePercentages(dataset) {
  const percentages = [];
  const frequencies = calculateFrequencies(dataset);
  const totalRespondents = dataset.length;
  
  frequencies.forEach(freq => {
    const percentageData = {
      question: freq.question,
      percentages: {},
      totalRespondents: totalRespondents,
      rawCounts: freq.ratings
    };
    
    // Calculate percentage for each rating based on total respondents
    for (let rating = 1; rating <= 5; rating++) {
      percentageData.percentages[rating] = totalRespondents > 0 
        ? ((freq.ratings[rating] / totalRespondents) * 100).toFixed(1) + '%'
        : '0%';
    }
    
    percentages.push(percentageData);
  });
  
  return percentages;
}

// Function to calculate overall frequency across all questions
function calculateOverallFrequency(dataset) {
  const overallFrequency = {
    totalResponses: 0,
    totalRespondents: dataset.length,
    totalQuestions: surveyData.questions.length,
    ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    percentages: {}
  };

  // Count all ratings across all questions and respondents
  dataset.forEach(responseSet => {
    responseSet.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        overallFrequency.ratings[rating]++;
        overallFrequency.totalResponses++;
      }
    });
  });

  // Calculate percentages for each rating
  for (let rating = 1; rating <= 5; rating++) {
    overallFrequency.percentages[rating] = overallFrequency.totalResponses > 0
      ? ((overallFrequency.ratings[rating] / overallFrequency.totalResponses) * 100).toFixed(1) + '%'
      : '0%';
  }

  return overallFrequency;
}

// Example usage:
const means = calculateMeans(surveyData.pilot);
// const frequencies = calculateFrequencies(surveyData.pilot);
// const percentages = calculatePercentages(surveyData.pilot);
const overallFreq = calculateOverallFrequency(surveyData.pilot);
console.log('Means:', means);
// console.log('Frequencies:', frequencies);
// console.log('Percentages:', percentages);
console.log('Overall Frequency:', overallFreq);


module.exports = {
  surveyData,
  calculateMeans,
  calculateFrequencies,
  calculatePercentages,
  calculateOverallFrequency,
  addResponseSet,
  validateResponse
};