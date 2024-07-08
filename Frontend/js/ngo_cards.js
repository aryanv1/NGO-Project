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

function scrollToSection() {
    // Select the element you want to scroll to
    const element = document.getElementById('temp');

    // Scroll to the element
    element.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('load', async () => {
    try {
        const response = await fetch('http://localhost:3000/ngo/get'); // Update with the correct backend URL
        const data = await response.json();
        if (response.status === 200) {
            displayNGOs(data.ngos);
            setupSearch(data.ngos);
        } else {
            console.error('Failed to fetch NGOs:', data.message);
        }
    } catch (error) {
        console.error('Error fetching NGOs:', error);
    }
});

function displayNGOs(ngos) {
    const ngoContainer = document.getElementById('ngoContainer');
    const rowDiv = ngoContainer.querySelector('.row');
    rowDiv.innerHTML = ''; // Clear existing content

    ngos.forEach((ngo, index) => {
        const ngoCard = document.createElement('div');
        ngoCard.className = 'col-md-4';

        ngoCard.innerHTML = `
            <div class="card mb-4">
                <img src="${ngo.ngo_photos[0] || 'https://via.placeholder.com/150'}" height="300rem" width="140px" class="card-img-top" alt="NGO Image">
                <div class="card-body">
                    <h5 class="card-title">${ngo.organization_name}</h5>
                    <p class="card-text">Manager Name: ${ngo.primary_contact.name}</p>
                    <p class="card-text">Address: ${formatAddress(ngo.physical_addresses)}</p>
                    <p class="card-text">Email: ${ngo.primary_contact.email}</p>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ngoModal${index}" style="display: block; margin: auto;">Additional Information</button>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="ngoModal${index}" tabindex="-1" aria-labelledby="ngoModalLabel${index}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ngoModalLabel${index}">${ngo.organization_name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Manager Name:</strong> ${ngo.primary_contact.name}</p>
                            <p><strong>Contact:</strong> ${ngo.primary_contact.phoneno}</p>
                            <p><strong>Email:</strong> ${ngo.primary_contact.email}</p>
                            <p><strong>Address:</strong> ${formatAddress(ngo.physical_addresses)}</p>
                            <p>Photos:</p>
                            ${ngo.ngo_photos.map(photo =>
                    `<img src="${photo}" alt="NGO Photo" style="width: 100px; margin: 5px;">`).join('')
                    }
                        </div>
                        <div class="modal-footer" style="justify-content: center;">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        rowDiv.appendChild(ngoCard);
    });
}

function setupSearch(ngos) {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearButton');

    // Perform search on each input event
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredNGOs = ngos.filter(ngo => ngo.organization_name.toLowerCase().includes(query));
        displayNGOs(filteredNGOs);
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        displayNGOs(ngos); // Display all NGOs
    });
}

function formatAddress(address) {
    return `
        ${address.address_line_1}, ${address.address_line_2 ? address.address_line_2 + ', ' : ''}
        ${address.city}, ${address.state}, ${address.zip_code}, ${address.country}
    `;
}
