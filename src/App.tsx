import React, { useState } from 'react';
import { DollarSign, Users, PlayCircle, Home, Wallet, User } from 'lucide-react';

declare global {
  interface Window {
    show_9009715: () => Promise<void>;
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            first_name?: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks] = useState(5);
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');

  // Get Telegram user data
  const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const userFullName = telegramUser 
    ? `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim() 
    : 'Guest User';
  const userPhotoUrl = telegramUser?.photo_url || 'https://via.placeholder.com/150';

  const watchAd = async () => {
    try {
      document.body.style.cursor = 'wait';
      const adButton = document.querySelector('#watchAdButton');
      if (adButton) {
        adButton.setAttribute('disabled', 'true');
        (adButton as HTMLElement).style.opacity = '0.5';
      }

      await window.show_9009715();
      
      setAdsWatched(prev => prev + 1);
      setTotalEarnings(prev => prev + 0.5);
      setTasksCompleted(prev => Math.min(prev + 1, totalTasks));
      
      alert('Congratulations! You earned $0.50');
    } catch (error) {
      console.error('Error showing ad:', error);
      alert('Failed to load ad. Please try again.');
    } finally {
      document.body.style.cursor = 'default';
      const adButton = document.querySelector('#watchAdButton');
      if (adButton) {
        adButton.removeAttribute('disabled');
        (adButton as HTMLElement).style.opacity = '1';
      }
    }
  };

  const renderHome = () => (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Total Earnings</h2>
          <DollarSign className="text-blue-500" />
        </div>
        <p className="text-3xl font-bold text-blue-600">${totalEarnings.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Total Ads Watched</h2>
          <PlayCircle className="text-green-500" />
        </div>
        <p className="text-3xl font-bold text-green-600">{adsWatched}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Completed: {tasksCompleted}</span>
            <span>Remaining: {totalTasks - tasksCompleted}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(tasksCompleted / totalTasks) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );

  const renderEarn = () => (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Watch Ads to Earn</h2>
        <p className="text-gray-600 mb-4">Each ad watched earns you $0.50!</p>
        <button
          id="watchAdButton"
          onClick={watchAd}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Watch Ad to Earn $0.50
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Refer & Earn</h2>
          <Users className="text-purple-500" />
        </div>
        <p className="text-gray-600 mb-4">Invite friends and earn bonus rewards!</p>
        <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
          Invite Friends
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center">Total Referrals: {referrals}</p>
      </div>
    </>
  );

  const renderWithdraw = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Withdraw Funds</h2>
      <p className="text-gray-600 mb-6">Available Balance: ${totalEarnings.toFixed(2)}</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Method</label>
          <select
            value={withdrawalMethod}
            onChange={(e) => setWithdrawalMethod(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a method</option>
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Address</label>
          <input
            type="text"
            value={withdrawalAddress}
            onChange={(e) => setWithdrawalAddress(e.target.value)}
            placeholder="Enter withdrawal address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button 
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-4"
          onClick={() => alert('Withdrawal request submitted!')}
        >
          Submit Withdrawal
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col items-center mb-6">
        <img 
          src={userPhotoUrl} 
          alt={userFullName}
          className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-500"
        />
        <h2 className="text-2xl font-semibold text-gray-800">{userFullName}</h2>
        {telegramUser?.username && (
          <p className="text-gray-500">@{telegramUser.username}</p>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1">Total Earnings</h3>
          <p className="text-xl font-semibold text-blue-600">${totalEarnings.toFixed(2)}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1">Ads Watched</h3>
          <p className="text-xl font-semibold text-green-600">{adsWatched}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-500 mb-1">Total Referrals</h3>
          <p className="text-xl font-semibold text-purple-600">{referrals}</p>
        </div>

        <button 
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          onClick={() => alert('Logged out successfully!')}
        >
          Logout
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return renderHome();
      case 'earn':
        return renderEarn();
      case 'withdraw':
        return renderWithdraw();
      case 'profile':
        return renderProfile();
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src={userPhotoUrl}
            alt={userFullName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div>
            <h1 className="font-semibold">{userFullName}</h1>
            <p className="text-sm opacity-90">${totalEarnings.toFixed(2)} earned</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-lg mx-auto space-y-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <button 
            className={`flex flex-col items-center ${currentPage === 'home' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => setCurrentPage('home')}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            className={`flex flex-col items-center ${currentPage === 'earn' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => setCurrentPage('earn')}
          >
            <DollarSign size={20} />
            <span className="text-xs mt-1">Earn</span>
          </button>
          <button 
            className={`flex flex-col items-center ${currentPage === 'withdraw' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => setCurrentPage('withdraw')}
          >
            <Wallet size={20} />
            <span className="text-xs mt-1">Withdraw</span>
          </button>
          <button 
            className={`flex flex-col items-center ${currentPage === 'profile' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => setCurrentPage('profile')}
          >
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;