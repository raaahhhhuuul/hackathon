import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Brain,
  Calendar,
  Filter,
  Download,
  Eye,
  Search,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [businessData, setBusinessData] = useState<any>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [customInsights, setCustomInsights] = useState<string>('');
  const [queryLoading, setQueryLoading] = useState(false);

  // Mock analytics data
  const revenueData = [
    { month: 'Jan', revenue: 45000, sales: 120, customers: 89 },
    { month: 'Feb', revenue: 52000, sales: 135, customers: 102 },
    { month: 'Mar', revenue: 48000, sales: 110, customers: 95 },
    { month: 'Apr', revenue: 61000, sales: 145, customers: 118 },
    { month: 'May', revenue: 55000, sales: 130, customers: 105 },
    { month: 'Jun', revenue: 67000, sales: 155, customers: 125 },
  ];

  const categoryPerformance = [
    { category: 'Electronics', sales: 45, revenue: 28000, growth: 12 },
    { category: 'Clothing', sales: 38, revenue: 19000, growth: 8 },
    { category: 'Home & Garden', sales: 32, revenue: 16000, growth: 15 },
    { category: 'Sports', sales: 28, revenue: 14000, growth: 5 },
    { category: 'Books', sales: 25, revenue: 12000, growth: 3 },
  ];

  const customerSegments = [
    { segment: 'New Customers', value: 35, color: '#3B82F6' },
    { segment: 'Returning', value: 45, color: '#10B981' },
    { segment: 'VIP', value: 20, color: '#F59E0B' },
  ];

  const performanceMetrics = [
    { metric: 'Customer Acquisition Cost', value: '₹45', change: -12, trend: 'down' },
    { metric: 'Customer Lifetime Value', value: '₹1,250', change: 8, trend: 'up' },
    { metric: 'Conversion Rate', value: '3.2%', change: 15, trend: 'up' },
    { metric: 'Average Order Value', value: '₹89', change: 5, trend: 'up' },
  ];

  // Fetch AI insights from the server
  useEffect(() => {
    fetchAIInsights();
    fetchTrendAnalysis();
  }, []);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/ai-insights', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBusinessData(data.businessData);
        
        // Parse AI insights and format them for display
        const formattedInsights = parseAIInsights(data.aiInsights);
        setAiInsights(formattedInsights);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      // Fallback to mock insights
      setAiInsights([
        {
          type: 'opportunity',
          title: 'Revenue Optimization Opportunity',
          description: 'Increasing prices by 5% on electronics could boost revenue by $8,400/month without significant customer loss.',
          impact: 'High',
          confidence: 87
        },
        {
          type: 'trend',
          title: 'Seasonal Trend Detected',
          description: 'Home & Garden category shows 25% higher sales in spring months. Consider seasonal marketing campaigns.',
          impact: 'Medium',
          confidence: 92
        },
        {
          type: 'alert',
          title: 'Customer Churn Risk',
          description: '15% of customers haven\'t made a purchase in 60 days. Implement re-engagement campaigns.',
          impact: 'High',
          confidence: 78
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendAnalysis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/trends', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.trendAnalysis) {
          setTrendAnalysis(data.trendAnalysis);
        }
      }
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
    }
  };

  const parseAIInsights = (aiText: string) => {
    // Simple parsing of AI text to extract insights
    const insights = [];
    const lines = aiText.split('\n').filter(line => line.trim());
    
    let currentInsight: any = {};
    
    lines.forEach(line => {
      if (line.includes('insight') || line.includes('trend') || line.includes('opportunity') || line.includes('risk')) {
        if (currentInsight.title) {
          insights.push(currentInsight);
        }
        currentInsight = {
          type: line.includes('risk') ? 'alert' : line.includes('opportunity') ? 'opportunity' : 'trend',
          title: line.trim(),
          description: '',
          impact: 'Medium',
          confidence: 85
        };
      } else if (currentInsight.title && line.trim()) {
        currentInsight.description = line.trim();
      }
    });
    
    if (currentInsight.title) {
      insights.push(currentInsight);
    }
    
    return insights.length > 0 ? insights : [
      {
        type: 'insight',
        title: 'AI Analysis Complete',
        description: aiText.substring(0, 200) + '...',
        impact: 'Medium',
        confidence: 90
      }
    ];
  };

  const handleCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    try {
      setQueryLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: customQuery })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomInsights(data.insights);
      }
    } catch (error) {
      console.error('Error processing custom query:', error);
      setCustomInsights('Sorry, I encountered an error while processing your query. Please try again.');
    } finally {
      setQueryLoading(false);
    }
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'revenue':
        return revenueData.map(item => ({ name: item.month, value: item.revenue }));
      case 'sales':
        return revenueData.map(item => ({ name: item.month, value: item.sales }));
      case 'customers':
        return revenueData.map(item => ({ name: item.month, value: item.customers }));
      default:
        return revenueData.map(item => ({ name: item.month, value: item.revenue }));
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue': return 'Revenue ($)';
      case 'sales': return 'Sales Count';
      case 'customers': return 'Customers';
      default: return 'Revenue ($)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">AI-powered business intelligence and performance analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border-none focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="input-field text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="sales">Sales</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getMetricData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Insights and Customer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-primary-600" />}
            </div>
            
            {/* Custom Query Interface */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Ask AI About Your Business</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g., How can I optimize my inventory? What are my top performing products?"
                  className="flex-1 input-field text-sm"
                />
                <button
                  onClick={handleCustomQuery}
                  disabled={queryLoading || !customQuery.trim()}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                >
                  {queryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
              {customInsights && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <h5 className="font-medium text-gray-900 mb-2">AI Response:</h5>
                  <p className="text-sm text-gray-700">{customInsights}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 border-l-4 border-primary-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                          insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {insight.impact} Impact
                        </span>
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Customer Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {customerSegments.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <span className="text-sm text-gray-600">{segment.segment}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{segment.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Advanced Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Performance Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={[
            { metric: 'Revenue Growth', value: 85 },
            { metric: 'Customer Satisfaction', value: 78 },
            { metric: 'Operational Efficiency', value: 92 },
            { metric: 'Market Share', value: 65 },
            { metric: 'Innovation Index', value: 88 },
            { metric: 'Financial Health', value: 76 },
          ]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Performance" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Trend Analysis */}
      {trendAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Trend Analysis</h3>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line">{trendAnalysis}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics; 