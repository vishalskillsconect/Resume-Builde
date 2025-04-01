import React, { useState, useEffect } from 'react';
import '../styles/Form.scss';

const ATSScore = ({ resumeData }) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // API key for Gemini from environment variable
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    calculateATSScore();
  }, [resumeData]);

  const analyzeWithAI = async (content) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this resume content and provide a score (0-100) and feedback based on ATS optimization. Consider:
                1. Keyword optimization
                2. Content structure
                3. Professional tone
                4. Clarity and conciseness
                5. Action verbs usage
                6. Quantifiable achievements
                7. Format consistency
                
                Content: ${content}
                
                Provide response in JSON format with fields: score, feedback (array of strings)`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze with AI');
      }

      const result = await response.json();
      const analysis = JSON.parse(result.candidates[0].content.parts[0].text);
      return analysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return null;
    }
  };

  const calculateATSScore = async () => {
    setIsAnalyzing(true);
    let totalScore = 0;
    const feedbackList = [];

    // Basic checks (30% of total score)
    // Check for contact information
    if (resumeData?.contact?.email && resumeData?.contact?.phone) {
      totalScore += 5;
      feedbackList.push({ type: 'success', message: 'Contact information is complete' });
    } else {
      feedbackList.push({ type: 'error', message: 'Missing contact information' });
    }

    // Check for professional summary
    if (resumeData?.objective && resumeData.objective.length > 50) {
      totalScore += 5;
      feedbackList.push({ type: 'success', message: 'Professional summary is present' });
    } else {
      feedbackList.push({ type: 'error', message: 'Professional summary needs improvement' });
    }

    // Check for work experience
    if (resumeData?.experience && resumeData.experience.length > 0) {
      totalScore += 10;
      feedbackList.push({ type: 'success', message: 'Work experience is included' });
    } else {
      feedbackList.push({ type: 'error', message: 'No work experience listed' });
    }

    // Check for education
    if (resumeData?.education && resumeData.education.length > 0) {
      totalScore += 5;
      feedbackList.push({ type: 'success', message: 'Education details are included' });
    } else {
      feedbackList.push({ type: 'error', message: 'Education details are missing' });
    }

    // Check for skills
    if (resumeData?.skills && resumeData.skills.length > 0) {
      totalScore += 5;
      feedbackList.push({ type: 'success', message: 'Skills are listed' });
    } else {
      feedbackList.push({ type: 'error', message: 'No skills listed' });
    }

    // AI Analysis (70% of total score)
    try {
      // Prepare content for AI analysis
      const content = {
        objective: resumeData?.objective || '',
        experience: resumeData?.experience?.map(exp => exp.description).join('\n') || '',
        skills: resumeData?.skills?.join(', ') || '',
        education: resumeData?.education?.map(edu => edu.description).join('\n') || ''
      };

      const aiAnalysis = await analyzeWithAI(JSON.stringify(content));
      
      if (aiAnalysis) {
        // Scale AI score to 70% of total
        const aiScore = Math.round(aiAnalysis.score * 0.7);
        totalScore += aiScore;
        
        // Add AI feedback
        aiAnalysis.feedback.forEach(feedback => {
          feedbackList.push({ 
            type: feedback.toLowerCase().includes('improve') ? 'error' : 'success',
            message: feedback
          });
        });
      }
    } catch (error) {
      console.error('Error in AI analysis:', error);
      feedbackList.push({ 
        type: 'error', 
        message: 'Unable to perform AI analysis. Please try again later.' 
      });
    }

    // Cap the total score at 85% to maintain realism
    totalScore = Math.min(totalScore, 85);
    
    setScore(totalScore);
    setFeedback(feedbackList);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4CAF50';
    if (score >= 50) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="section">
      <div className="heading">
        <span>ATS SCORE ANALYSIS</span>
      </div>
      
      <div className="ats-score-container">
        <div className="ats-score-bar">
          <div 
            className="ats-score-progress" 
            style={{ 
              width: `${score}%`,
              backgroundColor: getScoreColor(score)
            }}
          ></div>
        </div>
        <div className="ats-score-value">{score}%</div>
      </div>

      {isAnalyzing && (
        <div className="ats-analyzing">
          Analyzing your resume with AI...
        </div>
      )}

      <div className="ats-feedback">
        <h4>Feedback:</h4>
        <ul>
          {feedback.map((item, index) => (
            <li key={index} className={item.type}>
              <span className="feedback-icon">
                {item.type === 'success' ? '✓' : '✗'}
              </span>
              {item.message}
            </li>
          ))}
        </ul>
      </div>

      <div className="ats-note">
        Note: This is an AI-powered ATS score based on comprehensive analysis of your resume content. 
        The maximum possible score is 85% to maintain realistic expectations. Different ATS systems may have different scoring criteria.
      </div>
    </div>
  );
};

export default ATSScore; 