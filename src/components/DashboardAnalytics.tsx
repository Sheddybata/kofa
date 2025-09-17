import React, { useState } from 'react';

interface VehicleEntry {
  id: string;
  plateNumber: string;
  vehicleType: string;
  driverName: string;
  purpose: string;
  timestamp: string;
}

interface DashboardAnalyticsProps {
  entries: VehicleEntry[];
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ entries }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Calculate hourly data for different time ranges
  const getHourlyData = (range: '24h' | '7d' | '30d') => {
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '24h':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
    }

    const filteredEntries = entries.filter(entry => 
      new Date(entry.timestamp) >= startDate
    );

    const hourlyData = filteredEntries.reduce((acc, entry) => {
      const hour = new Date(entry.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return hourlyData;
  };

  const hourlyData = getHourlyData(timeRange);

  // Calculate peak hours (top 5)
  const peakHours = Object.entries(hourlyData)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([hour, count]) => ({ hour: parseInt(hour), count: count as number }));

  // Calculate quiet hours (hours with 0 or minimal activity)
  const quietHours = Array.from({length: 24}, (_, i) => i)
    .filter(hour => !hourlyData[hour] || hourlyData[hour] <= 1)
    .slice(0, 5);

  // Calculate average hourly rate
  const totalHours: number = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
  const avgHourlyRate = entries.length > 0 ? ((entries.length as number) / totalHours).toFixed(2) : '0';

  // Predictive analysis
  const predictNextPeakHour = () => {
    if (peakHours.length === 0) return null;
    
    // Simple prediction based on historical patterns
    const mostCommonHour = peakHours[0].hour;
    const nextHour = (mostCommonHour + 1) % 24;
    
    return {
      hour: nextHour,
      confidence: 'High',
      reason: `Based on peak at ${mostCommonHour}:00`
    };
  };

  const predictQuietPeriod = () => {
    if (quietHours.length === 0) return null;
    
    // Find the longest consecutive quiet period
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let startHour = 0;
    
    for (let i = 0; i < 24; i++) {
      if (!hourlyData[i] || hourlyData[i] <= 1) {
        currentConsecutive++;
        if (currentConsecutive > maxConsecutive) {
          maxConsecutive = currentConsecutive;
          startHour = i - currentConsecutive + 1;
        }
      } else {
        currentConsecutive = 0;
      }
    }
    
    return {
      startHour: startHour < 0 ? startHour + 24 : startHour,
      duration: maxConsecutive,
      confidence: 'Medium'
    };
  };

  // Weekly pattern analysis
  const weeklyPattern = entries.reduce((acc, entry) => {
    const day = new Date(entry.timestamp).getDay();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeklyData = dayNames.map((day, index) => ({
    day,
    count: weeklyPattern[index] || 0
  }));

  const nextPrediction = predictNextPeakHour();
  const quietPeriod = predictQuietPeriod();

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Traffic Analytics</h2>
          <div className="flex space-x-2">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-700 mb-2">Average Hourly Rate</h3>
            <p className="text-2xl font-bold text-blue-800">{avgHourlyRate}</p>
            <p className="text-sm text-blue-600">vehicles per hour</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-green-700 mb-2">Peak Hour Activity</h3>
            <p className="text-2xl font-bold text-green-800">{peakHours[0]?.count || 0}</p>
            <p className="text-sm text-green-600">at {peakHours[0]?.hour.toString().padStart(2, '0')}:00</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-purple-700 mb-2">Total Entries</h3>
            <p className="text-2xl font-bold text-purple-800">{entries.length}</p>
            <p className="text-sm text-purple-600">in selected period</p>
          </div>
        </div>
      </div>

      {/* Hourly Traffic Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Hourly Traffic Pattern</h3>
        <div className="h-64 flex items-end justify-between space-x-1">
          {Array.from({length: 24}, (_, i) => {
            const count = hourlyData[i] || 0;
            const maxCount = Math.max(...Object.values(hourlyData).map(v => v as number));
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">{i.toString().padStart(2, '0')}</span>
                {count > 0 && (
                  <span className="text-xs text-blue-600 font-medium">{count}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Peak Hours and Quiet Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Peak Hours</h3>
          <div className="space-y-3">
            {peakHours.map(({ hour, count }, index) => (
              <div key={hour} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}</span>
                  <div>
                    <span className="font-semibold text-gray-800">
                      {hour.toString().padStart(2, '0')}:00 - {(hour + 1).toString().padStart(2, '0')}:00
                    </span>
                    <p className="text-sm text-gray-600">Peak traffic period</p>
                  </div>
                </div>
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {count} vehicles
                </div>
              </div>
            ))}
            {peakHours.length === 0 && (
              <p className="text-gray-500 text-center py-4">No peak hours data available</p>
            )}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quiet Hours</h3>
          <div className="space-y-3">
            {quietHours.map(hour => (
              <div key={hour} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔇</span>
                  <span className="font-semibold text-gray-800">
                    {hour.toString().padStart(2, '0')}:00 - {(hour + 1).toString().padStart(2, '0')}:00
                  </span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Low Activity
                </span>
              </div>
            ))}
            {quietHours.length === 0 && (
              <p className="text-gray-500 text-center py-4">All hours have activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Predictive Analysis */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Predictive Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Next Peak Prediction */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-800 mb-3">Next Peak Hour Prediction</h4>
            {nextPrediction ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🔮</span>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {nextPrediction.hour.toString().padStart(2, '0')}:00
                    </p>
                    <p className="text-sm text-green-600">Predicted peak time</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
                  <span className="font-semibold">Confidence:</span> {nextPrediction.confidence}
                </div>
                <p className="text-sm text-green-700">{nextPrediction.reason}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Insufficient data for prediction</p>
            )}
          </div>

          {/* Quiet Period Prediction */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">Optimal Quiet Period</h4>
            {quietPeriod ? (
              <div className="space-y-3">
                <div className="flex items-center space-x3">
                  <span className="text-3xl">⏰</span>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {quietPeriod.startHour.toString().padStart(2, '0')}:00
                    </p>
                    <p className="text-sm text-blue-600">Start of quiet period</p>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
                  <span className="font-semibold">Duration:</span> {quietPeriod.duration} hours
                </div>
                <p className="text-sm text-blue-700">Best time for maintenance or low-staff operations</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No quiet periods detected</p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Pattern */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Traffic Pattern</h3>
        <div className="h-48 flex items-end justify-between space-x-2">
          {weeklyData.map(({ day, count }, index) => {
            const maxCount = Math.max(...weeklyData.map(d => d.count));
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 mt-2 text-center">{day.slice(0, 3)}</span>
                <span className="text-xs text-purple-600 font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">📋 Smart Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-70 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">Staffing Optimization</h4>
            <p className="text-sm text-indigo-700">
              {peakHours[0] ? `Increase security staff during ${peakHours[0].hour.toString().padStart(2, '0')}:00-${(peakHours[0].hour + 1).toString().padStart(2, '0')}:00` : 'Monitor traffic patterns for staffing decisions'}
            </p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">Maintenance Windows</h4>
            <p className="text-sm text-indigo-700">
              {quietPeriod ? `Schedule maintenance during ${quietPeriod.startHour.toString().padStart(2, '0')}:00-${(quietPeriod.startHour + quietPeriod.duration).toString().padStart(2, '0')}:00` : 'Identify low-traffic periods for maintenance'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;