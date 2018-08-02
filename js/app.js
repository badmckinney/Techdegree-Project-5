const directory = document.getElementById('directory');
const overlay = document.getElementById('overlay');

/*====================
     HTTP REQUEST
=====================*/
//A reusable function for fetching data from a server
//Fetches data from the specified URL
//Checks the status of the request, if OK, parses results to JSON format
//Logs an error if anything goes wrong
const fetchData = (url) => {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem', error))
}

//A reusable function for checking the status of a request
//If the response status is OK, promise resolves, else, throws an error
const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/*=========================
     PAGE CONSTRUCTION
==========================*/
let employeeData = {}
//Resuable function for capitalizing data taken from fetched data
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//A function that creates the base elements for the page with no data in them
//Loops 12 times to create 12 separate divs for 12 employees
//Sets each element with an id based on their index
//Appends the markup to the directory div
const generateMarkup = () => {
  for (i = 0; i < 12; i += 1) {
    let pageMarkup = `
      <div id="employee${i}" class="employee">
        <div class="avatar">
          <img src="" id="photo${i}" class="photo">
        </div>
        <div id="info${i}" class="userInfo">
          <h3 id="name${i}" class="name"></h3>
          <p id="email${i}" class="email"></p>
          <p id="city${i}" class="city"></p>
        </div>
      </div>
    `;
    directory.innerHTML += pageMarkup;
  }
}

generateMarkup();

//Variables for reference
const employees = document.getElementsByClassName('employee');
const photos = document.getElementsByClassName('photo');
const names = document.getElementsByClassName('name');
const emails = document.getElementsByClassName('email');
const cities = document.getElementsByClassName('city');

//A function that injects the fetched data into the page markup
//Loops over 12 times to target each employee div and updates markup
const injectData = (data) => {
  for (i = 0; i < 12; i += 1) {
    photos[i].src = employeeData[i].picture.medium;
    names[i].textContent = capitalizeFirstLetter(employeeData[i].name.first) + " " + capitalizeFirstLetter(employeeData[i].name.last);
    emails[i].textContent = employeeData[i].email;
    cities[i].textContent = capitalizeFirstLetter(employeeData[i].location.city);
  }
}

//fetchData function is called, returning 12 objects from randomuser API
//generateMarkup function is called, passing the returned data as an argument
fetchData('https://randomuser.me/api/?results=12&nat=us')
  .then(res => employeeData = res.results)
  .then(data => injectData(data))


/*============
     MODAL
=============*/
//Variables for reference
//Hides modal
const modal = document.querySelector('#modal');
modal.style.display = "none";
const modalPhoto = document.querySelectorAll('#modalPhoto');
const modalName = document.querySelectorAll('#modalName');
const modalEmail = document.querySelectorAll('#modalEmail');
const modalCity = document.querySelectorAll('#modalCity');
const modalPhone = document.querySelectorAll('#modalPhone');
const modalAddress = document.querySelectorAll('#modalAddress');
const modalBirth = document.querySelectorAll('#modalBirth');

//A variable to hold the markup for the modal
//Markup is appended to modal's div
let modalMarkup = `
  <button id="close" aria-label="Close Modal Box">&times;</button>
  <div id="modalAvatar">
    <img src="" id="modalPhoto">
  </div>
  <div id="modalInfo">
  <p id="modalName"></p>
  <p id="modalEmail"></p>
  <p id="modalCity"></p>
  <hr>
  <p id="modalPhone"></p>
  <p id="modalAddress"></p>
  <p id="modalBirth"></p>
  </div>
  <div id="arrows">
    <button id="previous" aria-label="Previous Employee">&#8249;</button>
    <button id="next" aria-label="Next Employee">&#8250;</button>
  </div>
`;

modal.innerHTML = modalMarkup;

//Checks if the user clicked one of the elements on an employee div
//If yes, updates the modal's HTML Markup based on the id of the click target
//Modal & overlay is revealed
//displayedIndex is updated with the index of the click target
const showModal = (event) => {
  if (event.target.id.includes("employee") ||
    event.target.id.includes("photo") ||
    event.target.id.includes("info") ||
    event.target.id.includes("name") ||
    event.target.id.includes("email") ||
    event.target.id.includes("city")) {
      modal.innerHTML = `
      <button id="close" aria-label="Close Modal Box">&times;</button>
      <div id="modalAvatar">
        <img src="${employeeData[event.target.id.match(/\d/g).join("")].picture.large}" id="modalPhoto">
      </div>
      <div id="modalInfo">
      <h3 id="modalName">${employeeData[event.target.id.match(/\d/g).join("")].name.first} ${employeeData[event.target.id.match(/\d/g).join("")].name.last}</h3>
      <p id="modalEmail">${employeeData[event.target.id.match(/\d/g).join("")].email}</p>
      <p id="modalCity">${employeeData[event.target.id.match(/\d/g).join("")].location.city}</p>
      <hr>
      <p id="modalPhone">${employeeData[event.target.id.match(/\d/g).join("")].phone}</p>
      <p id="modalAddress">${employeeData[event.target.id.match(/\d/g).join("")].location.street}, ${employeeData[event.target.id.match(/\d/g).join("")].location.state}, ${employeeData[event.target.id.match(/\d/g).join("")].location.postcode}</p>
      <p id="modalBirth">Birthday: ${employeeData[event.target.id.match(/\d/g).join("")].dob.date.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$3-$2-$1')}</p>
      <div id="arrows">
        <button id="previous" aria-label="Previous Employee">&#8249;</button>
        <button id="next" aria-label="Next Employee">&#8250;</button>
      </div>
      </div>
      `;
    modal.style.display = "block";
    overlay.style.display = "block";
    displayedIndex = parseInt(event.target.id.match(/\d/g).join(""));
  }
}

