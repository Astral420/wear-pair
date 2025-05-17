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

    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Password validation
        if (password !== confirmPassword) {
          alert("Passwords don't match!");
          return;
        }
        
        // Check if we already have users in localStorage
        let users = [];
        const existingUsers = localStorage.getItem('users');
        if (existingUsers) {
          users = JSON.parse(existingUsers);
          
          // Check if email already exists
          const userExists = users.some(user => user.email === email);
          if (userExists) {
            alert('A user with this email already exists. Please use a different email or login.');
            return;
          }
        }
        
        // Add new user to array
        const newUser = {
          fullName: fullName,
          email: email,
          password: password, // Note: In a real app, this should be hashed
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        // Save updated users array
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify({
          fullName: fullName,
          email: email
        }));
        
        // Set logged in state
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Signup successful, user saved:', newUser.email);
        alert('Account created successfully! Redirecting to home page...');
        
        // Redirect to home page after successful signup
        window.location.href = 'index.html';
      });
    }
  });