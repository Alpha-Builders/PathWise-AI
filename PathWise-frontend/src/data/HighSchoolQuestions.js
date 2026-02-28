const scienceQuestions = [
  {
    id: 1,
    question: "Do you enjoy working with technology and computers?",
    careerTags: { "Software Developer": 2, "Data Scientist": 2, "IT Specialist": 2, "Biomedical Engineer": 1 }
  },
  {
    id: 2,
    question: "Are you interested in helping people with their health?",
    careerTags: { "Doctor": 3, "Nurse": 3, "Pharmacist": 2, "Physiotherapist": 2 }
  },
  {
    id: 3,
    question: "Do you like conducting experiments and research?",
    careerTags: { "Research Scientist": 3, "Laboratory Technician": 2, "Data Scientist": 2, "Pharmacist": 1 }
  },
  {
    id: 4,
    question: "Are you good at solving complex mathematical problems?",
    careerTags: { "Data Scientist": 2, "Engineer": 2, "Actuary": 3, "Software Developer": 2 }
  },
  {
    id: 5,
    question: "Do you enjoy understanding how things work mechanically?",
    careerTags: { "Mechanical Engineer": 3, "Biomedical Engineer": 2, "Architect": 1 }
  },
  {
    id: 6,
    question: "Are you interested in environmental conservation?",
    careerTags: { "Environmental Scientist": 3, "Marine Biologist": 2, "Agricultural Scientist": 2 }
  },
  {
    id: 7,
    question: "Do you like working in a laboratory setting?",
    careerTags: { "Laboratory Technician": 3, "Research Scientist": 2, "Pharmacist": 2 }
  },
  {
    id: 8,
    question: "Are you patient with explaining complex concepts to others?",
    careerTags: { "Teacher": 2, "Doctor": 1, "Science Communicator": 3 }
  },
  {
    id: 9,
    question: "Do you enjoy working with data and statistics?",
    careerTags: { "Data Scientist": 3, "Actuary": 3, "Research Scientist": 2 }
  },
  {
    id: 10,
    question: "Are you interested in building or designing structures?",
    careerTags: { "Civil Engineer": 3, "Architect": 2, "Structural Engineer": 3 }
  },
  {
    id: 11,
    question: "Do you prefer working independently rather than in teams?",
    careerTags: { "Software Developer": 1, "Research Scientist": 2, "Data Scientist": 1 }
  },
  {
    id: 12,
    question: "Are you comfortable working long hours when needed?",
    careerTags: { "Doctor": 2, "Engineer": 2, "Software Developer": 2 }
  },
  {
    id: 13,
    question: "Do you enjoy learning about the human body?",
    careerTags: { "Doctor": 3, "Nurse": 3, "Physiotherapist": 3, "Biomedical Engineer": 2 }
  },
  {
    id: 14,
    question: "Are you interested in space and astronomy?",
    careerTags: { "Astronomer": 3, "Aerospace Engineer": 3, "Physicist": 2 }
  },
  {
    id: 15,
    question: "Do you like creating solutions to real-world problems?",
    careerTags: { "Engineer": 2, "Software Developer": 2, "Biomedical Engineer": 2, "Environmental Scientist": 2 }
  }
];

