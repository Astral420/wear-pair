// Submissions page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentUserData = localStorage.getItem('currentUser');
  let currentUser = null;
  
  if (isLoggedIn && currentUserData) {
    currentUser = JSON.parse(currentUserData);
  }
  
  // DOM elements
  const submissionForm = document.getElementById('submission-form');
  console.log('Submission form element:', submissionForm); // Debug log
  const imageInput = document.getElementById('submission-image');
  const imagePreview = document.getElementById('image-preview');
  const browseBtn = document.querySelector('.browse-btn');
  const userSubmissionsContainer = document.getElementById('user-submissions');
  const emptySubmissionsMsg = document.getElementById('empty-submissions');
  const communitySubmissionsContainer = document.getElementById('community-submissions');
  const submissionsLoading = document.getElementById('submissions-loading');
  const loginModal = document.getElementById('login-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  
  // Templates
  const userSubmissionTemplate = document.getElementById('user-submission-template');
  const communitySubmissionTemplate = document.getElementById('community-submission-template');
  
  // Show login modal for non-logged in users
  if (!isLoggedIn) {
    showLoginModal();
  }
  
  // Initialize submissions data in localStorage if not exists
  if (!localStorage.getItem('submissions')) {
    initializeSubmissionsData();
  }
  
  // Load user and community submissions
  loadUserSubmissions();
  loadCommunitySubmissions();
  
  // Event listeners
  if (submissionForm) {
    // Remove any existing event listeners to prevent duplicates
    submissionForm.removeEventListener('submit', handleSubmissionFormSubmit);
    // Add the event listener with explicit error handling
    submissionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      try {
        handleSubmissionFormSubmit(e);
      } catch (error) {
        console.error('Error handling form submission:', error);
        alert('There was an error submitting your form. Please try again.');
      }
    });
  }
  
  if (imageInput) {
    imageInput.addEventListener('change', handleImageChange);
  }
  
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      imageInput.click();
    });
  }
  
  if (imagePreview) {
    imagePreview.addEventListener('click', () => {
      imageInput.click();
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });
  }
  
  // Add event delegation for submission actions
  if (userSubmissionsContainer) {
    userSubmissionsContainer.addEventListener('click', handleUserSubmissionActions);
  }
  
  if (communitySubmissionsContainer) {
    communitySubmissionsContainer.addEventListener('click', handleCommunitySubmissionActions);
  }
  
  // Functions
  
  // Initialize default submissions data
  function initializeSubmissionsData() {
    const defaultSubmissions = [
      {
        id: 1,
        author: "Emma Johnson",
        authorId: "user1",
        title: "Warm Vibes",
        hashtag: "#CozyLiving",
        image: "https://c.animaapp.com/maz6hi20R9XqZo/img/image-20-8.png",
        likes: 24,
        likedBy: []
      },
      {
        id: 2,
        author: "Mark Wilson",
        authorId: "user2",
        title: "Fresh Prep",
        hashtag: "#ModernKitchen",
        image: "https://c.animaapp.com/maz6hi20R9XqZo/img/image-20-9.png",
        likes: 18,
        likedBy: []
      },
      {
        id: 3,
        author: "Sophia Lee",
        authorId: "user3",
        title: "Ocean Calm",
        hashtag: "#BeachLife",
        image: "https://c.animaapp.com/maz6hi20R9XqZo/img/image-20-10.png",
        likes: 32,
        likedBy: []
      },
      {
        id: 4,
        author: "David Brown",
        authorId: "user4",
        title: "Happy Paws",
        hashtag: "#PetLove",
        image: "https://c.animaapp.com/maz6hi20R9XqZo/img/image-20-11.png",
        likes: 15,
        likedBy: []
      },
      {
        id: 5,
        author: "Olivia Martin",
        authorId: "user5",
        title: "Bloom Bliss",
        hashtag: "#GardenGoals",
        image: "https://c.animaapp.com/maz6hi20R9XqZo/img/image-20-12.png",
        likes: 27,
        likedBy: []
      },
      {
        id: 6,
        author: "James Taylor",
        authorId: "user6",
        title: "Work Mode",
        hashtag: "#WorkCorner",
        image: "https://c.animaapp.com/maz6hi20R9XqZo/img/image-20-13.png",
        likes: 21,
        likedBy: []
      }
    ];
    
    localStorage.setItem('submissions', JSON.stringify(defaultSubmissions));
    localStorage.setItem('nextSubmissionId', '7');
  }
  
  // Show login modal
  function showLoginModal() {
    if (loginModal) {
      loginModal.classList.add('active');
      
      // Disable the form functionality for non-logged-in users
      if (submissionForm) {
        submissionForm.addEventListener('submit', function(e) {
          e.preventDefault();
          showLoginModal();
          return false;
        });
      }
      
      if (browseBtn) {
        browseBtn.addEventListener('click', function(e) {
          e.preventDefault();
          showLoginModal();
          return false;
        });
      }
    }
  }
  
  // Load user submissions
  function loadUserSubmissions() {
    if (!userSubmissionsContainer) return;
    
    // Clear container except for the empty message
    while (userSubmissionsContainer.firstChild && userSubmissionsContainer.firstChild !== emptySubmissionsMsg) {
      userSubmissionsContainer.removeChild(userSubmissionsContainer.firstChild);
    }
    
    if (!isLoggedIn || !currentUser) {
      emptySubmissionsMsg.style.display = 'block';
      return;
    }
    
    // Get all submissions
    const submissionsData = JSON.parse(localStorage.getItem('submissions')) || [];
    
    // Filter user's submissions
    const userSubmissions = submissionsData.filter(submission => 
      submission.authorId === currentUser.email
    );
    
    if (userSubmissions.length === 0) {
      emptySubmissionsMsg.style.display = 'block';
    } else {
      emptySubmissionsMsg.style.display = 'none';
      
      // Render each submission
      userSubmissions.forEach(submission => {
        // Check if submission already exists in container
        const existingSubmission = userSubmissionsContainer.querySelector(`[data-id="${submission.id}"]`);
        if (!existingSubmission) {
          renderUserSubmission(submission);
        }
      });
    }
  }
  
  // Load community submissions
  function loadCommunitySubmissions() {
    if (!communitySubmissionsContainer) return;
    
    // Clear container except for the loading message
    while (communitySubmissionsContainer.firstChild && communitySubmissionsContainer.firstChild !== submissionsLoading) {
      communitySubmissionsContainer.removeChild(communitySubmissionsContainer.firstChild);
    }
    
    // Get all submissions
    const submissionsData = JSON.parse(localStorage.getItem('submissions')) || [];
    
    if (submissionsData.length === 0) {
      submissionsLoading.textContent = 'No submissions available';
    } else {
      submissionsLoading.style.display = 'none';
      
      // Render each submission
      submissionsData.forEach(submission => {
        // Don't show current user's submissions in community section
        if (!currentUser || submission.authorId !== currentUser.email) {
          // Check if submission already exists in container
          const existingSubmission = communitySubmissionsContainer.querySelector(`[data-id="${submission.id}"]`);
          if (!existingSubmission) {
            renderCommunitySubmission(submission);
          }
        }
      });
    }
  }
  
  // Render a user submission
  function renderUserSubmission(submission) {
    if (!userSubmissionTemplate) return;
    
    // Clone the template
    const submissionCard = document.importNode(userSubmissionTemplate.content, true);
    
    // Set submission data
    const card = submissionCard.querySelector('.submission-card');
    card.dataset.id = submission.id;
    
    const image = submissionCard.querySelector('.submission-image');
    image.src = submission.image;
    image.alt = submission.title;
    
    submissionCard.querySelector('.submission-title').textContent = submission.title;
    submissionCard.querySelector('.submission-hashtag').textContent = submission.hashtag;
    submissionCard.querySelector('.likes-count').textContent = `${submission.likes} likes`;
    
    // Add the card to the container
    userSubmissionsContainer.appendChild(submissionCard);
  }
  
  // Render a community submission
  function renderCommunitySubmission(submission) {
    if (!communitySubmissionTemplate) return;
    
    // Clone the template
    const submissionCard = document.importNode(communitySubmissionTemplate.content, true);
    
    // Set submission data
    const card = submissionCard.querySelector('.submission-card');
    card.dataset.id = submission.id;
    
    const image = submissionCard.querySelector('.submission-image');
    image.src = submission.image;
    image.alt = submission.title;
    
    //submissionCard.querySelector('.submission-author').textContent = submission.author;
    submissionCard.querySelector('.submission-title').textContent = submission.title;
    submissionCard.querySelector('.submission-hashtag').textContent = submission.hashtag;
    
    // Set like button state
    const likeBtn = submissionCard.querySelector('.like-btn');
    if (isLoggedIn && currentUser && submission.likedBy.includes(currentUser.email)) {
      likeBtn.dataset.liked = 'true';
      likeBtn.querySelector('.like-icon').textContent = '♥'; // Filled heart
    }
    
    // Add the card to the container
    communitySubmissionsContainer.appendChild(submissionCard);
  }
  
  // Handle submission form submit
  function handleSubmissionFormSubmit(e) {
    e.preventDefault();
    
    if (!isLoggedIn || !currentUser) {
      showLoginModal();
      return;
    }
    
    // Get form data
    const title = document.getElementById('submission-title').value;
    const hashtag = document.getElementById('submission-hashtag').value;
    const imageFile = imageInput.files[0];
    
    if (!title || !hashtag || !imageFile) {
      alert('Please fill out all fields and upload an image');
      return;
    }
    
    // Ensure hashtag starts with #
    const formattedHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    
    // Compress and convert image
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        // Create canvas for image compression
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG
        const compressedImageUrl = canvas.toDataURL('image/jpeg', 0.6);
        
        try {
          // Get current submissions
          const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
          
          // Check for duplicate submission
          const isDuplicate = submissions.some(sub => 
            sub.title === title && 
            sub.authorId === currentUser.email
          );
          
          if (isDuplicate) {
            alert('You have already submitted a post with this title');
            return;
          }
          
          // Create new submission
          const newSubmission = {
            id: parseInt(localStorage.getItem('nextSubmissionId') || '1'),
            author: currentUser.fullName,
            authorId: currentUser.email,
            title: title,
            hashtag: formattedHashtag,
            image: compressedImageUrl,
            likes: 0,
            likedBy: []
          };
          
          // Update submissions in localStorage
          submissions.push(newSubmission);
          localStorage.setItem('submissions', JSON.stringify(submissions));
          
          // Update next submission ID
          const nextId = parseInt(localStorage.getItem('nextSubmissionId') || '1') + 1;
          localStorage.setItem('nextSubmissionId', nextId.toString());
          
          // Reset form
          submissionForm.reset();
          imagePreview.innerHTML = '<i class="upload-icon">📸</i><span>No image selected</span>';
          imagePreview.classList.remove('has-image');
          
          // Refresh user submissions
          loadUserSubmissions();
          
          // Show success message
          
        } catch (error) {
          if (error.name === 'QuotaExceededError') {
            alert('Storage limit reached. Please try uploading a smaller image or clear some space.');
          } else {
            console.error('Error saving submission:', error);
            alert('There was an error saving your submission. Please try again.');
          }
        }
      };
      img.src = event.target.result;
    };
    
    reader.onerror = function() {
      alert('Error reading the image file. Please try again.');
    };
    
    reader.readAsDataURL(imageFile);
  }
  
  // Handle image change
  function handleImageChange(e) {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        imagePreview.classList.add('has-image');
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  // Handle user submission actions (delete)
  function handleUserSubmissionActions(e) {
    if (!isLoggedIn || !currentUser) {
      showLoginModal();
      return;
    }
    
    // Handle delete button click
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
      const card = e.target.closest('.submission-card');
      if (card) {
        const submissionId = parseInt(card.dataset.id);
        
        if (confirm('Are you sure you want to delete this submission?')) {
          deleteSubmission(submissionId);
        }
      }
    }
  }
  
  // Handle community submission actions (like)
  function handleCommunitySubmissionActions(e) {
    if (!isLoggedIn || !currentUser) {
      showLoginModal();
      return;
    }
    
    // Handle like button click
    if (e.target.classList.contains('like-btn') || e.target.closest('.like-btn')) {
      const likeBtn = e.target.classList.contains('like-btn') ? e.target : e.target.closest('.like-btn');
      const card = likeBtn.closest('.submission-card');
      
      if (card) {
        const submissionId = parseInt(card.dataset.id);
        const isLiked = likeBtn.dataset.liked === 'true';
        
        if (isLiked) {
          unlikeSubmission(submissionId, likeBtn);
        } else {
          likeSubmission(submissionId, likeBtn);
        }
      }
    }
  }
  
  // Delete a submission
  function deleteSubmission(submissionId) {
    // Get all submissions
    let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    
    // Filter out the submission to delete
    submissions = submissions.filter(submission => submission.id !== submissionId);
    
    // Update localStorage
    localStorage.setItem('submissions', JSON.stringify(submissions));
    
    // Remove the submission card from the DOM
    const submissionCard = userSubmissionsContainer.querySelector(`[data-id="${submissionId}"]`);
    if (submissionCard) {
      submissionCard.remove();
    }
    
    // Check if there are any remaining submissions
    const remainingSubmissions = userSubmissionsContainer.querySelectorAll('.submission-card');
    if (remainingSubmissions.length === 0) {
      emptySubmissionsMsg.style.display = 'block';
    }
    
    // Also remove from community submissions if it exists there
    const communityCard = communitySubmissionsContainer.querySelector(`[data-id="${submissionId}"]`);
    if (communityCard) {
      communityCard.remove();
    }
  }
  
  // Like a submission
  function likeSubmission(submissionId, likeBtn) {
    // Get all submissions
    let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    
    // Find the submission
    const submissionIndex = submissions.findIndex(s => s.id === submissionId);
    
    if (submissionIndex !== -1) {
      // Update likes and likedBy
      submissions[submissionIndex].likes += 1;
      submissions[submissionIndex].likedBy.push(currentUser.email);
      
      // Update localStorage
      localStorage.setItem('submissions', JSON.stringify(submissions));
      
      // Update like button
      likeBtn.dataset.liked = 'true';
      likeBtn.querySelector('.like-icon').textContent = '♥'; // Filled heart
    }
  }
  
  // Unlike a submission
  function unlikeSubmission(submissionId, likeBtn) {
    // Get all submissions
    let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    
    // Find the submission
    const submissionIndex = submissions.findIndex(s => s.id === submissionId);
    
    if (submissionIndex !== -1) {
      // Update likes and likedBy
      submissions[submissionIndex].likes = Math.max(0, submissions[submissionIndex].likes - 1);
      submissions[submissionIndex].likedBy = submissions[submissionIndex].likedBy.filter(
        email => email !== currentUser.email
      );
      
      // Update localStorage
      localStorage.setItem('submissions', JSON.stringify(submissions));
      
      // Update like button
      likeBtn.dataset.liked = 'false';
      likeBtn.querySelector('.like-icon').textContent = '♡'; // Empty heart
    }
  }
}); 