//Event listener for clicks on the directory as a whole
directory.addEventListener('click', showModal);

// - - - - - - - - TOGGLE FUNCTIONALITY - - - - - - - - - //

//Variable to indicate the index of the current employee being displayed on modal
let displayedIndex;

//Checks to see that any employee other than the first is being displayed
//If so, subtracts 1 from the displayIndex and updates markup with previous employee
const previous = () => {
  if (displayedIndex > 0) {
    displayedIndex -= 1;
    modal.innerHTML = `
      <button id="close" aria-label="Close Modal Box">&times;</button>
      <div id="modalAvatar">
        <img src="${employeeData[displayedIndex].picture.large}" id="modalPhoto">
      </div>
      <div id="modalInfo">
      <h3 id="modalName">${employeeData[displayedIndex].name.first} ${employeeData[displayedIndex].name.last}</h3>
      <p id="modalEmail">${employeeData[displayedIndex].email}</p>
      <p id="modalCity">${employeeData[displayedIndex].location.city}</p>
      <hr>
      <p id="modalPhone">${employeeData[displayedIndex].phone}</p>
      <p id="modalAddress">${employeeData[displayedIndex].location.street}, ${employeeData[displayedIndex].location.state}, ${employeeData[displayedIndex].location.postcode}</p>
      <p id="modalBirth">Birthday: ${employeeData[displayedIndex].dob.date.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$3-$2-$1')}</p>
      <div id="arrows">
        <button id="previous" aria-label="Previous Employee">&#8249;</button>
        <button id="next" aria-label="Next Employee">&#8250;</button>
      </div>
      </div>
    `
  }
}

//Checks to see that any employee other than the last is being displayed
//If so, adds 1 from the displayIndex and updates markup with next employee
const next = () => {
  if (displayedIndex < 11) {
    displayedIndex += 1;
    modal.innerHTML = `
      <button id="close" aria-label="Close Modal Box">&times;</button>
      <div id="modalAvatar">
        <img src="${employeeData[displayedIndex].picture.large}" id="modalPhoto">
      </div>
      <div id="modalInfo">
      <h3 id="modalName">${employeeData[displayedIndex].name.first} ${employeeData[displayedIndex].name.last}</h3>
      <p id="modalEmail">${employeeData[displayedIndex].email}</p>
      <p id="modalCity">${employeeData[displayedIndex].location.city}</p>
      <hr>
      <p id="modalPhone">${employeeData[displayedIndex].phone}</p>
      <p id="modalAddress">${employeeData[displayedIndex].location.street}, ${employeeData[displayedIndex].location.state}, ${employeeData[displayedIndex].location.postcode}</p>
      <p id="modalBirth">Birthday: ${employeeData[displayedIndex].dob.date.replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$3-$2-$1')}</p>
      <div id="arrows">
        <button id="previous" aria-label="Previous Employee">&#8249;</button>
        <button id="next" aria-label="Next Employee">&#8250;</button>
      </div>
      </div>
    `
  }
}

//Checks to see which button was clicked.
//If close button, modal and overlay is hidden
//If previous button, shows previous employee information
//If next button, shows next employee information
const handleModal = (event) => {
  if (event.target.id === "close") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else if (event.target.id === "previous") {
    previous();
  } else if (event.target.id === "next") {
    next();
  }
}

//Listens for clicks on the modal
//On click, runs the handleModal function
modal.addEventListener('click', handleModal);


/*==============
     SEARCH
===============*/
//Variable for reference
const search = document.querySelector('#search');

//Loops 12 times, once over each employee's name
//Checks to see if each name contains the user's input (Both are set to lowercase to ensure proper matching)
//If so, those employees are displayed to the page
//If not, those employees are hidden
//If the user deletes all input, all employees are displayed on the page again
const filter = () => {
  for (i = 0; i < 12; i += 1) {
    if (names[i].textContent.toLowerCase().indexOf(search.value.toLowerCase()) > -1 || emails[i].textContent.toLowerCase().indexOf(search.value.toLowerCase()) > -1 ) {
      employees[i].style.display = "block";
    } else if (names[i].textContent.toLowerCase().indexOf(search.value.toLowerCase()) === -1) {
      employees[i].style.display = "none";
    }
  }
  if (search.value === "") {
    for (i = 0; i < 11; i += 1) {
      employees[i].style.display = "block";
    }
  }
}

//Listens for and triggers when user is typing on the search bar and any key goes up from being pressed
//When triggered, calls filter function
search.addEventListener('keyup', filter)
