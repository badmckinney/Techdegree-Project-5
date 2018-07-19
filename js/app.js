const employees = document.getElementById('employees');

const fetchData = (url) => {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem', error))
}

const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}
















fetchData('https://randomuser.me/api/')
  .then(res => console.log(res))
