# Gemini AI Integration Setup

This project now includes AI-powered analytics and chatbot functionality using Google's Gemini AI API.

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Gemini AI API Key
REACT_APP_GEMINI_API_KEY=AIzaSyBslxUfA2oHwI6j5PNQpqLYG_ZVeAgvq3o

# Server-side Gemini API Key (for backend)
GEMINI_API_KEY=AIzaSyBslxUfA2oHwI6j5PNQpqLYG_ZVeAgvq3o

# JWT Secret (can be any secure string)
JWT_SECRET=j6R1wsH04SmOniCVA3TnnA/sc86F7uV55TMbejMMsQI=
```

### 3. Features Added

#### AI-Powered Analytics
- **Real-time Business Insights**: AI analyzes your inventory, customers, and sales data
- **Trend Analysis**: AI identifies patterns and provides growth projections
- **Custom Queries**: Ask specific questions about your business data
- **Actionable Recommendations**: Get specific optimization strategies

#### Enhanced Chatbot
- **Data-Aware Responses**: Chatbot accesses your business database
- **Contextual Analysis**: Provides insights based on actual business data
- **Professional Business Advice**: Fine-tuned for business intelligence
- **Real-time Processing**: Uses Gemini API for intelligent responses

### 4. API Endpoints

The following new endpoints are available:

- `GET /api/analytics/ai-insights` - Get comprehensive AI business insights
- `GET /api/analytics/trends` - Get AI-powered trend analysis
- `POST /api/chatbot` - Send messages to AI chatbot
- `POST /api/analytics/query` - Ask custom analytics questions

### 5. Fine-tuned Prompts

The AI is configured with specialized prompts for:

- **Analytics**: Professional data analysis with actionable insights
- **Chatbot**: Business-focused assistance with inventory and sales expertise
- **Insights**: Business intelligence with trend analysis and risk assessment

### 6. Security

- All endpoints require JWT authentication
- API keys are stored securely in environment variables
- Database queries are properly sanitized and user-scoped

### 7. Usage Examples

#### Analytics Page
- View AI-generated business insights
- Ask custom questions about your data
- Get trend analysis and recommendations

#### Chatbot
- Ask about inventory optimization
- Get customer insights
- Request sales analysis
- Receive business recommendations

### 8. Troubleshooting

If you encounter issues:

1. **Check API Key**: Ensure your Gemini API key is valid and has sufficient quota
2. **Environment Variables**: Verify `.env` file is in the root directory
3. **Server Restart**: Restart the server after adding environment variables
4. **API Limits**: Check your Gemini API usage limits

### 9. Performance Notes

- AI responses may take 2-5 seconds depending on query complexity
- Database queries are optimized for performance
- Responses are cached where appropriate
- Fallback responses provided if AI service is unavailable

## Support

For issues with the Gemini API integration, check:
- Google AI Studio documentation
- API quota and billing status
- Network connectivity and firewall settings 