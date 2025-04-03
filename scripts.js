let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

//function to update the calendar header with the current month and year
function updateCalendarHeader() {
  const months = ["January", "February", "March", "April", "May", "June",
                 "July", "August", "September", "October", "November", "December"];
  document.getElementById('month-year').textContent = `${months[currentMonth]} ${currentYear}`;
}

//function to generate the calendar
function generateCalendar(year, month) {
  //get the first day of the month and the number of days in the month
    const firstDay = new Date(year, month, 1); 
    const startingDay = firstDay.getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate(); 

    //clear the previous calendar
    const tbody = document.querySelector("#Calendar tbody"); 
    tbody.innerHTML = ""; 

    let row = document.createElement("tr"); 

    //create empty cells for the days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      row.appendChild(document.createElement("td"));
    }

    //create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      if (row.children.length === 7) { 
        tbody.appendChild(row);
        row = document.createElement("tr");
      }
      const cell = document.createElement("td");
      cell.classList.add('calendar-cell');
      cell.textContent = day; 
      row.appendChild(cell);
    }
    
    //creates cells after a complete week. for example, if the month is 28 days long but the 26th falls on a friday it will add the remainders
    if (row.children.length > 0) {
      tbody.appendChild(row);
    }

    const calendarCells = document.querySelectorAll('.calendar-cell');
////////
}

//function to initialize the calendar using previous functions
function initializeCalendar() {
  generateCalendar(currentYear, currentMonth);
  updateCalendarHeader();
}

//event listeners for the previous and next month buttons, when clicked either increase or decrease the month of the calendar
document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  //if the month goes below 0 (january), set it to december and decrease the year
  if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
  updateCalendarHeader();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  //if the month goes above 11 (december), set it to january and increase the year
  if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
  updateCalendarHeader();
});

//these are all the event listeners for the buttons in the calendar
window.addEventListener('load', initializeCalendar);

  document.getElementById('login').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  });

  document.getElementById('closeLoginButton').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  });

  document.getElementById('sign-up').addEventListener('click', () => {
    document.getElementById('sign-up-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  });

  document.getElementById('closeSignUpButton').addEventListener('click', () => {
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  });

  document.getElementById('add-event').addEventListener('click', () => {
    document.getElementById('event-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  });

  document.getElementById('closeFormButton').addEventListener('click', () => {
      document.getElementById('event-form').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
  });

  //code to save the event data to local storage
  document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();

    //extract form data and create an object
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());
    const eventDate = formObject.date;

    if (!eventDate) {
        alert('Please select a valid date.');
        return;
    }

    //retrieve existing events from local Storage or initialize an empty array
    let events = JSON.parse(localStorage.getItem('eventData'));

    //if events is null or not an array, initialize it as an empty array
    if (!Array.isArray(events)) {
        console.warn('eventData is not an array or is null. Initializing as an empty array.');
        events = [];
    }

    //add the new event to the array
    events.push(formObject);

    //save the updated events array back to local Storage
    localStorage.setItem('eventData', JSON.stringify(events));

    alert(`Event saved successfully for ${eventDate}!`);
    location.reload(); //reload the page 
});

//code to save the sign-up data to local storage
document.getElementById('signUpForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formObject = Object.fromEntries(formData.entries());
  const email = formObject.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //basic regex pattern that gets checked
  
  //if the email doesnt pass the regex test, alert the user
  if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
  }

  //convert the form data to a JSON string and save it to local Storage
  localStorage.setItem('signUpData', JSON.stringify(formObject));

  alert('Sign-up successful!');
  location.reload(); //reload the page
});

//code to handle the login process
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
    const loginDetails = Object.fromEntries(formData.entries());

    //retrieve sign-up data from local Storage
    const savedUserData = JSON.parse(localStorage.getItem('signUpData'));

    //check if sign-up data exists
    if (!savedUserData) {
        alert('No sign-up data found. Please sign up first.');
        return;
    }
    //check if the entered username and password match the saved data and either accept or reject the log in
    if (loginDetails.username === savedUserData.username && loginDetails.password === savedUserData.password) {
        alert('Login successful!');
    } else {
        alert('Invalid username or password. Please try again.');
    }
  });

  function populateReminders() {
    const remindersBox = document.getElementById('reminders-list');

    //retrieve events array from localStorage
    const events = JSON.parse(localStorage.getItem('eventData')) || [];

    //filter events marked as important
    const importantEvents = events.filter(event => event.importance === 'important');

    //create a list of important events
    const ul = document.createElement('ul');
    importantEvents.forEach(event => {
        const li = document.createElement('li');
        li.textContent = `${event.eventTitle}, ${event.eventDescription}, ${event.date}, ${event.eventTime}`;
        ul.appendChild(li);
    });

    remindersBox.appendChild(ul);
}

//call the function to populate reminders when the page loads
window.addEventListener('load', populateReminders);