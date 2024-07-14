// For GeoLocation

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    document.getElementById('latitude').value = position.coords.latitude;
    document.getElementById('longitude').value = position.coords.longitude;
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

function viewLocationOnMap(latitude, longitude) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
   window.open(mapUrl, '_blank'); // Opens the map URL in a new tab/window
}

window.addEventListener('load', async () => {
    try {
        const response = await fetch('http://localhost:3000/ngo/get'); // Update with the correct backend URL
        const data = await response.json();
        if (response.status === 200) {
            setupSearch(data.ngos);
            displayNGOs(data.ngos);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert(`Error: ${error}`);
        console.error('Error fetching NGOs:', error);
    }
});

function displayNGOs(ngos) {
    const ngoContainer = document.getElementById('ngoContainer');
    const rowDiv = ngoContainer.querySelector('.row');
    rowDiv.innerHTML = ''; // Clear existing content

    if (ngos.length === 0) {
        const message = document.createElement('div');
        message.className = 'message-card'; // Apply custom message-card class
        message.textContent = 'No NGO found';
        message.id = 'empty-message';

        ngoContainer.appendChild(message);
        return;
    }

    ngos.forEach((ngo, index) => {
        const ngoCard = document.createElement('div');
        ngoCard.className = 'col-12 col-sm-6 col-md-4 mb-4 d-flex';
        
        ngoCard.innerHTML = `
            <div class="card w-100">
                <img src="${ngo.ngo_photos[0]}" class="card-img-top img-fluid" alt="NGO Image" style="max-height: 300px;">
                 <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${ngo.organization_name}</h5>
                    <p class="card-text">Manager Name: ${ngo.primary_contact.name}</p>
                    <p class="card-text">Address: ${formatAddress(ngo.physical_addresses)}</p>
                    <p class="card-text">Email: ${ngo.primary_contact.email}</p>
                    <p><strong>Contact:</strong> ${ngo.primary_contact.phoneno}</p>
                    <p><strong>Location :</strong>
                    <a href="javascript:void(0);" onclick="viewLocationOnMap(${ngo.physical_addresses.geo_location.latitude}, ${ngo.physical_addresses.geo_location.longitude})">Click here to view on map</a>
                    </p>
                    <div class="text-center mt-auto">
                     <button class="btn btn-primary view-photos" data-photos='${JSON.stringify(ngo.ngo_photos)}'>View Photos</button>
                     </div>
                </div>
            </div>
        `;

        rowDiv.appendChild(ngoCard);
    });
    document.querySelectorAll('.view-photos').forEach(button => {
        button.addEventListener('click', () => {
            const photos = JSON.parse(button.getAttribute('data-photos'));
            showPhotos(photos);
        });
    });
}

function showPhotos(photos) {
    const photoContainer = document.querySelector('.photo-tile');
    photoContainer.innerHTML = ''; // Clear previous photos

    photos.forEach((photo, index) => {
        console.log(`Loading photo: ${photo}`); // Debugging line to check photo paths
        const img = document.createElement('img');
        img.src = photo;
        img.alt = `images/person_${index + 1}`;
        img.className = 'tile-photo';
        if(index === 0){
            img.style.display = 'block';
        }
        photoContainer.appendChild(img);
    });

    let currentPhotoIndex = 0;
    const numPhotos = photos.length;

    function updateDisplayedPhoto() {
        const photos = document.querySelectorAll('.tile-photo');
        photos.forEach(photo => {
            photo.style.display = 'none'; // Hide all photos
        });
        photos[currentPhotoIndex].style.display = 'block'; // Show current photo
    }

    document.querySelector('.btn-next-photo').onclick = function () {
        currentPhotoIndex = (currentPhotoIndex + 1) % numPhotos; // Increment index
        updateDisplayedPhoto(); // Update displayed photo
    };

    document.querySelector('.btn-previous-photo').onclick = function () {
        currentPhotoIndex = (currentPhotoIndex - 1 + numPhotos) % numPhotos; // Decrement index
        updateDisplayedPhoto(); // Update displayed photo
    };

    $('#photoModal').modal('show');
}

function setupSearch(ngos) {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearButton');
    // Perform search on each input event
    searchInput.addEventListener('input', () => {
        const existingMessage = document.getElementById('empty-message');
        if (existingMessage) {
            ngoContainer.removeChild(existingMessage);
        }
        const query = searchInput.value.toLowerCase();
        const filteredNGOs = ngos.filter(ngo => ngo.organization_name.toLowerCase().includes(query));
        displayNGOs(filteredNGOs);
    });

    clearButton.addEventListener('click', () => {
        const existingMessage = document.getElementById('empty-message');
        if (existingMessage) {
            ngoContainer.removeChild(existingMessage);
        }
        searchInput.value = '';
        displayNGOs(ngos); 
    });
}

function formatAddress(address) {
    return `
        ${address.address_line_1}, ${address.address_line_2 ? address.address_line_2 + ', ' : ''}
        ${address.city}, ${address.state}, ${address.zip_code}
    `;
}
