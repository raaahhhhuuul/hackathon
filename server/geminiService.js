const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Fine-tuned system prompts for different use cases
const SYSTEM_PROMPTS = {
  analytics: `You are a professional data analyst for companies with expertise in business intelligence, financial analysis, and market trends. You provide precise, actionable insights based on data analysis. Always:
  - Use specific numbers and percentages when available
  - Provide actionable recommendations
  - Explain the business impact of trends
  - Suggest optimization strategies
  - Be concise but comprehensive
  - Focus on revenue, growth, and efficiency metrics`,
  
  chatbot: `You are an AI business assistant specializing in inventory management, sales analysis, and customer insights. You help business owners make data-driven decisions. Always:
  - Provide specific, actionable advice
  - Reference actual data when available
  - Suggest optimization strategies
  - Explain the business value of recommendations
  - Be helpful and professional
  - Ask clarifying questions when needed`,
  
  insights: `You are a business intelligence expert who analyzes company data to uncover hidden opportunities and risks. You provide:
  - Trend analysis and predictions
  - Risk assessment and mitigation strategies
  - Revenue optimization recommendations
  - Customer behavior insights
  - Operational efficiency suggestions
  - Market opportunity identification`
};

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateAnalyticsInsights(data, query) {
    try {
      const prompt = `${SYSTEM_PROMPTS.analytics}

Available business data:
${JSON.stringify(data, null, 2)}

User query: ${query}

Please provide a comprehensive analysis with specific insights and actionable recommendations.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating analytics insights:', error);
      return 'I apologize, but I encountered an error while analyzing your data. Please try again.';
    }
  }

  async generateBusinessInsights(data) {
    try {
      const prompt = `${SYSTEM_PROMPTS.insights}

Business data to analyze:
${JSON.stringify(data, null, 2)}

Please provide:
1. Key performance insights
2. Emerging trends and opportunities
3. Risk factors to monitor
4. Specific optimization recommendations
5. Revenue growth opportunities

Format your response in a clear, structured manner.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating business insights:', error);
      return 'I apologize, but I encountered an error while analyzing your business data. Please try again.';
    }
  }

  async generateChatbotResponse(userMessage, contextData) {
    try {
      let prompt = `${SYSTEM_PROMPTS.chatbot}

User message: ${userMessage}`;

      if (contextData) {
        prompt += `\n\nRelevant business context:
${JSON.stringify(contextData, null, 2)}`;
      }

      prompt += `\n\nPlease provide a helpful, specific response that addresses the user's question or concern.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }

  async generateTrendAnalysis(historicalData) {
    try {
      const prompt = `${SYSTEM_PROMPTS.analytics}

Historical business data:
${JSON.stringify(historicalData, null, 2)}

Please analyze this data and provide:
1. Trend identification and analysis
2. Seasonal patterns if any
3. Growth projections
4. Anomaly detection
5. Strategic recommendations based on trends

Be specific with numbers and percentages.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating trend analysis:', error);
      return 'I apologize, but I encountered an error while analyzing trends. Please try again.';
    }
  }
}

module.exports = new GeminiService(); 