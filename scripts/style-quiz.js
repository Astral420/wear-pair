document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('Login state:', isLoggedIn, 'localStorage value:', localStorage.getItem('isLoggedIn'));
    
    const profileButton = document.getElementById('profileButton');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Get current user info if logged in
    let currentUser = null;
    if (isLoggedIn) {
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        currentUser = JSON.parse(currentUserData);
        // Update only the text part of the profile button to show user's name
        if (currentUser.fullName) {
          // Find the text element inside the profile button and update only that
          const textElement = profileButton.querySelector('.text-name');
          if (textElement) {
            // Just change the text content, keep the original structure
            textElement.textContent = currentUser.fullName.split(' ')[0];
          }
        }
      }
    }
    
    // Set dropdown content based on login state
    if (isLoggedIn) {
      console.log('Setting logged-in dropdown menu');
      // User is logged in - show logout option and wishlist
      dropdownMenu.innerHTML = `
        <a href="#" id="logoutLink" class="dropdown-item">Logout</a>
        <a href="wishlist.html" class="dropdown-item">Wishlist</a>
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
      console.log('Setting logged-out dropdown menu');
      // User is not logged in - show only login option
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
    
    // Add event listener for the quiz start button to scroll to the quiz section
    const quizStartButton = document.getElementById('quizStartButton');
    if (quizStartButton) {
      quizStartButton.addEventListener('click', function() {
        const quizSection = document.querySelector('.container-10');
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
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
    
    // Style Quiz Functionality
    const styleQuizForm = document.getElementById('styleQuizForm');
    if (styleQuizForm) {
      const questions = styleQuizForm.querySelectorAll('.quiz-question');
      const nextButtons = styleQuizForm.querySelectorAll('.button-next');
      const submitButton = document.getElementById('quizSubmitButton');
      let currentStep = 1;
      
      // Initialize by showing only the first step
      updateQuizDisplay();
      
      // Add event listeners to all next buttons
      nextButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Get the current question's data-step attribute
          const currentQuestion = button.closest('.quiz-question');
          const currentStepNumber = parseInt(currentQuestion.getAttribute('data-step'));
          
          // Validate that an option is selected
          const radioName = getRadioNameForStep(currentStepNumber);
          const selectedOption = document.querySelector(`input[name="${radioName}"]:checked`);
          
          if (!selectedOption) {
            alert('Please select an option before continuing.');
            return;
          }
          
          // Move to the next step
          currentStep = currentStepNumber + 1;
          updateQuizDisplay();
        });
      });
      
      // Update quiz display based on current step
      function updateQuizDisplay() {
        // Hide all questions
        questions.forEach(question => {
          question.style.display = 'none';
        });
        
        // Show current question
        const currentQuestion = styleQuizForm.querySelector(`.quiz-question[data-step="${currentStep}"]`);
        if (currentQuestion) {
          currentQuestion.style.display = 'block';
        }
        
        // Show submit button only on the last step
        if (currentStep === 6) {
          submitButton.classList.add('show');
        } else {
          submitButton.classList.remove('show');
        }
      }
      
      // Helper function to get radio input name based on step
      function getRadioNameForStep(step) {
        switch(step) {
          case 1: return 'style';
          case 2: return 'colors';
          case 3: return 'outfit';
          case 4: return 'footwear';
          case 5: return 'icon';
          case 6: return 'trends';
          default: return '';
        }
      }
      
      // Reset quiz to first question
      function resetQuiz() {
        currentStep = 1;
        updateQuizDisplay();
        
        // Clear all selected radio buttons
        const radioInputs = styleQuizForm.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
          input.checked = false;
        });
      }
      
      // Outfit data - matches images and descriptions with style preferences
      const outfitData = [
        {
          id: "summer-casual",
          title: "Summer Casual",
          style: "Casual",
          colors: "Earth tones",
          image: "https://c.animaapp.com/maqs7d0oT9rk3D/img/image-20.png",
          description: "Relaxed white tee with denim shorts and comfortable sneakers - perfect for warm days.",
          details: {
            style: "Casual / Relaxed",
            colors: "Neutrals with denim blue",
            pieces: "White t-shirt, denim shorts, white sneakers",
            occasion: "Everyday casual, warm weather outings",
           
          }
        },
        {
          id: "modern-chic",
          title: "Modern Chic",
          style: "Chic",
          colors: "Neutrals",
          image: "https://c.animaapp.com/maqs7d0oT9rk3D/img/image-20-1.png",
          description: "Structured blazer with white satin blouse and high-waist tailored trousers.",
          details: {
            style: "Chic / Minimal",
            colors: "Neutrals + Black",
            pieces: "Structured blazer, white blouse, tailored trousers",
            occasion: "Office, formal events, upscale dining",
           
          }
        },
        {
          id: "bold-creative",
          title: "Bold Creative",
          style: "Colorful",
          colors: "Brights",
          image: "https://c.animaapp.com/maqs7d0oT9rk3D/img/image-20-2.png",
          description: "Color-blocked oversized jacket with graphic tee and wide-leg pants.",
          details: {
            style: "Colorful / Trendy",
            colors: "Bright color palette",
            pieces: "Oversized jacket, graphic tee, wide-leg pants",
            occasion: "Creative events, casual outings, art shows",
           
          }
        },
        {
          id: "sport-luxe",
          title: "Sport Luxe",
          style: "Sporty",
          colors: "Dark tones",
          image: "https://c.animaapp.com/maqs7d0oT9rk3D/img/image-20-3.png",
          description: "Zip-up track jacket with cargo joggers and high-top sneakers.",
          details: {
            style: "Sporty / Streetwear",
            colors: "Monochromes, darks",
            pieces: "Track jacket, cargo joggers, high-top sneakers",
            occasion: "Casual outings, urban settings, active days",
           
          }
        },
        {
          id: "effortless-elegant",
          title: "Effortless Elegant",
          style: "Elegant",
          colors: "Pastels",
          image: "https://c.animaapp.com/maqs7d0oT9rk3D/img/image-20-4.png",
          description: "Pleated midi skirt with knit top and low heels, paired with pearl earrings.",
          details: {
            style: "Elegant / Smart Casual",
            colors: "Pastels or neutrals",
            pieces: "Pleated midi skirt, knit top, low heels",
            occasion: "Brunches, dinner dates, semi-formal events",
            
          }
        },
        {
          id: "street-style",
          title: "Street Style",
          style: "Streetwear",
          colors: "Monochromes",
          image: "https://c.animaapp.com/maqs7d0oT9rk3D/img/image-20-5.png",
          description: "Oversized hoodie with slim joggers and chunky sneakers for urban appeal.",
          details: {
            style: "Streetwear / Casual",
            colors: "Monochrome palette",
            pieces: "Oversized hoodie, slim joggers, chunky sneakers",
            occasion: "Urban outings, casual hang-outs, streetwear events",
           
          }
        }
      ];
      
      // Handle form submission
      styleQuizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all form data
        const formData = {
          style: document.querySelector('input[name="style"]:checked')?.value,
          colors: document.querySelector('input[name="colors"]:checked')?.value,
          outfit: document.querySelector('input[name="outfit"]:checked')?.value,
          footwear: document.querySelector('input[name="footwear"]:checked')?.value,
          icon: document.querySelector('input[name="icon"]:checked')?.value,
          trends: document.querySelector('input[name="trends"]:checked')?.value
        };
        
        // Validate that the last question is answered
        if (!formData.trends) {
          alert('Please answer the last question before submitting.');
          return;
        }
        
        // Save style preferences to localStorage
        localStorage.setItem('userStylePreferences', JSON.stringify(formData));
        
        // Find the best matching outfit based on quiz answers
        const bestMatch = findBestOutfitMatch(formData);
        
        // Update the popup with the best match
        populateRecommendationPopup(bestMatch);
        
        // Show the results popup
        document.getElementById('resultsOverlay').style.display = 'block';
        document.getElementById('resultsPopup').style.display = 'block';
      });
      
      // Find the best matching outfit based on user preferences
      function findBestOutfitMatch(preferences) {
        // Score each outfit based on how well it matches the preferences
        const scoredOutfits = outfitData.map(outfit => {
          let score = 0;
          
          // Primary scoring - direct style match
          if (outfit.style === preferences.style) {
            score += 10;
          }
          
          // Score based on color preference
          if (outfit.colors === preferences.colors) {
            score += 5;
          }
          
          // Score based on footwear (if applicable)
          if (preferences.footwear === "Sneakers" && (outfit.id === "summer-casual" || outfit.id === "sport-luxe" || outfit.id === "street-style")) {
            score += 3;
          } else if (preferences.footwear === "Loafers" && outfit.id === "modern-chic") {
            score += 3;
          } else if (preferences.footwear === "Heels" && outfit.id === "effortless-elegant") {
            score += 3;
          }
          
          
          return {
            ...outfit,
            score
          };
        });
        
        // Sort by score (highest first) and return the best match
        scoredOutfits.sort((a, b) => b.score - a.score);
        return scoredOutfits[0];
      }
      
      // Populate the recommendation popup with the best match
      function populateRecommendationPopup(outfit) {
        const recommendedOutfit = document.getElementById('recommendedOutfit');
        
        // Create HTML for the recommended outfit
        const outfitHTML = `
          <img src="${outfit.image}" alt="${outfit.title}" class="outfit-image">
          <h3 class="outfit-title">${outfit.title}</h3>
          <p class="outfit-description">${outfit.description}</p>
          <div class="style-details">
            <div class="style-detail-item"><strong>Style:</strong> ${outfit.details.style}</div>
            <div class="style-detail-item"><strong>Colors:</strong> ${outfit.details.colors}</div>
            <div class="style-detail-item"><strong>Pieces:</strong> ${outfit.details.pieces}</div>
            <div class="style-detail-item"><strong>Occasions:</strong> ${outfit.details.occasion}</div>
          
          </div>
          <button class="view-details-button" data-outfit-id="${outfit.id}">View Details</button>
        `;
        
        recommendedOutfit.innerHTML = outfitHTML;
        
        // Add click handler to the View Details button
        const viewDetailsButton = recommendedOutfit.querySelector('.view-details-button');
        viewDetailsButton.addEventListener('click', function() {
          // Close the popup
          document.getElementById('resultsOverlay').style.display = 'none';
          document.getElementById('resultsPopup').style.display = 'none';
          
          // Find matching outfit in the recommended section and scroll to it
          const outfitTitle = outfit.title;
          const recommendedOutfits = document.querySelectorAll('.container-32 .text-wrapper-18');
          recommendedOutfits.forEach(outfitElement => {
            if (outfitElement.textContent === outfitTitle) {
              outfitElement.closest('[class^="container-"]').scrollIntoView({ behavior: 'smooth' });
            }
          });
          
          // Reset the quiz
          resetQuiz();
        });
      }
      
      // Handle popup close button
      document.getElementById('popupClose').addEventListener('click', function() {
        document.getElementById('resultsOverlay').style.display = 'none';
        document.getElementById('resultsPopup').style.display = 'none';
        
        // Reset the quiz
        resetQuiz();
      });
    }
  });