const artQuestions = [
  {
    id: 1,
    question: "Do you enjoy working with technology and digital tools?",
    careerTags: { "Graphic Designer": 2, "UI/UX Designer": 3, "Digital Animator": 2, "Web Designer": 2 }
  },
  {
    id: 2,
    question: "Are you interested in helping people express themselves?",
    careerTags: { "Art Therapist": 3, "Counselor": 2, "Teacher": 2 }
  },
  {
    id: 3,
    question: "Do you like drawing or creating visual art?",
    careerTags: { "Graphic Designer": 3, "Illustrator": 3, "Fine Artist": 3, "Animator": 2 }
  },
  {
    id: 4,
    question: "Are you good at communicating ideas through storytelling?",
    careerTags: { "Writer": 3, "Content Creator": 2, "Film Director": 2, "Journalist": 2 }
  },
  {
    id: 5,
    question: "Do you enjoy performing or being in front of people?",
    careerTags: { "Actor": 3, "Musician": 2, "Public Speaker": 2, "Content Creator": 2 }
  },
  {
    id: 6,
    question: "Are you interested in fashion and style?",
    careerTags: { "Fashion Designer": 3, "Stylist": 3, "Fashion Photographer": 2 }
  },
  {
    id: 7,
    question: "Do you like working on creative projects from start to finish?",
    careerTags: { "Creative Director": 2, "Film Director": 2, "Graphic Designer": 2 }
  },
  {
    id: 8,
    question: "Are you patient with revising and perfecting your work?",
    careerTags: { "Graphic Designer": 2, "Writer": 2, "Fine Artist": 2, "Architect": 2 }
  },
  {
    id: 9,
    question: "Do you enjoy photography or videography?",
    careerTags: { "Photographer": 3, "Videographer": 3, "Film Director": 2, "Content Creator": 2 }
  },
  {
    id: 10,
    question: "Are you interested in interior design and spaces?",
    careerTags: { "Interior Designer": 3, "Architect": 2, "Set Designer": 2 }
  },
  {
    id: 11,
    question: "Do you prefer working independently on creative projects?",
    careerTags: { "Fine Artist": 2, "Writer": 2, "Photographer": 2 }
  },
  {
    id: 12,
    question: "Are you comfortable with irregular working hours?",
    careerTags: { "Actor": 2, "Musician": 2, "Film Director": 2, "Content Creator": 2 }
  },
  {
    id: 13,
    question: "Do you enjoy music and sound design?",
    careerTags: { "Musician": 3, "Music Producer": 3, "Sound Engineer": 2 }
  },
  {
    id: 14,
    question: "Are you interested in advertising and marketing?",
    careerTags: { "Creative Director": 3, "Copywriter": 3, "Graphic Designer": 2 }
  },
  {
    id: 15,
    question: "Do you like teaching or sharing your creative skills with others?",
    careerTags: { "Art Teacher": 3, "Workshop Facilitator": 2, "Content Creator": 2 }
  }
];

const commercialQuestions = [
  {
    id: 1,
    question: "Do you enjoy working with numbers and financial data?",
    careerTags: { "Accountant": 3, "Financial Analyst": 3, "Banker": 2, "Auditor": 2 }
  },
  {
    id: 2,
    question: "Are you interested in helping businesses grow?",
    careerTags: { "Business Consultant": 3, "Marketing Manager": 2, "Entrepreneur": 3 }
  },
  {
    id: 3,
    question: "Do you like persuading and negotiating with people?",
    careerTags: { "Sales Manager": 3, "Real Estate Agent": 3, "Marketing Manager": 2 }
  },
  {
    id: 4,
    question: "Are you good at analyzing market trends and data?",
    careerTags: { "Market Research Analyst": 3, "Financial Analyst": 2, "Business Analyst": 2 }
  },
  {
    id: 5,
    question: "Do you enjoy leading teams and managing people?",
    careerTags: { "Human Resource Manager": 3, "Operations Manager": 3, "Business Consultant": 2 }
  },
  {
    id: 6,
    question: "Are you interested in investment and stock markets?",
    careerTags: { "Investment Banker": 3, "Financial Analyst": 3, "Stock Broker": 3 }
  },
  {
    id: 7,
    question: "Do you like organizing and planning events or projects?",
    careerTags: { "Event Manager": 3, "Operations Manager": 2, "Project Manager": 2 }
  },
  {
    id: 8,
    question: "Are you comfortable working under pressure and meeting deadlines?",
    careerTags: { "Accountant": 2, "Sales Manager": 2, "Investment Banker": 2 }
  },
  {
    id: 9,
    question: "Do you enjoy digital marketing and social media?",
    careerTags: { "Digital Marketing Specialist": 3, "Social Media Manager": 3, "Brand Manager": 2 }
  },
  {
    id: 10,
    question: "Are you interested in international trade and business?",
    careerTags: { "Import/Export Manager": 3, "International Business Consultant": 3, "Logistics Manager": 2 }
  },
  {
    id: 11,
    question: "Do you prefer working in an office environment?",
    careerTags: { "Accountant": 2, "HR Manager": 2, "Business Analyst": 2 }
  },
  {
    id: 12,
    question: "Are you comfortable with public speaking and presentations?",
    careerTags: { "Sales Manager": 2, "Marketing Manager": 2, "Business Consultant": 2 }
  },
  {
    id: 13,
    question: "Do you enjoy customer service and client relations?",
    careerTags: { "Customer Success Manager": 3, "Account Manager": 3, "Sales Manager": 2 }
  },
  {
    id: 14,
    question: "Are you interested in starting your own business?",
    careerTags: { "Entrepreneur": 3, "Business Consultant": 2, "Franchise Owner": 2 }
  },
  {
    id: 15,
    question: "Do you like solving business problems strategically?",
    careerTags: { "Business Consultant": 3, "Operations Manager": 2, "Business Analyst": 3 }
  }
];
export { scienceQuestions, artQuestions, commercialQuestions };