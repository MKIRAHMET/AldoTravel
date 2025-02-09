window.onload = function () {
  // Fetch header and other sections
  fetch('essentials/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      
      const btnSearch = document.getElementById('btnSearch');
      const btnClearSearch = document.getElementById('btnClearSearch');
      btnClearSearch.addEventListener('click', clearSearch);

      if (btnSearch) {
        btnSearch.addEventListener('click', function () {
          searchCondition();
          showResults();
        });
      }
    });

  // Fetch other sections (social, about us, contact)
  fetch('essentials/social.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('social-icons').innerHTML = data;
    });

  fetch('aboutus.html')
   .then(response => response.text())
    .then(data => {
      document.getElementById('aboutus').innerHTML = data;
    });

  fetch('contact.html')
  .then(response => response.text())
   .then(data => {
      document.getElementById('contact').innerHTML = data;
    });

  // Display locations initially
  displayLocations();
};

// Function to thank user
function thankyou() {
  alert('Thank you for contacting us!');
}

// Debounce logic to limit search frequency
let timeout;
function debounceSearch() {
  clearTimeout(timeout);
  timeout = setTimeout(searchCondition, 500);
}

// Search condition and fetching results
function searchCondition() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // Clear previous results

  if (!input) {
    resultDiv.innerHTML = '<p>Please enter a valid search term.</p>';
    return;
  }

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let results = '';

      data.countries.forEach(country => {
        if (country.name.toLowerCase().includes(input)) {
          const countryTime = getCountryTime(country.name);
          results += `
            <h2>${country.name}</h2>
            <p><strong>Current Time:</strong> ${countryTime}</p>
          `;
        }

        country.cities.forEach(city => {
          if (city.name.toLowerCase().includes(input) || city.description.toLowerCase().includes(input)) {
            results += `
              <div class="city">
                <h3>${city.name}</h3>
                <img src="${city.imageUrl}" alt="${city.name}" />
                <p><strong>Description:</strong> ${city.description}</p>
              </div>`;
          }
        });
      });

      data.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(input) || temple.description.toLowerCase().includes(input)) {
          results += `
            <div class="temple">
              <h3>${temple.name}</h3>
              <img src="${temple.imageUrl}" alt="${temple.name}" />
              <p><strong>Description:</strong> ${temple.description}</p>
            </div>`;
        }
      });

      data.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(input) || beach.description.toLowerCase().includes(input)) {
          results += `
            <div class="beach">
              <h3>${beach.name}</h3>
              <img src="${beach.imageUrl}" alt="${beach.name}" />
              <p><strong>Description:</strong> ${beach.description}</p>
            </div>`;
        }
      });

      if (results) {
        resultDiv.innerHTML = `
          <button id="closeResult" onclick="closeResults()">Close Results</button>
          ${results}`;
      } else {
        resultDiv.innerHTML = '<p>No results found. Try another search term.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      resultDiv.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
    });
}

// Function to get the current time for a country
function getCountryTime(countryName) {
  const timeZones = {
    'Australia': 'Australia/Sydney',
    'Japan': 'Asia/Tokyo',
    'Brazil': 'America/Sao_Paulo',
    'United States': 'America/New_York',
    'Cambodia': 'Asia/Phnom_Penh', 
    'India': 'Asia/Kolkata', 
    'Bora Bora': 'Pacific/Tahiti',
  };

  const timeZone = timeZones[countryName] || 'UTC';
  const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const currentTime = new Date().toLocaleTimeString('en-US', options);
  return currentTime;
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', debounceSearch);

// Function to close results
function closeResults() {
  document.getElementById('result').style.display = 'none';
}

// Function to show results
function showResults() {
  document.getElementById('result').classList.add('show');
  document.getElementById('overlay').style.display = 'block';
}


function clearSearch() {
  document.getElementById('searchInput').value = '';
  closeResults();
  document.getElementById('result').innerHTML = ''; 
}

function displayLocations() {
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let results = '';

      data.countries.forEach(country => {
        results += `
          <div class="country">
            <h2>${country.name}</h2>
        `;

        if (country.cities && country.cities.length > 0) {
          results += `<h3>Cities</h3>`;
          country.cities.forEach(city => {
            results += `
              <div class="city">
                <h4>${city.name}</h4>
                <img src="${city.imageUrl}" alt="${city.name}" />
                <p>${city.description}</p>
              </div>
            `;
          });
        }

        results += `</div>`;
      });

      if (data.temples && data.temples.length > 0) {
        results += `<h3>Temples</h3>`;
        data.temples.forEach(temple => {
          results += `
            <div class="temple">
              <h4>${temple.name}</h4>
              <img src="${temple.imageUrl}" alt="${temple.name}" />
              <p>${temple.description}</p>
            </div>
          `;
        });
      }

      if (data.beaches && data.beaches.length > 0) {
        results += `<h3>Beaches</h3>`;
        data.beaches.forEach(beach => {
          results += `
            <div class="beach">
              <h4>${beach.name}</h4>
              <img src="${beach.imageUrl}" alt="${beach.name}" />
              <p>${beach.description}</p>
            </div>
          `;
        });
      }

      document.getElementById('locations').innerHTML = results;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
