import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMessageSquare } = FiIcons;

const FeedbackButton = () => {
  const handleFeedback = () => {
    alert('Feedback functionality - Demo version');
  };

  return (
    <button 
      className="fixed top-[calc(50%-20px)] -right-10 rotate-[270deg] flex gap-1 items-center px-3 py-2 bg-ballstate-red text-white rounded-t-md rounded-b-none shadow-lg hover:bg-red-700 transition-all z-50"
      onClick={handleFeedback}
    >
      <div className="rotate-90">
        <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">Feedback</span>
    </button>
  );
};

export default FeedbackButton;