// Common functionality shared across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('Login state:', isLoggedIn, 'localStorage value:', localStorage.getItem('isLoggedIn'));
    
    const profileButton = document.getElementById('profileButton');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (!profileButton || !dropdownMenu) {
      console.error('Profile button or dropdown menu not found');
      return;
    }

    // Get current user info if logged in
    let currentUser = null;
    if (isLoggedIn) {
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        currentUser = JSON.parse(currentUserData);
        // Update only the text part of the profile button to show user's name
        if (currentUser.fullName) {
          // Try both classes that might be used (.text-name for products.html and .text-wrapper-3 for index.html)
          let textElement = profileButton.querySelector('.text-name');
          if (!textElement) {
            textElement = profileButton.querySelector('.text-wrapper-3');
          }

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
      console.log('Profile button clicked');
      dropdownMenu.classList.toggle('active');
      console.log('Dropdown active state:', dropdownMenu.classList.contains('active'));
    });
    
    // Close dropdown when clicking elsewhere on the document
    document.addEventListener('click', function(e) {
      if (!profileButton.contains(e.target)) {
        dropdownMenu.classList.remove('active');
      }

      // Also close search results dropdown if clicking outside
      if (searchInput && searchResultsDropdown && 
          !searchInput.contains(e.target) && 
          !searchResultsDropdown.contains(e.target)) {
        searchResultsDropdown.style.display = 'none';
      }
    });
    
    // SEARCH FUNCTIONALITY
    console.log("Setting up search functionality");
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    const searchResultsDropdown = document.querySelector('.search-results-dropdown');
    
    if (!searchInput || !searchResultsDropdown) {
      console.error("Search elements not found in the DOM:", {
        searchInput: !!searchInput,
        searchResultsDropdown: !!searchResultsDropdown
      });
      return;
    }
    
    console.log("Search elements found, setting up listeners");
    
    // Product database with images
    const products = [
      { id: 1, name: 'Denim Jacket', price: '59.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image.png' },
      { id: 2, name: 'Knitted Sweater', price: '39.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-1.png' },
      { id: 3, name: 'Slim-Fit Jeans', price: '49.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-2.png' },
      { id: 4, name: 'White T-Shirt', price: '19.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-3.png' },
      { id: 5, name: 'Sleeveless Sport Swimsuit', price: '59.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-4.png' },
      { id: 6, name: 'Leather Boots', price: '89.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-5.png' },
      { id: 7, name: 'Adjustable Shoulder Bag', price: '79.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-6.png' },
      { id: 8, name: 'Men\'s Fashionable T-Shirt', price: '80.99', image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-15.png' },
      { id: 9, name: 'Layered Chain Necklace', price: '80.99', image: 'https://img.ltwebstatic.com/images3_spmp/2024/04/23/b2/1713840736fdd321a04b895695dab9029a48bdf29d_thumbnail_900x.webp' },
      { id: 10, name: 'Men Star & Lightning Decor Ring Set', price: '80.99', image: 'https://img.ltwebstatic.com/images3_pi/2022/11/01/1667282605139b18061a747fa75d434c82cd8f73a0_thumbnail_900x.webp' },
      { id: 11, name: 'YOUNGLA The Boys Hoodie', price: '80.99', image: 'https://www.youngla.com/cdn/shop/files/UntitledSession13694.jpg?v=1744134834&width=1255' },
      { id: 12, name: 'Off-shoulder Graphic Tee', price: '80.99', image: 'https://img.ltwebstatic.com/images3_pi/2024/12/18/bf/1734505217ffdce50c66aa658c2232a269b3744ba8_thumbnail_900x.webp' },
      { id: 13, name: 'Sleeveless Dress', price: '80.99', image: 'https://img.ltwebstatic.com/v4/j/spmp/2025/03/26/f4/174299283770ff3f1bc9d8bc7db84ca8e6763d989d_wk_1745220650_thumbnail_900x.webp' },
      { id: 14, name: 'New Balances 530', price: '80.99', image: 'https://nb.scene7.com/is/image/NB/mr530ck_nb_05_i?$pdpflexf2$&wid=440&hei=440' },
      { id: 15, name: 'Manfinity Loose Fit Blazer', price: '80.99', image: 'https://img.ltwebstatic.com/images3_pi/2025/02/12/4f/1739326527025da56ff20ec19fdbd7bbe10d65314a_thumbnail_900x.webp' },
      { id: 16, name: 'Bomber Jacket', price: '80.99', image: 'https://c.animaapp.com/FpgE2lUx/img/image@2x.png' }

    ];
    
    // Add event listener for search input
    searchInput.addEventListener('input', function(e) {
      console.log("Search input event fired");
      const searchTerm = e.target.value.trim().toLowerCase();
      
      // Clear previous results
      searchResultsDropdown.innerHTML = '';
      
      if (searchTerm.length < 2) {
        searchResultsDropdown.style.display = 'none';
        return;
      }
      
      // Filter products based on search term
      const matchingProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
      );
      
      console.log(`Found ${matchingProducts.length} matching products for "${searchTerm}"`);
      
      if (matchingProducts.length === 0) {
        searchResultsDropdown.style.display = 'none';
        return;
      }
      
      // Display matching products in dropdown
      matchingProducts.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="search-result-image">
          <div class="search-result-details">
            <div class="search-result-name">${product.name}</div>
          </div>
        `;
        
        // Make the result item clickable
        resultItem.addEventListener('click', function() {
          console.log(`Clicked on product: ${product.name}`);
          
          // Redirect to products page if on a different page
          if (!window.location.pathname.includes('products.html')) {
            // Clear the search input from localStorage when navigating to avoid persistence
            localStorage.removeItem('lastSearch');
            window.location.href = 'products.html?highlight=' + product.id;
          } else {
            // Just highlight the product on the current page
            highlightProduct(product.id);
            searchResultsDropdown.style.display = 'none';
            searchInput.value = product.name;
          }
        });
        
        searchResultsDropdown.appendChild(resultItem);
      });
      
      // Show dropdown
      searchResultsDropdown.style.display = 'block';
    });
    
    // Prevent form submission
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      return false;
    });
    
    // Function to highlight a product
    function highlightProduct(productId) {
      // Remove any existing highlights
      document.querySelectorAll('.container-3, .container-4, .container-5, .container-6, .container-7, .container-8, .container-9, .container-10, .container-11, .container-12, .container-13, .container-14, .container-15, .container-16, .container-17, .container-18').forEach(container => {
        container.classList.remove('highlighted');
      });
      
      // Find the container with the matching product ID
      const productContainer = document.querySelector(`.container-${Number(productId) + 2}`);
      if (productContainer) {
        productContainer.classList.add('highlighted');
        // Scroll to the highlighted product
        productContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Clear search input on page load across all pages
    if (searchInput) {
      // Only populate search input from URL parameter on products page
      const urlParams = new URLSearchParams(window.location.search);
      const highlightId = urlParams.get('highlight');
      
      if (window.location.pathname.includes('products.html') && highlightId) {
        // If on products page with a highlight parameter, find the product and set the search input
        const product = products.find(p => p.id.toString() === highlightId);
        if (product) {
          searchInput.value = product.name;
          highlightProduct(highlightId);
        }
      } else {
        // On all other pages or without highlight parameter, clear the search input
        searchInput.value = '';
      }
    }
});

// WISHLIST HELPER FUNCTIONS - Available globally

// Get the current user's email (or null if not logged in)
function getCurrentUserEmail() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) return null;
  
  const currentUserData = localStorage.getItem('currentUser');
  if (!currentUserData) return null;
  
  const currentUser = JSON.parse(currentUserData);
  return currentUser.email;
}

// Get wishlist for current user
function getUserWishlist() {
  const userEmail = getCurrentUserEmail();
  if (!userEmail) return [];
  
  // Get all wishlists
  const allWishlists = JSON.parse(localStorage.getItem('userWishlists')) || {};
  
  // Return this user's wishlist, or empty array if none exists
  return allWishlists[userEmail] || [];
}

// Save wishlist for current user
function saveUserWishlist(wishlistItems) {
  const userEmail = getCurrentUserEmail();
  if (!userEmail) {
    console.error('Cannot save wishlist - user not logged in');
    return false;
  }
  
  // Get all wishlists
  const allWishlists = JSON.parse(localStorage.getItem('userWishlists')) || {};
  
  // Update this user's wishlist
  allWishlists[userEmail] = wishlistItems;
  
  // Save back to localStorage
  localStorage.setItem('userWishlists', JSON.stringify(allWishlists));
  return true;
}

// Add item to current user's wishlist
function addToUserWishlist(item) {
  const wishlist = getUserWishlist();
  
  // Check if already in wishlist
  if (wishlist.some(existingItem => existingItem.id === item.id)) {
    return false; // Already exists
  }
  
  // Add new item
  wishlist.push(item);
  
  // Save updated wishlist
  return saveUserWishlist(wishlist);
}

// Remove item from current user's wishlist
function removeFromUserWishlist(productId) {
  const wishlist = getUserWishlist();
  
  // Filter out the item to remove
  const updatedWishlist = wishlist.filter(item => item.id !== productId.toString());
  
  // Save updated wishlist
  return saveUserWishlist(updatedWishlist);
}

// Check if an item is in the current user's wishlist
function isInUserWishlist(productId) {
  const wishlist = getUserWishlist();
  return wishlist.some(item => item.id === productId.toString());
} 