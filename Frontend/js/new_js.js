// For GeoLocation

const { Restaurant } = require("../../backend/models/restaurant");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    document.getElementById('latitude').value = position.coords.latitude;
    console.log(position.coords.latitude);
    document.getElementById('longitude').value = position.coords.longitude;
    console.log(position.coords.longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


// Handle photo uploads with a limit
document.getElementById('photos').addEventListener('change', function() {
    const maxFiles = 3;
    const photoError = document.getElementById('photo-error');

    if (this.files.length > maxFiles) {
        photoError.style.display = 'block';
        this.value = ''; // Clear the input
    } else {
        photoError.style.display = 'none';
    }
});

// Form submission for photo upload
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/upload-endpoint', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          console.log(data);
          // Handle the response data
      })
      .catch(error => {
          console.error('Error:', error);
          // Handle the error
      });
});

function scrollToSection() {
    // Select the element you want to scroll to
    const element = document.getElementById('temp');

    // Scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
}