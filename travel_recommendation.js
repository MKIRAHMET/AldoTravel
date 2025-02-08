window.onload = function() {
    // Load the header
    fetch('essentials/header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header').innerHTML = data;
      });
  
    // Load the social icons
    fetch('essentials/social.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('social-icons').innerHTML = data;
      });
  };

  function thankyou(){
    alert('Thank you for contacting us!')
}