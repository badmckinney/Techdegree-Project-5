const directory = document.getElementById('directory');
let displayedIndex;

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

//Takes the fetched data and builds mark up around it to display on page.
//Loops through the 12 returned objects and creates a div for each
const generateMarkup = (data) => {
  for (i = 0; i < 12; i += 1) {
    let pageMarkup = `
      <div id="employee${i}" class="employee">
        <div class="avatar">
          <img src="${data[i].picture.medium}" id="photo${i}" class="photo">
        </div>
        <div id="info${i}" class="userInfo">
          <h3 id="name${i}" class="name">${capitalizeFirstLetter(data[i].name.first)} ${capitalizeFirstLetter(data[i].name.last)}</h3>
          <p id="email${i}" class="email">${data[i].email}</p>
          <p id="city${i}" class="city">${capitalizeFirstLetter(data[i].location.city)}</p>
        </div>
      </div>
    `;
    directory.innerHTML += pageMarkup;
  }
}

//fetchData function is called, returning 12 objects from randomuser API
//generateMarkup function is called, passing the returned data as an argument
fetchData('https://randomuser.me/api/?results=12&nat=us')
  .then(res => employeeData = res.results)
  .then(data => generateMarkup(data))


/*============
     MODAL
=============*/
const modal = document.querySelector('#modal');
modal.style.display = "none";
const modalPhoto = document.querySelectorAll('#modalPhoto');
const modalName = document.querySelectorAll('#modalName');
const modalEmail = document.querySelectorAll('#modalEmail');
const modalCity = document.querySelectorAll('#modalCity');
const modalPhone = document.querySelectorAll('#modalPhone');
const modalAddress = document.querySelectorAll('#modalAddress');
const modalBirth = document.querySelectorAll('#modalBirth');

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
    displayedIndex = parseInt(event.target.id.match(/\d/g).join(""));
  }
}

directory.addEventListener('click', showModal);

const closeButton = document.querySelector('#close');

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

const handleModal = (event) => {
  if (event.target.id === "close") {
    modal.style.display = "none";
  } else if (event.target.id === "previous") {
    previous();
  } else if (event.target.id === "next") {
    next();
  }
}

modal.addEventListener('click', handleModal);


/*==============
     SEARCH
===============*/
const search = document.querySelector('#search');

const filter = () => {
  let employees = document.querySelectorAll('.employee');
  let names = document.querySelectorAll('.name');

  for (i = 0; i < 11; i += 1) {
    if (names[i].includes(search.value)) {
      employees[i].style.display = "block";
    } else {
      employees[i].style.display = "none";
    }
  }
  if (search.value === "") {
    for (i = 0; i < 11; i += 1) {
      employees[i].style.display = "block";
    }
  }
}

search.addEventListener('keyup', filter)
