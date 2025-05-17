document.addEventListener('DOMContentLoaded', function() {
    // Define test credentials (not displayed to user)
    const TEST_EMAIL = "test@wearpair.com";
    const TEST_PASSWORD = "fashion2023";
    
    const profileButton = document.getElementById('profileButton');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Check if user is already logged in from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Get current user info if logged in
    let currentUser = null;
    if (isLoggedIn) {
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        currentUser = JSON.parse(currentUserData);
        // Update only the text part of the profile button to show user's name
        if (currentUser.fullName) {
          // Find the text element inside the profile button and update only that
          const textElement = profileButton.querySelector('.text-wrapper-3');
          if (textElement) {
            // Just change the text content, keep the original structure
            textElement.textContent = currentUser.fullName.split(' ')[0];
          }
        }
      }
    }
    
    // Set dropdown content based on login state
    if (isLoggedIn) {
      // User is logged in - show logout option
      dropdownMenu.innerHTML = `
        <a href="#" id="logoutLink" class="dropdown-item">Logout</a>
        <a href="/#" class="dropdown-item">Wishlist</a>
        <a href="/#" class="dropdown-item">Submissions</a>
      `;
      
      // Add logout functionality
      document.getElementById('logoutLink')?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        alert('Logged out successfully');
        window.location.reload();
      });
    } else {
      // User is not logged in - show login option
      dropdownMenu.innerHTML = `
        <a href="login.html" class="dropdown-item">Login</a>
      `;
    }
    
    // Toggle dropdown on button click
    profileButton.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });
    
    // Close dropdown when clicking elsewhere on the document
    document.addEventListener('click', function(e) {
      if (!profileButton.contains(e.target)) {
        dropdownMenu.classList.remove('active');
      }
    });

    // Search functionality
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm !== '') {
          // Store search term in localStorage for cross-page consistency
          localStorage.setItem('lastSearch', searchTerm);
          
          // For now, alert the search term since we don't have a search results page
          alert(`Searching for: ${searchTerm}\nSearch functionality will be implemented in a future update.`);
          
          // In a real implementation, redirect to a search results page
          // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
        }
      });
      
      // Set search input value from localStorage if available
      const lastSearch = localStorage.getItem('lastSearch');
      if (lastSearch && searchInput) {
        searchInput.value = lastSearch;
      }
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // First check test credentials
        if (email === TEST_EMAIL && password === TEST_PASSWORD) {
          // Set a flag in localStorage to simulate being logged in
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify({
            fullName: 'Test User',
            email: TEST_EMAIL
          }));
          console.log('Login successful with test credentials');
          alert('Login successful! Redirecting to home page...');
          
          // Redirect to home page after successful login
          window.location.href = 'index.html';
          return;
        }
        
        // If not test credentials, check registered users
        const existingUsers = localStorage.getItem('users');
        if (existingUsers) {
          const users = JSON.parse(existingUsers);
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            // Valid registered user found
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
              fullName: user.fullName,
              email: user.email
            }));
            console.log('Login successful with registered user:', user.email);
            alert('Login successful! Redirecting to home page...');
            
            // Redirect to home page after successful login
            window.location.href = 'index.html';
            return;
          }
        }
        
        // If we get here, login failed
        alert('Invalid credentials. Please try again or register for an account.');
      });
    }
  });