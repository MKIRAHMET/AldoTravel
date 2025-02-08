window.onload = function () {

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


  fetch('essentials/social.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('social-icons').innerHTML = data;
    });


  setTimeout(() => {
    const closeResult = document.getElementById('closeResult');
    if (closeResult) {
      closeResult.addEventListener('click', closeResults);
    }
  }, 1000); 
};


function thankyou() {
  alert('Thank you for contacting us!');
}


let timeout;

function debounceSearch() {
  clearTimeout(timeout); // 
  timeout = setTimeout(searchCondition, 500); 
}
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
          // Add country time
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



document.getElementById('searchInput').addEventListener('input', debounceSearch);


function closeResults() {
  const resultDiv = document.getElementById('result');
  resultDiv.style.display = 'none'; // Hide the results
}


function showResults() {
  document.getElementById('result').classList.add('show');
  document.getElementById('overlay').style.display = 'block';
}


function closeResults() {
  document.getElementById('result').classList.remove('show');
  document.getElementById('overlay').style.display = 'none';
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  closeResults();
  document.getElementById('result').innerHTML = ''; 
}