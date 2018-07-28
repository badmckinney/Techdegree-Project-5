const directory = document.getElementById('directory');

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
  const employees = document.querySelectorAll('.employee');
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
`;

modal.innerHTML = modalMarkup;

/*
const showModal = (event) => {
  if (event.target !== undefined) {
    modalPhoto.src = employeeData[event.target.id.slice(-1)].picture.large;
    modalName.textContent = employeeData[event.target.id.slice(-1)].name.first + " " + employeeData[event.target.id.slice(-1)].name.last;
    modalEmail.textContent = employeeData[event.target.id.slice(-1)].email;
    modalCity.textContent = employeeData[event.target.id.slice(-1)].city;
    modalPhone.textContent = employeeData[event.target.id.slice(-1)].phone;
    modalAddress.textContent = employeeData[event.target.id.slice(-1)].location.street + ", " + employeeData[event.target.id.slice(-1)].location.state + ", " + employeeData[event.target.id.slice(-1)].location.postcode;
    modalBirth.textContent = "Birthday: " + employeeData[event.target.id.slice(-1)].dob.date;
    modal.className = "";
  }
}
*/


const showModal = (event) => {
  if (event.target.id.includes("employee") ||
    event.target.id.includes("photo") ||
    event.target.id.includes("info") ||
    event.target.id.includes("name") ||
    event.target.id.includes("email") ||
    event.target.id.includes("city")) {
      modal.innerHTML = `
      <div id="modalAvatar">
        <img src="${employeeData[event.target.id.match(/\d/g).join("")].picture.large}" id="modalPhoto">
      </div>
      <div id="modalInfo">
      <p id="modalName">${employeeData[event.target.id.match(/\d/g).join("")].name.first} ${employeeData[event.target.id.match(/\d/g).join("")].name.last}</p>
      <p id="modalEmail">${employeeData[event.target.id.match(/\d/g).join("")].email}</p>
      <p id="modalCity">${employeeData[event.target.id.match(/\d/g).join("")].location.city}</p>
      <hr>
      <p id="modalPhone">${employeeData[event.target.id.match(/\d/g).join("")].phone}</p>
      <p id="modalAddress">${employeeData[event.target.id.match(/\d/g).join("")].location.street}, ${employeeData[event.target.id.match(/\d/g).join("")].location.state}, ${employeeData[event.target.id.match(/\d/g).join("")].location.postcode}</p>
      <p id="modalBirth">Birthday: ${employeeData[event.target.id.match(/\d/g).join("")].dob.date}</p>
      </div>
      `;
    modal.style.display = "block";
  }
}

directory.addEventListener('click', showModal);
