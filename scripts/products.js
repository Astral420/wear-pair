document.addEventListener('DOMContentLoaded', function() {
    console.log('products.js loaded and running');

    

    // Check URL hash for category filtering from index.html links
    function checkUrlForCategoryFilter() {
        if (window.location.hash) {
            const category = window.location.hash.substring(1); // Remove the # from the hash
            console.log('Category filter detected in URL:', category);
            
            // Update the category heading
            const featuredHeading = document.querySelector('.text-wrapper-8');
            if (featuredHeading) {
                const categoryDisplayNames = {
                    't-shirts': 'T-Shirts',
                    'jeans': 'Jeans',
                    'dresses': 'Dresses',
                    'swimwear': 'Swimwear',
                    'shoes': 'Shoes',
                    'blazers': 'Blazers',
                    'hoodies': 'Hoodies & Jackets',
                    'accessories': 'Accessories',
                    'all': 'All Products'
                };
                
                featuredHeading.textContent = categoryDisplayNames[category] || category;
            }
            
            // Apply the category filter
            if (category === 'all') {
                resetProductDisplay();
            } else {
                // Wait a short moment for all products to be initialized
                setTimeout(() => {
                    filterProductsByCategory(category);
                }, 200);
            }
        }
    }
    
    // Pagination variables
    const ITEMS_PER_PAGE = 16;
    let currentPage = 1;
    let totalPages = 2; // Start with at least 2 pages
    
    // Check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('Login state in products.js:', isLoggedIn, 'localStorage value:', localStorage.getItem('isLoggedIn'));
    
    // Get current user info if logged in
    let currentUser = null;
    if (isLoggedIn) {
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        currentUser = JSON.parse(currentUserData);
      }
    }
    
    // Get DOM elements for later use 
    const searchInput = document.querySelector('.search-input');
    const searchResultsDropdown = document.querySelector('.search-results-dropdown');
    
    // Close dropdown when clicking elsewhere on the document
    document.addEventListener('click', function(e) {
      // Close search results dropdown if clicking outside
      if (searchInput && searchResultsDropdown && 
          !searchInput.contains(e.target) && 
          !searchResultsDropdown.contains(e.target)) {
        searchResultsDropdown.style.display = 'none';
      }
      
      // Close product popup if clicking outside
      if (window.productPopup && !window.productPopup.contains(e.target) && e.target.closest('.product-container') === null) {
        window.productPopup.style.display = 'none';
      }
    });
    
    // SEARCH FUNCTIONALITY
    console.log("Setting up search functionality");
    const searchForm = document.querySelector('.search-form');
    
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
        buyLink: "https://ph.shein.com/ph/Men's-Casual-Washed-Funny-Plain-Dark-Denim-Jacket,-Spring-&-Fall,-For-Party-p-38400397.html?ref=m&rep=dir&ret=mph&ref=www&rep=dir&ret=ph",
        rating: 4.7,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 2, 
        name: 'Knitted Sweater', 
        price: '39.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-1.png',
        description: 'Soft and cozy knitted sweater perfect for colder weather. Features a comfortable fit and stylish design.',
        buyLink: "https://ph.shein.com/eur/Manfinity-Hypemode-Men-1Pc-Cartoon-Pattern-Colorblock-Drop-Shoulder-Baggy-Sweater-Crew-Neck-Long-Sleeve-Colorful-Dinosaur-Pattern-Going-Out-Fashion-Sweater-For-Friends-p-23864215.html?ad_type=DPA&currency=EUR&goods_id=42631793&isFromSwitchColor=1&lang=en&main_attr=27_78&mallCode=1&onelink=0%2Fgooglefeed_eur&pf=google&requestId=olw-4nkh3bk1beos&scene=1&skucode=I52h5drktxal&test=5051&ref=www&rep=dir&ret=ph",
        rating: 4.5,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 3, 
        name: 'Slim-Fit Jeans', 
        price: '49.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-2.png',
        description: 'Modern slim-fit jeans with stretchy fabric for maximum comfort. Stylish and versatile for any occasion.',
        buyLink: "https://ph.shein.com/Women-s-Slim-Fit-Denim-Pants-With-Pockets-Suitable-For-Daily-Outings-p-34406940.html?ref=www&rep=dir&ret=ph",
        rating: 4.6,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 4, 
        name: 'White T-Shirt', 
        price: '19.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-3.png',
        description: 'Classic solid round neck t-shirt made with premium cotton. Basic essential for every wardrobe.',
        buyLink: 'https://sphere-vista.com/products/solid-round-neck-t-shirt?variant=51828221280621',
        rating: 4.8,
        store_name: 'SPHERE VISTA',
        store_link: 'https://sphere-vista.com/'
      },
      { 
        id: 5, 
        name: 'Sleeveless Sport Swimsuit', 
        price: '59.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-4.png',
        description: 'Athletic swimsuit designed for performance and comfort. Features quick-drying and chlorine-resistant fabric.',
        buyLink: "https://ph.shein.com/DAZY-Contrast-Binding-Halter-Bikini-Swimsuit-p-17444181-cat-1866.html?lang=asia&ref=www&rep=dir&ret=ph",
        rating: 4.4,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 6, 
        name: 'Leather Boots', 
        price: '89.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-5.png',
        description: 'Premium leather boots with durable soles. Perfect for both style and functionality in any weather.',
        buyLink: 'https://www.uggoutlet.com.au/products/chunky-boots-lace-up-women-stephanie?variant=43633288282327',
        rating: 4.9,
        store_name: 'UGG OUTLET',
        store_link: 'https://www.uggoutlet.com.au/'
      },
      { 
        id: 7, 
        name: 'Adjustable Shoulder Bag', 
        price: '79.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-6.png',
        description: 'Versatile shoulder bag with adjustable straps and multiple compartments for everyday essentials.',
        buyLink: "https://ph.shein.com/ph/1pc-Adjustable-Strap-Flap-Closure-Plain-Color-Shoulder-Bag,-Casual-Retro-Business-Commuting-Waterproof-PU-Mini-Messenger-Crossbody-Bag-Christmas-Men-Bag-Vacation-Dad-Gifts-Retro-Bag-Vintage-Messenger-Bag-Tote-Bag-Side-Bags-Gifts-Valentine-Day-Black-Bag-Camping-Sling-Bag-Stickers-Winter-Back-To-School-Valentines-Gifts-Valentine-Gifts-Vintage-Gift-Bag-Pack-Cross-Body-Bag-Spring-Vintage-Bags-School-Supplies-Mini-Bag-Small-Bag-Purse-College-Bags-New-Life-Items-For-Students-Men-Essentials-Fashion-Men's-Bags-Graduation-p-37807827.html?ref=m&rep=dir&ret=mph&ref=www&rep=dir&ret=ph",
        rating: 4.7,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 8, 
        name: 'Men\'s Fashionable T-Shirt', 
        price: '80.99', 
        image: 'https://c.animaapp.com/maskue7rUMC7Hc/img/image-15.png',
        description: 'Trendy men\'s t-shirt with modern design. Made with high-quality fabric for comfort and durability.',
        buyLink: 'https://snobasia.com/collections/t-shirts/products/yukariyo-t-shirt',
        rating: 4.6,
        store_name: 'SNOB ASIA',
        store_link: 'https://snobasia.com/'
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
        buyLink: "https://ph.shein.com/Men-s-Necklace-And-Unique-Design-Hip-Hop-Style-Chain-Jewelry-Sweater-Chain-Halloween-p-34255889.html?src_identifier=fc%3DNew%20In%60sc%3DJewelry%20%26%20Accessories%60tc%3DShop%20by%20Category%60oc%3DMen%20Fashion%20Accessories%60ps%3Dtab01navbar09menu01dir12%60jc%3Dreal_2027&src_module=topcat&src_tab_page_id=page_goods_detail1747587001983&mallCode=1&pageListType=4&imgRatio=1-1&pageListType=4",
        category: 'accessories',
        rating: 4.5,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 10, 
        name: 'Men Star & Lightning Decor Ring Set', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/images3_pi/2022/11/01/1667282605139b18061a747fa75d434c82cd8f73a0_thumbnail_900x.webp',
        description: 'Stylish ring set featuring star and lightning designs. Made with quality materials for everyday wear.',
        buyLink: "https://ph.shein.com/5pcs-Men-Star-Lightning-Decor-Ring-p-12015672.html?src_identifier=fc%3DAll%60sc%3DJewelry%20%26%20Accessories%60tc%3DShop%20by%20Category%60oc%3DWomen%27s%20Rings%20%26%20Bracelets%60ps%3Dtab00navbar09menu01dir09%60jc%3DitemPicking_001312477&src_module=topcat&src_tab_page_id=page_real_class1747587236885&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
        category: 'accessories',
        rating: 4.4,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 11, 
        name: 'YOUNGLA The Boys Hoodie', 
        price: '80.99', 
        image: 'https://www.youngla.com/cdn/shop/files/UntitledSession13694.jpg?v=1744134834&width=1255',
        description: 'Comfortable and trendy hoodie with modern design. Perfect for casual outings and everyday wear.',
        buyLink: 'https://www.youngla.com/products/5076?hcUrl=%2Fen-US',
        category: 'hoodies',
        rating: 4.8,
        store_name: 'YOUNGLA',
        store_link: 'https://www.youngla.com/'
      },
      { 
        id: 12, 
        name: 'Off-shoulder Graphic Tee', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/images3_pi/2024/12/18/bf/1734505217ffdce50c66aa658c2232a269b3744ba8_thumbnail_900x.webp',
        description: 'Stylish off-shoulder t-shirt with graphic print. Comfortable fabric and trendy design for casual wear.',
        buyLink: "https://ph.shein.com/us/goods-p-45942661.html?onelink=0/googlefeed_us&requestId=olw-4gobnxhczgv4&goods_id=45942661&lang=es&currency=USD&skucode=I53vecrg2b24&scene=1&test=5051&ad_type=DPA&pf=google&ref=www&rep=dir&ret=ph",
        category: 't-shirts',
        rating: 4.6,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 13, 
        name: 'Sleeveless Dress', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/v4/j/spmp/2025/03/26/f4/174299283770ff3f1bc9d8bc7db84ca8e6763d989d_wk_1745220650_thumbnail_900x.webp',
        description: 'Elegant sleeveless dress perfect for summer. Features a flattering silhouette and comfortable fabric.',
        buyLink: "https://ph.shein.com/Women-Sleeveless-High-Neck-Skinny-Sexy-Long-Dress-Bodycon-Sexy-Party-Dress-Evening-p-67030400.html?src_identifier=fc%3DAll%60sc%3DNew%20In%60tc%3DNew%20in%20Women%27s%20Clothing%60oc%3DDresses%60ps%3Dtab00navbar01menu01dir02%60jc%3DitemPicking_00205078&src_module=topcat&src_tab_page_id=page_home1747589250089&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
        category: 'dresses',
        rating: 4.7,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 14, 
        name: 'New Balances 530', 
        price: '80.99', 
        image: 'https://nb.scene7.com/is/image/NB/mr530ck_nb_05_i?$pdpflexf2$&wid=440&hei=440',
        description: 'Iconic New Balance 530 sneakers combining style and comfort. Perfect for everyday wear and athletic activities.',
        buyLink: 'https://www.newbalance.com/pd/530/MR530-32265-PMG-NA.html',
        category: 'shoes',
        rating: 4.8,
        store_name: 'NEW BALANCE',
        store_link: 'https://www.newbalance.com/'
      },
      { 
        id: 15, 
        name: 'Manfinity Loose Fit Blazer', 
        price: '80.99', 
        image: 'https://img.ltwebstatic.com/images3_pi/2025/02/12/4f/1739326527025da56ff20ec19fdbd7bbe10d65314a_thumbnail_900x.webp',
        description: 'Stylish loose-fit blazer for modern men. Versatile piece that can be dressed up or down for various occasions.',
        buyLink: "https://ph.shein.com/Manfinity-RebelGame-Plus-Size-Men-s-Loose-Fit-Black-Woven-Long-Sleeve-Blazer-Jacket-p-56151083.html?src_identifier=st%3D2%60sc%3Dblazers%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_goods_detail1747589271156&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
        category: 'blazers',
        rating: 4.5,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      { 
        id: 16, 
        name: 'Bomber Jacket', 
        price: '80.99', 
        image: 'https://c.animaapp.com/FpgE2lUx/img/image@2x.png',
        description: 'Classic bomber jacket with modern design. Features comfortable fit and durable materials for everyday wear.',
        buyLink: "https://us.shein.com/Autumn-Colorblock-Faux-Leather-Casual-Loose-Fit-Jacket-For-Men-p-44366683.html",
        category: 'hoodies',
        rating: 4.7,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      // New product to demonstrate replacement of a placeholder
      { 
        id: 17, 
        name: 'Summer Straw Hat', 
        price: '29.99', 
        image: 'https://img.ltwebstatic.com/images3_spmp/2024/06/10/64/1717994598ca89fa6a234f30b9de88e6e2ad731e04_thumbnail_900x.webp',
        description: 'Stylish wide-brim straw hat, perfect for beach days and summer outings. Provides great sun protection with a fashionable design.',
        buyLink: "https://us.shein.com/Women-Straw-Bucket-Hat-With-Contrasting-Braided-Band-p-14998553.html",
        category: 'accessories',
        rating: 4.9,
        store_name: 'SHEIN',
        store_link: 'https://ph.shein.com/'
      },
      {
        id: 18,
        name: "Premium Linen Shirt",
        price: "45.99",
        image: "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/455957/item/usgoods_30_455957_3x4.jpg?width=400",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
        buyLink: "https://www.uniqlo.com/us/en/products/E455957-000/00?colorDisplayCode=30&sizeDisplayCode=004",
        category: "t-shirts",
        rating: 4.5,
        store_name: "UNIQLO",
        store_link: 'https://www.uniqlo.com/'
      },
      
        {
          id: 19,
          name: "Bari Casual Canvas Sneakers",
          price: "39.99",
          image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/389383/06/sv01/fnd/PHL/fmt/png/Bari-Casual-Canvas-Sneakers",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.puma.com/ph/en/pd/bari-casual-canvas-sneakers/389383.html",
          category: "shoes",
          rating: 4.5,
          store_name: "PUMA",
          store_link: "https://ph.puma.com/"
        },
        {
          id: 20,
          name: "Black Floral Summer Dress",
          price: "54.99",
          image: "https://petalandpup.com/cdn/shop/files/LewisMiniDress-BlackFloral-2638.jpg?v=1746158494&width=600",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://petalandpup.com/products/lewis-mini-dress-black-floral?variant=45060878860465",
          category: "dresses",
          rating: 4.5,
          store_name: "PETAL & PUP",
          store_link: "https://petalandpup.com/"
        },
        {
          id: 21,
          name: "Striped Cotton Polo",
          price: "54.99",
          image: "https://image.uniqlo.com/UQ/ST3/us/imagesgoods/475765/item/usgoods_02_475765_3x4.jpg?width=400",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.uniqlo.com/us/en/products/E475765-000/00?colorDisplayCode=02&sizeDisplayCode=003",
          category: "t-shirts",
          rating: 4.5,
          store_name: "UNIQLO",
          store_link: "https://www.uniqlo.com/"
        },
        {
          id: 22,
          name: "Lightweight Cardigan",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_spmp/2024/08/26/b4/172464550816216b2ac5c3d1cdedd560d79fb8a937_wk_1724747680_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/Spring-Autumn-Women-Knit-Cardigan-Long-Sleeve-Tops-p-41509658.html?src_identifier=st%3D2%60sc%3Dlightweight%20cardigan%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_goods_detail1747841412115&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "t-shirts",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 23,
          name: "Slim Chino Pants",
          price: "54.99",
          image: "https://oldnavy.com.ph/cdn/shop/products/096_408052_BOURBON-1_2000x.jpg?v=1666780155 2000w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://oldnavy.com.ph/products/slim-taper-built-in-flex-ogc-chino-pants-for-men-408052?variant=42268164718769",
          category: "jeans",
          rating: 4.5,
          store_name: "OLD NAVY",
          store_link: "https://oldnavy.com.ph/"
        },
        {
          id: 24,
          name: "Vintage Leather Watch",
          price: "54.99",
          image: "https://fossil.scene7.com/is/image/FossilPartners/FS5304_onwrist?$sfcc_onmodel_large$",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.fossil.com/en-us/products/the-minimalist-slim-three-hand-light-brown-leather-watch/FS5304.html",
          category: "accessories",
          rating: 4.5,
          store_name: "FOSSIL",
          store_link: "https://www.fossil.com/"
        },
        {
          id: 25,
          name: "Polarized Sunglasses",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_spmp/2024/11/07/02/17309651551f39e1806338dadf26acc5125c526812_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/POLASUP-1pc-Polarized-Half-Frame-Full-Wrap-Cycling-Fishing-Fashion-Glasses-Dual-Color-Silicone-Non-Slip-Y-Shaped-Lightning-Temples-Design-Breathable-Casual-Street-Bohemian-Party-Punk-Oval-Flat-Top-Classic-Frame-Unisex-Driving-Fashion-Glasses-Suitable-For-Summer-All-Seasons-Holiday-Commuting-For-Summer-Beach-Vacation-Outdoor-Travel-p-41891174.html?src_identifier=st%3D8%60sc%3Dsunglases%60sr%3DSunglasses%20Men%60ps%3D2&src_module=search&src_tab_page_id=page_goods_group1748341760502&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "accessories",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 26,
          name: "Patterned Scarf",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_spmp/2025/02/24/00/17403623262562bf0eddf539e87a06837f2e7a484c_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/1pc-Imitation-Silk-Paisley-Print-70cm-Small-Square-Scarf-New-Spring-Summer-Bandana-Neckerchief-For-Women-Versatile-Waistband-Head-Wrap-Fashion-Accessory-Decoration-p-58760847.html?src_identifier=st%3D2%60sc%3Dpatterned%20scarf%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_goods_detail1748342041207&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "accessories",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 27,
          name: "Silver Waist Belt Lace",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_spmp/2024/04/12/c3/1712928126ad7a4f4b3dbae263fe87a36451daa61a_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/Street-1pc-Punk-Style-Hollow-Out-Star-Decor-Pants-Chain-Women-s-Multi-Layer-Hip-Hop-Fashionable-Waist-Belt-Accessory-Halloween-p-30677397.html?mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "accessories",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 28,
          name: "YOUNGLA Tree Camo Jeans ",
          price: "54.99",
          image: "https://www.youngla.com/cdn/shop/files/2059_dark_tree_camo_002_11_26_rudy_ecomm_c160d12a-8e3f-4707-9a7c-6a462ef7521e.jpg?v=1731451424&width=2400",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.youngla.com/products/2059?hcUrl=%2Fen-US",
          category: "jeans",
          rating: 4.5,
          store_name: "YOUNGLA",
          store_link: "https://www.youngla.com/"
        },
        {
          id: 29,
          name: "Brown Formal Blazer",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_pi/2024/10/14/99/1728868931407c3634fae039877a61e02cadb58ff6_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/DAZY-Men-Solid-Color-Notch-Collar-Single-Breasted-Casual-Blazer-Jacket-Autumn-p-44755202.html?src_identifier=st%3D2%60sc%3Dblazers%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_goods_detail1748342136811&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: 'blazers',
          rating: 4.5,
          store_name: 'SHEIN',
          store_link: 'https://ph.shein.com/'
        },
        {
          id: 30,
          name: "Mens Swimwear Set",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_pi/2025/03/28/52/17431490555c4bbd4c1d6f75916f2dd265821cc6d4_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/Manfinity-Swimmode-Men-s-Simple-And-Fashionable-Beach-Outfit-Short-Sleeve-Shirt-And-Shorts-Suitable-For-Summer-Man-Swim-Trunks-p-59293170.html?src_identifier=st%3D4%60sc%3DSwimwear%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_goods_detail1748345986206&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "swimwear",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 31,
          name: "Gymshark Tank Top",
          price: "54.99",
          image: "https://cdn.shopify.com/s/files/1/0156/6146/files/LegacyDropArmTankGSStoneGreyA5A2Z-GB7S-1606-0171_818e2dd5-068d-457e-aaad-100e37ac42a2_3840x.jpg?v=1742894722 3840w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.gymshark.com/products/gymshark-legacy-drop-arm-tank-stone-grey-ss25",
          category: "t-shirts",
          rating: 4.5,
          store_name: "GYMSHARK",
          store_link: "https://www.gymshark.com/"
        },
        {
          id: 32,
          name: 'MN+LA "Im Lovin It" Tee',
          price: "54.99",
          image: "https://mn-la.com/cdn/shop/files/8_114bc852-b56a-4651-984e-81bbd6e55ed6.jpg?v=1685284310&width=1946 1946w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://mn-la.com/products/im-lovin-it-tee-in-white",
          category: "t-shirts",
          rating: 4.5,
          store_name: "MN+LA",
          store_link: "https://mn-la.com/"
        },
        {
          id: 33,
          name: "Diamond Rhombus Earrings",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_spmp/2023/10/21/56/1697875889051a00da7994797e08ee8e63b3a830a4_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/1pair-Diamond-Rhombus-Cross-Ear-Studs-Unique-European-And-American-High-End-Design-For-Men-And-Women-p-25894981.html?src_identifier=st%3D2%60sc%3Dearings%60sr%3D0%60ps%3D1&src_module=topcat&src_tab_page_id=page_home1748347431154&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "accessories",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 34,
          name: "Loose Fit Sweatshirt",
          price: "54.99",
          image: "https://img.ltwebstatic.com/v4/j/pi/2025/05/14/9c/174718790879f4f622b9dbe4e731b2852592c27f71_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "ph.shein.com/AXEPEAK-Men-s-Loose-Fit-Knitted-Long-Sleeve-Pullover-Sweatshirt-p-49900215.html?src_identifier=st%3D4%60sc%3DSweatshirt%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_search1748345980400&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "t-shirts",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 35,
          name: "Embroidered Jacquard Shirt",
          price: "54.99",
          image: "https://static.zara.net/assets/public/b2b7/e332/d2614879bbeb/ff97ea81b5b2/07036201406-p/07036201406-p.jpg?ts=1742384348625&w=651",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.zara.com/ph/en/embroidered-jacquard-shirt-p07036201.html?v1=430895598&v2=2436948",
          category: "t-shirts",
          rating: 4.5,
          store_name: "ZARA",
          store_link: "https://zara.com/"
        },
        {
          id: 36,
          name: "Basic Hoodie",
          price: "54.99",
          image: "https://static.zara.net/assets/public/4b3d/8d58/2d654031a22c/fa161eda6a62/00761330800-p/00761330800-p.jpg?ts=1744102031666&w=651",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.zara.com/ph/en/basic-hoodie-p00761330.html?v1=410594457&v2=2432232",
          category: "hoodies",
          rating: 4.5,
          store_name: "ZARA",
          store_link: "https://petalandpup.com/"
        },
        {
          id: 37,
          name: "Drawstring Casual Shorts",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_pi/2024/12/14/d2/17341595318535136d9f2ea60c1cdf7096a92122ff_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/Manfinity-Nomadique-Men-s-Drawstring-Waist-Pockets-Loose-Casual-Shorts-Men-Clothes-Men-Shorts-p-50501215.html?src_identifier=st%3D4%60sc%3DShorts%60sr%3D0%60ps%3D1&src_module=search&src_tab_page_id=page_search1748352695911&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "jeans",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 38,
          name: "Festival Skirt",
          price: "54.99",
          image: "https://www.youngla.com/cdn/shop/files/YLA_250224_0249.jpg?v=1742219591&width=1000 1000w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.youngla.com/products/w171",
          category: "jeans",
          rating: 4.5,
          store_name: "YOUNGLA",
          store_link: "https://youngla.com/"
        },
        {
          id: 39,
          name: "A-Frame Trucker Hat",
          price: "54.99",
          image: "https://www.youngla.com/cdn/shop/files/9046_navy_002_11_26_floor.jpg?v=1726614430&width=2400 2400w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.youngla.com/products/9046?hcUrl=%2Fen-US",
          category: "accessories",
          rating: 4.5,
          store_name: "YOUNGLA",
          store_link: "https://youngla.com/"
        },
        {
          id: 40,
          name: "Textured V-Neck Sleeveless Dress",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_pi/2024/08/29/52/1724938838750c8d46bb89e789e5a9292488473ff1_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/EMERY-ROSE-Khaki-Textured-V-Neck-Sleeveless-Split-Hem-Women-Dress-p-41748863.html?src_identifier=st%3D5%60sc%3DMaxi%20Dress%60sr%3D0%60ps%3D2&src_module=search&src_tab_page_id=page_goods_detail1748359734663&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "dresses",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 41,
          name: "Floral Print Summer Dress",
          price: "54.99",
          image: "https://img.ltwebstatic.com/images3_pi/2023/07/04/16884390399c5acc3b69b7c79f269102c20070bf6b_thumbnail_900x.webp",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://ph.shein.com/DAZY-Ditsy-Floral-Print-Ruched-Front-Ruffle-Hem-Dress-Sundress-p-18814792.html?src_identifier=st%3D4%60sc%3DMidi%20Dress%20For%20Women%60sr%3D0%60ps%3D2&src_module=search&src_tab_page_id=page_search1748360984491&mallCode=1&pageListType=4&imgRatio=3-4&pageListType=4",
          category: "dresses",
          rating: 4.5,
          store_name: "SHEIN",
          store_link: "https://ph.shein.com/"
        },
        {
          id: 42,
          name: "Cargo Trousers",
          price: "54.99",
          image: "https://static.zara.net/assets/public/f54e/c7ab/49a24ea1aa7f/75e46356b782/00108302805-a1/00108302805-a1.jpg?ts=1722445706941&w=326",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.zara.com/ph/en/cargo-trousers-p00108302.html?v1=410575277&v2=2432096",
          category: "jeans",
          rating: 4.5,
          store_name: "ZARA",
          store_link: "https://zara.com/"
        },
        {
          id: 43,
          name: "Ripped Flared Jeans",
          price: "54.99",
          image: "https://static.zara.net/assets/public/4120/5a65/cec7405eb851/aa7fc3e4b0b3/00840359427-p/00840359427-p.jpg?ts=1747840194274&w=326",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.zara.com/ph/en/ripped-flared-fit-jeans-p00840359.html?v1=451321399&v2=2432131",
          category: "jeans",
          rating: 4.5,
          store_name: "ZARA",
          store_link: "https://zara.com/"
        },
        {
          id: 44,
          name: "Training Fleece Joggers",
          price: "54.99",
          image: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-TrainingFleeceJoggerGSClassicGreenB7A4D_EC20_1151_0153_3840x.jpg?v=1746463943 3840w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.gymshark.com/products/gymshark-training-fleece-jogger-pants-green-ss25",
          category: "jeans",
          rating: 4.5,
          store_name: "GYMSHARK",
          store_link: "https://gymshark.com/"
        },
        {
          id: 45,
          name: "Compression Shirt",
          price: "54.99",
          image: "https://cdn.shopify.com/s/files/1/0156/6146/files/images-ElementBaselayerT_ShirtGSWhiteA2B4C_WB57_0066_3840x.jpg?v=1747310903 3840w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.gymshark.com/products/gymshark-element-baselayer-t-shirt-white-ss25",
          category: "t-shirts",
          rating: 4.5,
          store_name: "GYMSHARK",
          store_link: "https://gymshark.com/"
        },
        {
          id: 46,
          name: "Track Jacket",
          price: "54.99",
          image: "https://cdn.shopify.com/s/files/1/0156/6146/files/RetroCrinkleNylonTrackJacketGSBlackA2C1C-BB2J-0797_3840x.jpg?v=1743097059 3840w",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.gymshark.com/products/gymshark-retro-crinkle-track-jacket-black-ss25",
          category: "hoodies",
          rating: 4.5,
          store_name: "GYMSHARK",
          store_link: "https://gymshark.com/"
        },
        {
          id: 47,
          name: "Windproof Shell Parka",
          price: "54.99",
          image: "https://image.uniqlo.com/GU/ST3/us/imagesgoods/351278/item/usgoods_02_351278_3x4.jpg?width=600",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.gu-global.com/us/en/products/E351278-000/00?colorDisplayCode=02&sizeDisplayCode=004",
          category: "hoodies",
          rating: 4.5,
          store_name: "GU Global",
          store_link: "https://gu-global.com/"
        },
        {
          id: 48,
          name: "Flared Maxi Skirt",
          price: "54.99",
          image: "https://image.uniqlo.com/GU/ST3/us/imagesgoods/356944/item/usgoods_63_356944_3x4.jpg?width=600",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashionable and functional.",
          buyLink: "https://www.gu-global.com/us/en/products/E356944-000/00?colorDisplayCode=63&sizeDisplayCode=004",
          category: "jeans",
          rating: 4.5,
          store_name: "GU Global",
          store_link: "https://gu-global.com/"
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
    
    // Function to generate placeholder products
    function generatePlaceholderProducts(startId, count) {
      const placeholderProducts = [];
      const categories = ['t-shirts', 'jeans', 'dresses', 'swimwear', 'shoes', 'blazers', 'hoodies', 'accessories'];
      const stores = [
        { name: 'SHEIN', link: 'https://ph.shein.com/' },
        { name: 'ZARA', link: 'https://www.zara.com/' },
        { name: 'H&M', link: 'https://www2.hm.com/' },
        { name: 'UNIQLO', link: 'https://www.uniqlo.com/' }
      ];

      for (let i = 0; i < count; i++) {
        const id = startId + i;
        const category = categories[Math.floor(Math.random() * categories.length)];
        const store = stores[Math.floor(Math.random() * stores.length)];
        const rating = (4 + Math.random()).toFixed(1);

        placeholderProducts.push({
          id: id,
          
          name: `Product ${id}`,
          price: ((30 + Math.random() * 70).toFixed(2)),
          image: `https://via.placeholder.com/276x276?text=Product+${id}`,
          description: `This is a placeholder product ${id}. A stylish and comfortable item perfect for everyday wear.`,
          buyLink: store.link,
          category: category,
          rating: parseFloat(rating),
          store_name: store.name,
          store_link: store.link
        });
      }
      return placeholderProducts;
    }
    
    // Manage products with placeholders
    const MIN_TOTAL_PRODUCTS = 48; // Minimum number of products (extendedProducts + placeholders)
    
    // Calculate how many placeholder products we need
    // As you add more real products to extendedProducts, fewer placeholders will be needed
    // When extendedProducts.length reaches MIN_TOTAL_PRODUCTS, no placeholders will be generated
    const numPlaceholdersNeeded = Math.max(0, MIN_TOTAL_PRODUCTS - extendedProducts.length);
    console.log(`Using ${extendedProducts.length} real products and ${numPlaceholdersNeeded} placeholder products`);
    
    // Generate placeholder products only if needed
    const additionalProducts = generatePlaceholderProducts(extendedProducts.length + 1, numPlaceholdersNeeded);
    const allProducts = [...extendedProducts, ...additionalProducts];
    totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
    
    // To add new real products in the future:
    // 1. Add them to the extendedProducts array
    // 2. The system will automatically reduce the number of placeholder products shown
    
    // Function to update product display based on current page
    function updateProductDisplay(page) {
      console.log(`Updating product display for page ${page}`);
      
      // Get the products for the current page
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, allProducts.length);
      const currentPageProducts = allProducts.slice(startIndex, endIndex);
      
      console.log(`Displaying products ${startIndex + 1} to ${endIndex} of ${allProducts.length}`);
      
      // Find the container
      const productGrid = document.querySelector('.container-2');
      if (!productGrid) {
        console.error('Product grid container not found');
        return;
      }
      
      // Remove existing product containers
      const existingContainers = document.querySelectorAll('[class*="container-"][class*="product-container"]');
      existingContainers.forEach(container => {
        container.remove();
      });
      
      // Clear all existing product containers (alternative approach)
      document.querySelectorAll('.container-3, .container-4, .container-5, .container-6, .container-7, .container-8, .container-9, .container-10, .container-11, .container-12, .container-13, .container-14, .container-15, .container-16, .container-17, .container-18').forEach(container => {
        if (container) container.remove();
      });
      
      // Create and add new product containers
      currentPageProducts.forEach((product, index) => {
        const containerNumber = index + 3; // Container numbers start at 3
        const row = Math.floor(index / 4);
        const col = index % 4;
        
        const container = document.createElement('div');
        container.className = `container-${containerNumber} product-container`;
        container.style.top = `${210 + (row * 416)}px`;
        container.style.left = `${132 + (col * 300)}px`;
        
        container.innerHTML = `
          <div class="wishlist-heart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <img class="image-${containerNumber <= 6 ? '2' : '3'}" src="${product.image}" alt="${product.name}" />
          <div class="text-wrapper-${containerNumber <= 6 ? '5' : '7'}">${product.name}</div>
        `;
        
        productGrid.appendChild(container);
        
        // Set up event listeners for the new container
        setupProductContainerEventListeners(container, product);
      });
      
      // Update pagination buttons
      updatePaginationButtons();
      
      // Set up wishlist functionality for new containers
      setupWishlistFunctionality();
    }
    
    // Function to set up event listeners for product containers
    function setupProductContainerEventListeners(container, product) {
      container.addEventListener('click', function(e) {
        // Prevent triggering click on wishlist heart icon
        if (e.target.closest('.wishlist-heart')) {
          return;
        }
        
        openProductPopup(product);
      });
    }

    


   
    
    // Function to update pagination buttons state
    function updatePaginationButtons() {
      console.log("Updating pagination buttons, currentPage:", currentPage, "totalPages:", totalPages);
      
      // Update Next Page button
      const nextPageButton = document.querySelector('.next-page-wrapper');
      if (nextPageButton) {
        console.log("Next page button found in DOM");
        if (currentPage < totalPages) {
          nextPageButton.style.display = 'block';
          const nextPageText = nextPageButton.querySelector('.next-page');
          if (nextPageText) {
            nextPageText.textContent = `Next Page (${currentPage}/${totalPages})`;
          }
        } else {
          nextPageButton.style.display = 'none';
        }
      } else {
        console.error('Next Page button not found');
      }
      
      // Update Previous Page button
      const prevPageButton = document.querySelector('.prev-page-wrapper');
      if (prevPageButton) {
        console.log("Previous page button found in DOM");
        if (currentPage > 1) {
          prevPageButton.style.display = 'block';
          const prevPageText = prevPageButton.querySelector('.prev-page');
          if (prevPageText) {
            prevPageText.textContent = `Previous Page (${currentPage}/${totalPages})`;
          }
        } else {
          prevPageButton.style.display = 'none';
        }
      } else {
        console.log('Previous Page button not found, creating it now');
        // Previous Page button should already exist in HTML now
      }
    }
    
    // Initialize event listeners for pagination buttons
    function initPaginationButtons() {
      console.log("Initializing pagination buttons");
      
      // Next Page button
      const nextPageButton = document.querySelector('.next-page-wrapper');
      if (nextPageButton) {
        console.log("Setting up Next Page button functionality");
        
        // Clear any existing event listeners
        const newNextButton = nextPageButton.cloneNode(true);
        nextPageButton.parentNode.replaceChild(newNextButton, nextPageButton);
        
        // Add click event listener for NEXT page
        newNextButton.addEventListener('click', function() {
          console.log(`Next Page button clicked. Current page: ${currentPage}, Total pages: ${totalPages}`);
          if (currentPage < totalPages) {
            currentPage++;
            updateProductDisplay(currentPage);
            
            // Scroll to the product grid title
            scrollToProductSection();
          }
        });
      } else {
        console.error("Next Page button not found in DOM");
      }
      
      // Previous Page button
      const prevPageButton = document.querySelector('.prev-page-wrapper');
      if (prevPageButton) {
        console.log("Setting up Previous Page button functionality");
        
        // Clear any existing event listeners
        const newPrevButton = prevPageButton.cloneNode(true);
        prevPageButton.parentNode.replaceChild(newPrevButton, prevPageButton);
        
        // Add click event listener for PREVIOUS page
        newPrevButton.addEventListener('click', function() {
          console.log(`Previous Page button clicked. Current page: ${currentPage}, Total pages: ${totalPages}`);
          if (currentPage > 1) {
            currentPage--;
            updateProductDisplay(currentPage);
            
            // Scroll to the product grid title
            scrollToProductSection();
          }
        });
      } else {
        console.error("Previous Page button not found in DOM");
      }
    }
    
    // Helper function to scroll to the product section
    function scrollToProductSection() {
      const featuredHeading = document.querySelector('.text-wrapper-8');
      if (featuredHeading) {
        // Use window.scrollTo with a specific offset to avoid touching the header
        const headerHeight = 100; // Approximate header height
        const featuredHeadingRect = featuredHeading.getBoundingClientRect();
        const targetY = window.pageYOffset + featuredHeadingRect.top - headerHeight;
        
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    }
    
    // Function to set up wishlist functionality
    function setupWishlistFunctionality() {
      const wishlistHearts = document.querySelectorAll('.wishlist-heart');
      
      wishlistHearts.forEach(heart => {
        const productId = heart.getAttribute('data-product-id');
        
        // Set initial state based on current user's wishlist
        if (isInUserWishlist(productId)) {
          heart.classList.add('active');
        } else {
          heart.classList.remove('active');
        }
        
        // Remove any existing click listeners
        const oldHeart = heart.cloneNode(true);
        heart.parentNode.replaceChild(oldHeart, heart);
        
        // Add click listener
        oldHeart.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent container click
          
          const productId = this.getAttribute('data-product-id');
          const productName = this.getAttribute('data-product-name');
          const productPrice = this.getAttribute('data-product-price');
          
          // Check if user is logged in
          const userEmail = getCurrentUserEmail();
          if (!userEmail) {
            alert('Please log in to add items to your wishlist.');
            return;
          }
          
          // Toggle wishlist status
          if (isInUserWishlist(productId)) {
            // Remove from wishlist
            if (removeFromUserWishlist(productId)) {
              this.classList.remove('active');
              console.log(`Removed ${productName} from wishlist`);
            }
          } else {
            // Add to wishlist
            const newItem = {
              id: productId,
              name: productName,
              price: productPrice
            };
            
            if (addToUserWishlist(newItem)) {
              this.classList.add('active');
              console.log(`Added ${productName} to wishlist`);
            }
          }
        });
      });
    }
    
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
          </div>
        `;
        
        // Make the result item clickable
        resultItem.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent document click handler from firing
          openProductPopup(product);
          searchResultsDropdown.style.display = 'none';
          searchInput.value = product.name;
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
    
    
    
    // Set search input value from localStorage if available
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch && searchInput) {
      searchInput.value = lastSearch;
    }

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
    
    // PRODUCT POPUP FUNCTIONALITY
    // Create the popup element and modal overlay
    const productPopup = document.createElement('div');
    window.productPopup = productPopup; // Store in window object to access globally
    productPopup.className = 'product-popup';
    productPopup.style.display = 'none';
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    document.body.appendChild(modalOverlay);
    document.body.appendChild(productPopup);
    
    // Function to open the popup
     function openProductPopup(product) {

      console.log('productPopup element:', window.productPopup);
  
      if (!window.productPopup) {
        console.error('productPopup element not found!');
        return;
      }



      // Update popup content
      window.productPopup.innerHTML = `
        <div class="popup-content">
          <button class="close-popup">&times;</button>
          <div class="popup-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="popup-details">
            <h2>${product.name}</h2>
            <div class="popup-rating">
              <span class="rating-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
              <span class="rating-value">${product.rating}/5</span>
            </div>
            <p class="popup-description">${product.description}</p>
            <a href="${product.buyLink}" class="buy-now-button" target="_blank">Buy Now</a>
            <div class="popup-retailers">
              <p>Available at:</p>
              <div class="retailer-links">
                <a href="${product.store_link}" target="_blank">${product.store_name}</a>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Show overlay and popup
      modalOverlay.classList.add('active');
      window.productPopup.style.display = 'block';
      
      // Add close functionality
      window.productPopup.querySelector('.close-popup').addEventListener('click', closeProductPopup);
    }
    window.openProductPopup = openProductPopup;
    
    // Function to close the popup
    function closeProductPopup() {
      modalOverlay.classList.remove('active');
      window.productPopup.style.display = 'none';
    }
    
    // Close popup when clicking on overlay
    modalOverlay.addEventListener('click', closeProductPopup);
    
    // Close popup when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && window.productPopup.style.display === 'block') {
        closeProductPopup();
      }
    });
    
    // Check if a product was set for popup from another page
    function handlePopupFromStorage() {
      const popupProductId = localStorage.getItem('popupProductId');
      if (popupProductId) {
        console.log('Looking for product ID:', popupProductId);
        
        // Wait for products to be available
        const waitForProducts = () => {
          const all = window.allProducts || window.products || [];
          console.log('Available products:', all.length);
          
          if (all.length > 0) {
            const fullProduct = all.find(p => String(p.id) === String(popupProductId));
            
            if (fullProduct) {
              console.log('Found full product:', fullProduct);
              // Make sure openProductPopup is available
              if (window.openProductPopup) {
                window.openProductPopup(fullProduct);
              } else {
                console.error('openProductPopup function not available');
              }
            } else {
              console.error('Product not found with ID:', popupProductId);
            }
            
            // Clean up
            localStorage.removeItem('popupProductId');
          } else {
            // Products not loaded yet, try again
            console.log('Products not loaded yet, retrying...');
            setTimeout(waitForProducts, 100);
          }
        };
        
        waitForProducts();
      }
    }
    // CATEGORY FUNCTIONALITY
    // Add category filtering functionality
    const categoryLinks = document.querySelectorAll('.category-link');
    const featuredHeading = document.querySelector('.text-wrapper-8');
    const productGrid = document.querySelector('.container-2');
    
    if (categoryLinks && featuredHeading) {
        // Category mapping for proper display names
        const categoryDisplayNames = {
            't-shirts': 'Shirts',
            'jeans': 'Lower Garments',
            'dresses': 'Dresses',
            'swimwear': 'Swimwear',
            'shoes': 'Shoes',
            'blazers': 'Blazers',
            'hoodies': 'Hoodies & Jackets',
            'accessories': 'Accessories',
            'all': 'All Products'
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
                if (category === 'all') {
                    resetProductDisplay();
                } else {
                    filterProductsByCategory(category);
                }
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
        
        // Get products matching the category (using allProducts instead of just extendedProducts)
        const filteredProducts = category === 'all' 
            ? allProducts 
            : allProducts.filter(product => product.category === category);
        
        // If no products in this category, show a message and return
        if (filteredProducts.length === 0) {
            featuredHeading.textContent = 'No products found in ' + (categoryDisplayNames[category] || category);
            // Hide pagination buttons
            const paginationContainer = document.querySelector('.pagination-container');
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }
        
        // Define the base positions for the first row
        const baseTop = 210; // Starting Y position
        const baseLeft = 132; // Starting X position
        const xOffset = 300; // Horizontal spacing between products
        const yOffset = 416; // Vertical spacing between rows
        
        // First, clear current display
        document.querySelectorAll('[class*="container-"][class*="product-container"]').forEach(container => {
            container.remove();
        });
        
        // Show the first page of filtered products
        const ITEMS_PER_PAGE = 16;
        const productsToShow = filteredProducts.slice(0, ITEMS_PER_PAGE);
        const productGrid = document.querySelector('.container-2');
        
        // Position the filtered products in a grid (4 per row)
        productsToShow.forEach((product, index) => {
            // Calculate row and column position
            const row = Math.floor(index / 4);
            const col = index % 4;
            
            // Calculate top and left positions
            const topPosition = baseTop + (row * yOffset);
            const leftPosition = baseLeft + (col * xOffset);
            
            // Create container for this product
            const container = document.createElement('div');
            const containerNumber = index + 3; // Container numbers start at 3
            container.className = `container-${containerNumber} product-container`;
            container.style.top = `${topPosition}px`;
            container.style.left = `${leftPosition}px`;
            
            container.innerHTML = `
                <div class="wishlist-heart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
                <img class="image-${containerNumber <= 6 ? '2' : '3'}" src="${product.image}" alt="${product.name}" />
                <div class="text-wrapper-${containerNumber <= 6 ? '5' : '7'}">${product.name}</div>
            `;
            
            productGrid.appendChild(container);
            
            // Set up event listeners
            setupProductContainerEventListeners(container, product);
        });
        
        // Update pagination for filtered products
        const paginationContainer = document.querySelector('.pagination-container');
        if (paginationContainer) {
            if (filteredProducts.length <= ITEMS_PER_PAGE) {
                paginationContainer.style.display = 'none';
            } else {
                paginationContainer.style.display = 'flex';
                // Reset to first page whenever filtering
                currentPage = 1;
                // Update pagination buttons to reflect the filtered total
                totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
                updatePaginationButtons();
                
                // Update pagination function to use filtered products
                window.filteredProductList = filteredProducts;
                window.inCategoryView = true;
            }
        }
        
        // Re-setup wishlist functionality for new containers
        setupWishlistFunctionality();
    }
    
    // Function to reset product display to original state
    function resetProductDisplay() {
        // Clear category filtering state
        window.filteredProductList = null;
        window.inCategoryView = false;
        
        // Reset to first page
        currentPage = 1;
        
        // Reset total pages to include all products
        totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
        
        // Update product display for the first page
        updateProductDisplay(currentPage);
        
        // Restore pagination
        const paginationContainer = document.querySelector('.pagination-container');
        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
            updatePaginationButtons();
        }
    }

    // Override the original function
    const originalUpdateProductDisplay = updateProductDisplay;
    updateProductDisplay = function(page) {
        // If we're in category view, use the filtered products
        if (window.inCategoryView && window.filteredProductList) {
            const startIndex = (page - 1) * ITEMS_PER_PAGE;
            const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, window.filteredProductList.length);
            const currentPageProducts = window.filteredProductList.slice(startIndex, endIndex);
            
            // Find the container
            const productGrid = document.querySelector('.container-2');
            if (!productGrid) {
                console.error('Product grid container not found');
                return;
            }
            
            // Remove existing product containers
            document.querySelectorAll('[class*="container-"][class*="product-container"]').forEach(container => {
                container.remove();
            });
            
            // Define the base positions
            const baseTop = 210; // Starting Y position
            const baseLeft = 132; // Starting X position
            const xOffset = 300; // Horizontal spacing between products
            const yOffset = 416; // Vertical spacing between rows
            
            // Create and add new product containers
            currentPageProducts.forEach((product, index) => {
                const containerNumber = index + 3; // Container numbers start at 3
                const row = Math.floor(index / 4);
                const col = index % 4;
                
                const topPosition = baseTop + (row * yOffset);
                const leftPosition = baseLeft + (col * xOffset);
                
                const container = document.createElement('div');
                container.className = `container-${containerNumber} product-container`;
                container.style.top = `${topPosition}px`;
                container.style.left = `${leftPosition}px`;
                
                container.innerHTML = `
                    <div class="wishlist-heart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <img class="image-${containerNumber <= 6 ? '2' : '3'}" src="${product.image}" alt="${product.name}" />
                    <div class="text-wrapper-${containerNumber <= 6 ? '5' : '7'}">${product.name}</div>
                `;
                
                productGrid.appendChild(container);
                
                // Set up event listeners
                setupProductContainerEventListeners(container, product);
            });
            
            // Update pagination
            updatePaginationButtons();
            
            // Re-setup wishlist functionality
            setupWishlistFunctionality();
        } else {
            // Use the original function for non-category view
            originalUpdateProductDisplay(page);
        }
    };

    // Initialize the first page display and set up pagination
    console.log("Initializing first page display");
    updateProductDisplay(currentPage);
    updatePaginationButtons();
    initPaginationButtons();
    
    // Make sure wishlist functionality is set up
    setTimeout(function() {
      setupWishlistFunctionality();
      console.log("Wishlist functionality initialized");
    }, 500);
    
    // Check for category filtering from URL after initialization
    checkUrlForCategoryFilter();

    // Override the debug event listener in HTML
    document.addEventListener('DOMContentLoaded', function() {
      // Remove any inline event listeners added in HTML
      setTimeout(function() {
        initPaginationButtons();
      }, 100);
    });

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

    // Expose allProducts to the window object
    window.allProducts = allProducts;
    handlePopupFromStorage();
    setTimeout(handlePopupFromStorage, 300);
});