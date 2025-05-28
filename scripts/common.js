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
        <a href="submissions.html" class="dropdown-item">Submissions</a>
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
      { id: 16, name: 'Bomber Jacket', price: '80.99', image: 'https://c.animaapp.com/FpgE2lUx/img/image@2x.png' },
      { id: 17, name: 'Summer Straw Hat', price: '29.99', image: 'https://img.ltwebstatic.com/images3_spmp/2024/06/10/64/1717994598ca89fa6a234f30b9de88e6e2ad731e04_thumbnail_900x.webp' },
      { id: 18, name: 'Premium Linen Shirt', price: '45.99', image: 'https://image.uniqlo.com/UQ/ST3/us/imagesgoods/455957/item/usgoods_30_455957_3x4.jpg?width=400'  },
      { id: 19, name: 'Bari Casual Canvas Sneakers', price: '39.99', image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/389383/06/sv01/fnd/PHL/fmt/png/Bari-Casual-Canvas-Sneakers' },
      { id: 20, name: 'Black Floral Summer Dress', price: '54.99', image: 'https://petalandpup.com/cdn/shop/files/LewisMiniDress-BlackFloral-2638.jpg?v=1746158494&width=600' },
      { id: 21, name: 'Striped Cotton Polo', price: '32.99', image: 'https://image.uniqlo.com/UQ/ST3/us/imagesgoods/475765/item/usgoods_02_475765_3x4.jpg?width=400'  },
      { id: 22, name: 'Lightweight Cardigan', price: '48.99', image: 'https://img.ltwebstatic.com/images3_spmp/2024/08/26/b4/172464550816216b2ac5c3d1cdedd560d79fb8a937_wk_1724747680_thumbnail_900x.webp' },
      { id: 23, name: 'Slim Chino Pants', price: '45.99', image: 'https://oldnavy.com.ph/cdn/shop/products/096_408052_BOURBON-1_2000x.jpg?v=1666780155' }, 
      { id: 24, name: 'Vintage Leather Watch', price: '65.99',  image: 'https://fossil.scene7.com/is/image/FossilPartners/FS5304_onwrist?$sfcc_onmodel_large$' },
      { id: 25, name: 'Polarized Sunglasses', price: '54.99', image: 'https://img.ltwebstatic.com/images3_spmp/2024/11/07/02/17309651551f39e1806338dadf26acc5125c526812_thumbnail_900x.webp' },
      { id: 26, name: 'Patterned Scarf', price: '54.99', image: 'https://img.ltwebstatic.com/images3_spmp/2025/02/24/00/17403623262562bf0eddf539e87a06837f2e7a484c_thumbnail_900x.webp' },
      { id: 27, name: 'Silver Waist Belt Lace', price: '54.99', image: 'https://img.ltwebstatic.com/images3_spmp/2024/04/12/c3/1712928126ad7a4f4b3dbae263fe87a36451daa61a_thumbnail_900x.webp' },
      { id: 28, name: 'YOUNGLA Tree Camo Jeans', price: '54.99', image: 'https://www.youngla.com/cdn/shop/files/2059_dark_tree_camo_002_11_26_rudy_ecomm_c160d12a-8e3f-4707-9a7c-6a462ef7521e.jpg?v=1731451424&width=2400' },
      { id: 29, name: 'Brown Formal Blazer', price: '54.99', image: 'https://img.ltwebstatic.com/images3_pi/2024/10/14/99/1728868931407c3634fae039877a61e02cadb58ff6_thumbnail_900x.webp' },
      { id: 30, name: 'Mens Swimwear Set', price: '54.99', image: 'https://img.ltwebstatic.com/images3_pi/2025/03/28/52/17431490555c4bbd4c1d6f75916f2dd265821cc6d4_thumbnail_900x.webp' },
      { id: 31, name: 'Gymshark Tank Top', price: '54.99', image: 'https://cdn.shopify.com/s/files/1/0156/6146/files/LegacyDropArmTankGSStoneGreyA5A2Z-GB7S-1606-0171_818e2dd5-068d-457e-aaad-100e37ac42a2_3840x.jpg?v=1742894722' },
      { id: 32, name: 'MN+LA "Im Lovin It" Tee', price: '54.99', image: 'https://mn-la.com/cdn/shop/files/8_114bc852-b56a-4651-984e-81bbd6e55ed6.jpg?v=1685284310&width=1946' },
      { id: 33, name: 'Diamond Rhombus Earrings', price: '54.99', image: 'https://img.ltwebstatic.com/images3_spmp/2023/10/21/56/1697875889051a00da7994797e08ee8e63b3a830a4_thumbnail_900x.webp' },
      { id: 34, name: 'Loose Fit Sweatshirt', price: '54.99', image: 'https://img.ltwebstatic.com/v4/j/pi/2025/05/14/9c/174718790879f4f622b9dbe4e731b2852592c27f71_thumbnail_900x.webp' },
      { id: 35, name: 'Embroidered Jacquard Shirt', price: '54.99', image: 'https://static.zara.net/assets/public/b2b7/e332/d2614879bbeb/ff97ea81b5b2/07036201406-p/07036201406-p.jpg?ts=1742384348625&w=651' },
      { id: 36, name: 'Basic Hoodie', price: '54.99', image: 'https://static.zara.net/assets/public/4b3d/8d58/2d654031a22c/fa161eda6a62/00761330800-p/00761330800-p.jpg?ts=1744102031666&w=651' },
      { id: 37, name: 'Drawstring Casual Shorts', price: '54.99', image: 'https://img.ltwebstatic.com/images3_pi/2024/12/14/d2/17341595318535136d9f2ea60c1cdf7096a92122ff_thumbnail_900x.webp' },
      { id: 38, name: 'Festival Skirt', price: '54.99', image: 'https://www.youngla.com/cdn/shop/files/YLA_250224_0249.jpg?v=1742219591&width=1000' },
      { id: 39, name: 'A-Frame Trucker Hat', price: '54.99', image: 'https://www.youngla.com/cdn/shop/files/9046_navy_002_11_26_floor.jpg?v=1726614430&width=2400' },
      { id: 40, name: 'Textured V-Neck Sleeveless Dress', price: '54.99', image: 'https://img.ltwebstatic.com/images3_pi/2024/08/29/52/1724938838750c8d46bb89e789e5a9292488473ff1_thumbnail_900x.webp' },
      { id: 41, name: 'Floral Print Summer Dress', price: '54.99', image: 'https://img.ltwebstatic.com/images3_pi/2023/07/04/16884390399c5acc3b69b7c79f269102c20070bf6b_thumbnail_900x.webp' },
      { id: 42, name: 'Cargo Trousers', price: '54.99', image: 'https://static.zara.net/assets/public/f54e/c7ab/49a24ea1aa7f/75e46356b782/00108302805-a1/00108302805-a1.jpg?ts=1722445706941&w=326' },
      { id: 43, name: 'Ripped Flared Jeans', price: '54.99', image: 'https://static.zara.net/assets/public/4120/5a65/cec7405eb851/aa7fc3e4b0b3/00840359427-p/00840359427-p.jpg?ts=1747840194274&w=326' },
      { id: 44, name: 'Training Fleece Joggers', price: '54.99', image: 'https://cdn.shopify.com/s/files/1/0156/6146/files/images-TrainingFleeceJoggerGSClassicGreenB7A4D_EC20_1151_0153_3840x.jpg?v=1746463943' },
      { id: 45, name: 'Compression Shirt', price: '54.99', image: 'https://cdn.shopify.com/s/files/1/0156/6146/files/images-ElementBaselayerT_ShirtGSWhiteA2B4C_WB57_0066_3840x.jpg?v=1747310903' },
      { id: 46, name: 'Track Jacket', price: '54.99', image: 'https://cdn.shopify.com/s/files/1/0156/6146/files/RetroCrinkleNylonTrackJacketGSBlackA2C1C-BB2J-0797_3840x.jpg?v=1743097059' },
      { id: 47, name: 'Windproof Shell Parka', price: '54.99', image: 'https://image.uniqlo.com/GU/ST3/us/imagesgoods/351278/item/usgoods_02_351278_3x4.jpg?width=600' },
      { id: 48, name: 'Flared Maxi Skirt', price: '54.99', image: 'https://image.uniqlo.com/GU/ST3/us/imagesgoods/356944/item/usgoods_63_356944_3x4.jpg?width=600' }
    ];
    
    // Add categories to products for better filtering in products.js
    // Add these category assignments here to help with filtering on the products page
    const categories = {
      1: 'hoodies',
      2: 't-shirts',
      3: 'jeans',
      4: 't-shirts',
      5: 'swimwear',
      6: 'shoes',
      7: 'accessories',
      8: 't-shirts',
      9: 'accessories',
      10: 'accessories',
      11: 'hoodies',
      12: 't-shirts',
      13: 'dresses',
      14: 'shoes',
      15: 'blazers',
      16: 'hoodies',
      17: 'accessories',
      18: 't-shirts',
      19: 'shoes',
      20: 'dresses',
      21: 't-shirts',
      22: 't-shirts',
      23: 'jeans',
      24: 'accessories',
      25: 'accessories',
      26: 'accessories',
      27: 'accessories',
      28: 'jeans',
      29: 'blazers',
      30: 'swimwear',
      31: 't-shirts',
      32: 't-shirts',
      33: 'accessories',
      34: 't-shirts',
      35: 't-shirts',
      36: 'hoodies',
      37: 'jeans',
      38: 'jeans',
      39: 'accessories',
      40: 'dresses',
      41: 'dresses',
      42: 'jeans',
      43: 'jeans',
      44: 'jeans',
      45: 't-shirts',
      46: 'hoodies',
      47: 'hoodies',
      48: 'jeans'
    };
    
    // Assign categories to products
    products.forEach(product => {
      product.category = categories[product.id];
    });
    
    // Expose products data to window object for outfit builder
    window.products = products;
    window.productCategories = categories;
    
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
      
      // Filter products based on search term (only show products with names and images)
      const matchingProducts = products.filter(product => 
        product.name && product.name.toLowerCase().includes(searchTerm) && product.image
      );
      
      console.log(`Found ${matchingProducts.length} matching products for "${searchTerm}"`);
      
      if (matchingProducts.length === 0) {
        searchResultsDropdown.style.display = 'none';
        return;
      }
      
      // Display matching products in dropdown (limit to first 5 for better UX)
      matchingProducts.slice(0, 5).forEach(product => {
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
          if (!window.location.pathname.includes('products.html')) {
            // Store only the product id in localStorage before redirect
            localStorage.setItem('popupProductId', product.id);
            localStorage.removeItem('lastSearch');
            window.location.href = 'products.html';
          } else {
            searchResultsDropdown.style.display = 'none';
            searchInput.value = product.name;
            if (window.openProductPopup) {
              window.openProductPopup(product);
            }
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