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

      // Also close search results dropdown if clicking outside
      if (searchInput && searchResultsDropdown && 
          !searchInput.contains(e.target) && 
          !searchResultsDropdown.contains(e.target)) {
        searchResultsDropdown.style.display = 'none';
      }
      
      // Close product popup if clicking outside
      if (productPopup && !productPopup.contains(e.target) && e.target.closest('.product-container') === null) {
        productPopup.style.display = 'none';
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
      { 
        id: 1, 
        name: 'Denim Jacket', 
        price: '59.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image.png',
        description: 'Classic denim jacket with button closure and multiple pockets. Perfect for casual everyday wear.',
        buyLink: 'https://www.example.com/buy/denim-jacket'
      },
      { 
        id: 2, 
        name: 'Knitted Sweater', 
        price: '39.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-1.png',
        description: 'Soft and cozy knitted sweater perfect for colder weather. Features a comfortable fit and stylish design.',
        buyLink: 'https://www.example.com/buy/knitted-sweater'
      },
      { 
        id: 3, 
        name: 'Slim-Fit Jeans', 
        price: '49.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-2.png',
        description: 'Modern slim-fit jeans with stretchy fabric for maximum comfort. Stylish and versatile for any occasion.',
        buyLink: 'https://www.example.com/buy/slim-fit-jeans'
      },
      { 
        id: 4, 
        name: 'White T-Shirt', 
        price: '19.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-3.png',
        description: 'Classic solid round neck t-shirt made with premium cotton. Basic essential for every wardrobe.',
        buyLink: 'https://www.example.com/buy/white-t-shirt'
      },
      { 
        id: 5, 
        name: 'Sleeveless Sport Swimsuit', 
        price: '59.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-4.png',
        description: 'Athletic swimsuit designed for performance and comfort. Features quick-drying and chlorine-resistant fabric.',
        buyLink: 'https://www.example.com/buy/sport-swimsuit'
      },
      { 
        id: 6, 
        name: 'Leather Boots', 
        price: '89.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-5.png',
        description: 'Premium leather boots with durable soles. Perfect for both style and functionality in any weather.',
        buyLink: 'https://www.example.com/buy/leather-boots'
      },
      { 
        id: 7, 
        name: 'Adjustable Shoulder Bag', 
        price: '79.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-6.png',
        description: 'Versatile shoulder bag with adjustable straps and multiple compartments for everyday essentials.',
        buyLink: 'https://www.example.com/buy/shoulder-bag'
      },
      { 
        id: 8, 
        name: 'Men\'s Fashionable T-Shirt', 
        price: '80.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-15.png',
        description: 'Trendy men\'s t-shirt with modern design. Made with high-quality fabric for comfort and durability.',
        buyLink: 'https://www.example.com/buy/mens-t-shirt'
      }
    ];
    
    // Extended product database for all products on the page
    const extendedProducts = [
      ...products,
      { 
        id: 9, 
        name: 'Layered Chain Necklace', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/images3_spmp/2024/04/23/b2/1713840736fdd321a04b895695dab9029a48bdf29d_thumbnail_900x.webp',
        description: 'Elegant layered chain necklace with multiple strands. Perfect for adding a sophisticated touch to any outfit.',
        buyLink: 'https://www.example.com/buy/chain-necklace',
        category: 'accessories'
      },
      { 
        id: 10, 
        name: 'Men Star & Lightning Decor Ring Set', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/images3_pi/2022/11/01/1667282605139b18061a747fa75d434c82cd8f73a0_thumbnail_900x.webp',
        description: 'Stylish ring set featuring star and lightning designs. Made with quality materials for everyday wear.',
        buyLink: 'https://www.example.com/buy/mens-ring-set',
        category: 'accessories'
      },
      { 
        id: 11, 
        name: 'YOUNGLA The Boys Hoodie', 
        price: '80.99', 
        image: 'https://www.youngla.com/cdn/shop/files/UntitledSession13694.jpg?v=1744134834&width=1255',
        description: 'Comfortable and trendy hoodie with modern design. Perfect for casual outings and everyday wear.',
        buyLink: 'https://www.example.com/buy/youngla-hoodie',
        category: 'hoodies'
      },
      { 
        id: 12, 
        name: 'Off-shoulder Graphic Tee', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/images3_pi/2024/12/18/bf/1734505217ffdce50c66aa658c2232a269b3744ba8_thumbnail_900x.webp',
        description: 'Stylish off-shoulder t-shirt with graphic print. Comfortable fabric and trendy design for casual wear.',
        buyLink: 'https://www.example.com/buy/graphic-tee',
        category: 't-shirts'
      },
      { 
        id: 13, 
        name: 'Sleeveless Dress', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/v4/j/spmp/2025/03/26/f4/174299283770ff3f1bc9d8bc7db84ca8e6763d989d_wk_1745220650_thumbnail_900x.webp',
        description: 'Elegant sleeveless dress perfect for summer. Features a flattering silhouette and comfortable fabric.',
        buyLink: 'https://www.example.com/buy/sleeveless-dress',
        category: 'dresses'
      },
      { 
        id: 14, 
        name: 'New Balances 530', 
        price: '80.99', 
        image: 'https://nb.scene7.com/is/image/NB/mr530ck_nb_05_i?$pdpflexf2$&wid=440&hei=440',
        description: 'Iconic New Balance 530 sneakers combining style and comfort. Perfect for everyday wear and athletic activities.',
        buyLink: 'https://www.example.com/buy/new-balance-530',
        category: 'shoes'
      },
      { 
        id: 15, 
        name: 'Manfinity Loose Fit Blazer', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/images3_pi/2025/02/12/4f/1739326527025da56ff20ec19fdbd7bbe10d65314a_thumbnail_900x.webp',
        description: 'Stylish loose-fit blazer for modern men. Versatile piece that can be dressed up or down for various occasions.',
        buyLink: 'https://www.example.com/buy/loose-fit-blazer',
        category: 'blazers'
      },
      { 
        id: 16, 
        name: 'Bomber Jacket', 
        price: '80.99', 
        image: 'https://c.animaapp.com/FpgE2lUx/img/image@2x.png',
        description: 'Classic bomber jacket with modern design. Features comfortable fit and durable materials for everyday wear.',
        buyLink: 'https://www.example.com/buy/bomber-jacket',
        category: 'hoodies'
      }
    ];
    
    // Also add categories to the original products array
    products[0].category = 'hoodies'; // Denim Jacket
    products[1].category = 't-shirts'; // Knitted Sweater
    products[2].category = 'jeans'; // Slim-Fit Jeans
    products[3].category = 't-shirts'; // White T-Shirt
    products[4].category = 'swimwear'; // Sleeveless Sport Swimsuit
    products[5].category = 'shoes'; // Leather Boots
    products[6].category = 'accessories'; // Adjustable Shoulder Bag
    products[7].category = 't-shirts'; // Men's Fashionable T-Shirt
    
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
      const matchingProducts = extendedProducts.filter(product => 
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
            <div class="search-result-price">$${product.price}</div>
          </div>
        `;
        
        // Make the result item clickable
        resultItem.addEventListener('click', function() {
          console.log(`Clicked on product: ${product.name}`);
          // For now just highlight the product on the current page
          // In a real implementation, this could navigate to a product detail page
          highlightProduct(product.id);
          searchResultsDropdown.style.display = 'none';
          searchInput.value = product.name;
          // Save the search term to localStorage
          localStorage.setItem('lastSearch', product.name);
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
      const productContainer = document.querySelector(`.container-${productId + 2}`);
      if (productContainer) {
        productContainer.classList.add('highlighted');
        // Scroll to the highlighted product
        productContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Set search input value from localStorage if available
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch && searchInput) {
      searchInput.value = lastSearch;
    }
    
    // PRODUCT POPUP FUNCTIONALITY
    // Create the popup element and modal overlay
    const productPopup = document.createElement('div');
    productPopup.className = 'product-popup';
    productPopup.style.display = 'none';
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    document.body.appendChild(modalOverlay);
    document.body.appendChild(productPopup);
    
    // Get all product containers
    const productContainers = document.querySelectorAll('.container-3, .container-4, .container-5, .container-6, .container-7, .container-8, .container-9, .container-10, .container-11, .container-12, .container-13, .container-14, .container-15, .container-16, .container-17, .container-18');
    
    // Function to open the popup
    function openProductPopup(product) {
      // Update popup content
      productPopup.innerHTML = `
        <div class="popup-content">
          <button class="close-popup">&times;</button>
          <div class="popup-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="popup-details">
            <h2>${product.name}</h2>
            <p class="popup-description">${product.description}</p>
            <a href="${product.buyLink}" class="buy-now-button" target="_blank">Buy Now</a>
          </div>
        </div>
      `;
      
      // Show overlay and popup
      modalOverlay.classList.add('active');
      productPopup.style.display = 'block';
      
      // Add close functionality
      productPopup.querySelector('.close-popup').addEventListener('click', closeProductPopup);
    }
    
    // Function to close the popup
    function closeProductPopup() {
      modalOverlay.classList.remove('active');
      productPopup.style.display = 'none';
    }
    
    // Add click event listeners to all product containers
    productContainers.forEach(container => {
      // Mark containers for event delegation
      container.classList.add('product-container');
      
      container.addEventListener('click', function(e) {
        // Prevent triggering click on wishlist heart icon
        if (e.target.closest('.wishlist-heart')) {
          return;
        }
        
        // Get product ID from container class name
        const containerClass = container.className.match(/container-(\d+)/);
        if (!containerClass) return;
        
        const containerNumber = parseInt(containerClass[1]);
        const productId = containerNumber - 2; // Container numbers start at 3 for product ID 1
        
        // Get product data
        const product = extendedProducts.find(p => p.id === productId);
        if (!product) {
          console.error('Product not found for ID:', productId);
          return;
        }
        
        openProductPopup(product);
      });
    });
    
    // Close popup when clicking on overlay
    modalOverlay.addEventListener('click', closeProductPopup);
    
    // Close popup when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && productPopup.style.display === 'block') {
        closeProductPopup();
      }
    });
    
    // Remove the click event on document that was previously used to close the popup
    // and instead use a more targeted approach
    document.removeEventListener('click', function(e) {
      if (productPopup && !productPopup.contains(e.target) && e.target.closest('.product-container') === null) {
        productPopup.style.display = 'none';
      }
    });
    
    // CATEGORY FUNCTIONALITY
    // Add category filtering functionality
    const categoryLinks = document.querySelectorAll('.category-link');
    const featuredHeading = document.querySelector('.text-wrapper-8');
    const productGrid = document.querySelector('.container-2');
    
    if (categoryLinks && featuredHeading) {
        // Category mapping for proper display names
        const categoryDisplayNames = {
            't-shirts': 'T-Shirts',
            'jeans': 'Jeans',
            'dresses': 'Dresses',
            'swimwear': 'Swimwear',
            'shoes': 'Shoes',
            'blazers': 'Blazers',
            'hoodies': 'Hoodies & Jackets',
            'accessories': 'Accessories'
        };
        
        // Add click event listeners to category links
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the category from the href attribute
                const href = this.getAttribute('href');
                const category = href.substring(1); // Remove the # from the href
                
                // Update the heading
                featuredHeading.textContent = categoryDisplayNames[category] || category;
                
                // Filter products by category
                filterProductsByCategory(category);
            });
        });
    }
    
    // Function to filter and reposition products by category
    function filterProductsByCategory(category) {
        // Hide all product containers first
        const allContainers = document.querySelectorAll('.container-3, .container-4, .container-5, .container-6, .container-7, .container-8, .container-9, .container-10, .container-11, .container-12, .container-13, .container-14, .container-15, .container-16, .container-17, .container-18');
        allContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Get products matching the category
        const filteredProducts = extendedProducts.filter(product => 
            product.category === category
        );
        
        // If no products in this category, show a message and return
        if (filteredProducts.length === 0) {
            featuredHeading.textContent = 'No products found in ' + (categoryDisplayNames[category] || category);
            return;
        }
        
        // Define the base positions for the first row
        const baseTop = 210; // Starting Y position
        const baseLeft = 132; // Starting X position
        const xOffset = 300; // Horizontal spacing between products
        const yOffset = 452; // Vertical spacing between rows
        
        // Position the filtered products in a grid (4 per row)
        filteredProducts.forEach((product, index) => {
            // Calculate row and column position
            const row = Math.floor(index / 4);
            const col = index % 4;
            
            // Calculate top and left positions
            const topPosition = baseTop + (row * yOffset);
            const leftPosition = baseLeft + (col * xOffset);
            
            // Find the corresponding container
            const containerNumber = product.id + 2; // Container numbers start at 3 for product ID 1
            const container = document.querySelector(`.container-${containerNumber}`);
            
            if (container) {
                // Update container position and make visible
                container.style.top = `${topPosition}px`;
                container.style.left = `${leftPosition}px`;
                container.style.display = 'block';
            }
        });
    }
    
    // Add a "Show All" button to the categories
    const categoriesContainer = document.querySelector('.categories-container');
    if (categoriesContainer) {
        const showAllLink = document.createElement('a');
        showAllLink.href = "#all";
        showAllLink.className = 'category-link';
        showAllLink.textContent = 'Show All';
        categoriesContainer.insertBefore(showAllLink, categoriesContainer.firstChild);
        
        // Add click event listener for Show All
        showAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset the heading
            if (featuredHeading) {
                featuredHeading.textContent = 'Featured Clothing Items';
            }
            
            // Show all containers and restore their original positions
            resetProductDisplay();
        });
    }
    
    // Function to reset product display to original state
    function resetProductDisplay() {
        // Original positions for each container
        const originalPositions = {
            3: { top: 210, left: 132 },
            4: { top: 210, left: 432 },
            5: { top: 210, left: 732 },
            6: { top: 210, left: 1032 },
            7: { top: 626, left: 1032 },
            8: { top: 626, left: 132 },
            9: { top: 626, left: 732 },
            10: { top: 626, left: 432 },
            11: { top: 1034, left: 132 },
            12: { top: 1034, left: 432 },
            13: { top: 1034, left: 732 },
            14: { top: 1034, left: 1032 },
            15: { top: 1442, left: 132 },
            16: { top: 1442, left: 432 },
            17: { top: 1442, left: 732 },
            18: { top: 1442, left: 1032 }
        };
        
        // Restore all containers to their original positions
        for (let containerNum = 3; containerNum <= 18; containerNum++) {
            const container = document.querySelector(`.container-${containerNum}`);
            if (container && originalPositions[containerNum]) {
                container.style.top = `${originalPositions[containerNum].top}px`;
                container.style.left = `${originalPositions[containerNum].left}px`;
                container.style.display = 'block';
            }
        }
    }
});