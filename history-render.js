// history-render.js

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hook up the "Close" button
  const closeButton = document.getElementById('back-to-browser');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      if (window.historyApi && window.historyApi.goHome) {
        window.historyApi.goHome(); // Calls the function from history-preload.js
      } else {
        console.error('historyApi.goHome is not available');
      }
    });
  }

  // 2. Load and display the history
  async function loadHistory() {
    const historyList = document.getElementById('history-list');
    
    if (!historyList) {
      console.error('history-list element not found');
      return;
    }

    // Show loading state
    historyList.innerHTML = '<p>Loading history...</p>';
    
    try {
      // Check if API is available
      if (!window.historyApi || !window.historyApi.getHistory) {
        historyList.innerHTML = '<p style="color: red;">Error: History API not available. Please check console.</p>';
        console.error('window.historyApi.getHistory is not available');
        return;
      }

      // Ask the "brain" (main.js) for the history array
      const history = await window.historyApi.getHistory(); 
    
      // Clear loading message
      historyList.innerHTML = ''; 
    
      if (!history || history.length === 0) {
        historyList.innerHTML = '<p>No history found.</p>';
        return;
      }
    
      // Loop through the history and build the HTML
      for (const item of history) {
        const div = document.createElement('div');
        const title = document.createElement('a');
        
        // We make the link 'javascript:void(0)' so it doesn't try to navigate
        title.href = 'javascript:void(0)'; 
        title.textContent = item.title || 'Untitled';
        // We add a click listener in the future to open this in the browser
  
        const url = document.createElement('div');
        url.className = 'url';
        url.textContent = item.url || '';
        
        div.appendChild(title);
        div.appendChild(url);
        historyList.appendChild(div);
      }
    } catch (error) {
      historyList.innerHTML = '<p style="color: red;">Error loading history: ' + error.message + '</p>';
      console.error('Error loading history:', error);
    }
  }
  
  // Run the function when the page loads
  loadHistory();
});