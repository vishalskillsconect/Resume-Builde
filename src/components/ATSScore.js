import React, { useState, useEffect } from 'react';
import '../styles/Form.scss';

const ATSScore = ({ resumeData }) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    if (resumeData) calculateATSScore();
  }, [resumeData]);

  const analyzeWithAI = async (content) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this resume and provide:
                - ATS score (0-100)
                - Feedback (array of strings for strengths)
                - Areas for improvement (array of strings for weaknesses)
                
                Content: ${content}
                
                Respond in JSON with fields: score, feedback, improvements.`
              }]
            }]
          })
        }
      );

      if (!response.ok) throw new Error('AI analysis failed');

      const result = await response.json();
      return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return null;
    }
  };

  const calculateATSScore = async () => {
    setIsAnalyzing(true);
    let totalScore = 0;
    const feedbackList = [];
    const improvementList = [];

    // Basic checks (30% of total score)
    if (resumeData?.contact?.email && resumeData?.contact?.phone) {
      totalScore += 10;
      feedbackList.push('Complete contact information.');
    } else {
      improvementList.push('Add missing contact details.');
    }

    if (resumeData?.objective && resumeData.objective.length > 50) {
      totalScore += 10;
      feedbackList.push('Professional summary is well-structured.');
    } else {
      improvementList.push('Improve your professional summary.');
    }

    if (resumeData?.experience?.length > 0) {
      totalScore += 15;
      feedbackList.push('Work experience section is included.');
    } else {
      improvementList.push('Add work experience section.');
    }

    if (resumeData?.education?.length > 0) {
      totalScore += 10;
      feedbackList.push('Education details are present.');
    } else {
      improvementList.push('Include education details.');
    }

    if (resumeData?.skills?.length > 0) {
      totalScore += 10;
      feedbackList.push('Skills section is included.');
    } else {
      improvementList.push('Add relevant skills.');
    }

    // AI Analysis (70% of total score)
    try {
      const content = JSON.stringify({
        objective: resumeData?.objective || '',
        experience: resumeData?.experience?.map(exp => exp.description).join('\n') || '',
        skills: resumeData?.skills?.join(', ') || '',
        education: resumeData?.education?.map(edu => edu.description).join('\n') || ''
      });

      const aiAnalysis = await analyzeWithAI(content);
      if (aiAnalysis) {
        const aiScore = Math.round(aiAnalysis.score * 0.7);
        totalScore += aiScore;
        feedbackList.push(...aiAnalysis.feedback);
        improvementList.push(...aiAnalysis.improvements);
      }
    } catch (error) {
      improvementList.push('AI analysis could not be performed.');
    }

    setScore(Math.min(totalScore, 100));
    setFeedback(feedbackList);
    setImprovements(improvementList);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 50) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="section">
      <div className="heading"><span>ATS SCORE ANALYSIS</span></div>
      
      <div className="ats-score-container">
        <div className="ats-score-bar">
          <div className="ats-score-progress" style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}></div>
        </div>
        <div className="ats-score-value">{score}%</div>
      </div>

      {isAnalyzing && <div className="ats-analyzing">Analyzing your resume with AI...</div>}

      <div className="ats-feedback">
        <h4>Feedback (Strengths):</h4>
        <ul>{feedback.map((item, index) => <li key={index} className="success">✓ {item}</li>)}</ul>
      </div>

      <div className="ats-improvements">
        <h4>Areas for Improvement:</h4>
        <ul>{improvements.map((item, index) => <li key={index} className="error">✗ {item}</li>)}</ul>
      </div>

      <div className="ats-note">
        <strong>Note:</strong> This AI-powered ATS score helps improve resume optimization. A score of 100% does not guarantee passing all ATS systems, as different ATS have unique criteria.
      </div>
    </div>
  );
};

export default ATSScore;