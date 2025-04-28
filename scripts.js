let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let loggedIn = false;

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

      const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const eventData = localStorage.getItem(formattedDate);
        if (eventData) {
            cell.classList.add('event-day');
        }

      row.appendChild(cell);
    }
    
    //creates cells after a complete week. for example, if the month is 28 days long but the 26th falls on a friday it will add the remainders
    if (row.children.length > 0) {
      tbody.appendChild(row);
    }

    const calendarCells = document.querySelectorAll('.calendar-cell');
    calendarCells.forEach(cell => {
      cell.addEventListener('click', function() {
        if (!loggedIn) {
          alert('Please log in to view events.')
          return;
        }

          const day = this.textContent.padStart(2, '0'); //add leading zero to day if needed
          const month = (currentMonth + 1).toString().padStart(2, '0'); //add leading zero to month
          const selectedDate = `${currentYear}-${month}-${day}`; //format: YYYY-MM-DD
  
          //fetch data from local Storage
          const eventData = localStorage.getItem(selectedDate);
  
          if (eventData) {
            const parsedData = JSON.parse(eventData);
        
            //if multiple events are saved for the same date, loop through them
            const eventDetails = parsedData.map(event => `
                Title: ${event.eventTitle || 'No title'}
                Time: ${event.eventTime || 'No time'}
                Description: ${event.eventDescription || 'No description'}
                Importance: ${event.importance || 'No importance'}
                
            `).join('\n\n');
        
            alert(`Events for ${selectedDate}:\n\n${eventDetails}`);
        } else { 
            alert(`No events found for ${selectedDate}`);
        }
      });
    });
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

function populateReminders() {
    const remindersBox = document.getElementById('reminders-list');
    remindersBox.innerHTML = ''; //clear existing reminders

    if (!loggedIn) {
      remindersBox.textContent = 'Please log in to view reminders.';
      return;
  }

    //loop through all keys in local storage
    const importantEvents = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        //check if the key is a date (in the correct format YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
            const eventsForDate = JSON.parse(localStorage.getItem(key)) || [];

            //filter events marked as important
            eventsForDate.forEach(event => {
                if (event.importance === 'important') {
                    importantEvents.push(event);
                }
            });
        }
    }

    //create a list of important events
    if (importantEvents.length > 0) {
        const ul = document.createElement('ul');
        importantEvents.forEach(event => {
            const li = document.createElement('li');
            li.textContent = `${event.eventTitle}, ${event.eventDescription}, ${event.date}, ${event.eventTime}`;
            ul.appendChild(li);
        });
        remindersBox.appendChild(ul);
    } else {
        remindersBox.textContent = 'No important events found.';
    }
}
//these are all the event listeners for the buttons in the calendar
window.addEventListener('load', initializeCalendar);
window.addEventListener('load', populateReminders);

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
    if (!loggedIn) {
        alert('Please log in to add an event.');
        return;
    }
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

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    formObject.importance = document.getElementById('importance').checked ? 'important' : 'normal';

    const eventDate = formObject.date;

    if (!eventDate) {
        alert('Please select a valid date.');
        return;
    }

    //retrieve existing events for the specific date or initialize an empty array
    let eventsForDate = JSON.parse(localStorage.getItem(eventDate)) || [];

    //check if editing an existing event
    const existingEventIndex = eventsForDate.findIndex(event => event.eventTitle === formObject.eventTitle);
    if (existingEventIndex !== -1) {
        //update the existing event
        eventsForDate[existingEventIndex] = formObject;
    } else {
        //add the new event
        eventsForDate.push(formObject);
    }

    //save the updated events array back to localStorage
    localStorage.setItem(eventDate, JSON.stringify(eventsForDate));

    alert(`Event saved successfully for ${eventDate}!`);
    document.getElementById('eventForm').reset();
    document.getElementById('event-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    const [year, month, day] = eventDate.split('-');
    const calendarCells = document.querySelectorAll('.calendar-cell');
    calendarCells.forEach(cell => {
        if (cell.textContent === parseInt(day, 10).toString() && currentYear === parseInt(year, 10) && currentMonth === parseInt(month, 10) - 1) {
            cell.classList.add('event-day');
        }
    });

    populateReminders();
});

//edit event process
document.getElementById('edit-event').addEventListener('click', () => {
  if (!loggedIn) {
      alert('Please log in to edit an event.');
      return;
  }

  const selectedDate = prompt('Enter the date (YYYY-MM-DD) of the event you want to edit:');
  if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      alert('Please enter a valid date in the format YYYY-MM-DD.');
      return;
  }

  const eventsForDate = JSON.parse(localStorage.getItem(selectedDate)) || [];
  if (eventsForDate.length === 0) {
      alert(`No events found for ${selectedDate}.`);
      return;
  }

  //if multiple events exist, let the user choose one
  if (eventsForDate.length > 1) {
      const eventTitles = eventsForDate.map((event, index) => `${index + 1}. ${event.eventTitle || 'Untitled Event'}`);
      const choice = prompt(`Multiple events found for ${selectedDate}:\n\n${eventTitles.join('\n')}\n\nEnter the number of the event you want to edit:`);

      const eventIndex = parseInt(choice, 10) - 1;
      if (isNaN(eventIndex) || eventIndex < 0 || eventIndex >= eventsForDate.length) {
          alert('Invalid selection. Please try again.');
          return;
      }

      //populate the form with the selected event's data
      populateEventForm(eventsForDate[eventIndex], selectedDate);
  } else {
      //if only one event exists, pre-fill the form with its data
      populateEventForm(eventsForDate[0], selectedDate);
  }
});

//function to populate the event form
function populateEventForm(eventData, date) {
  document.getElementById('eventTitle').value = eventData.eventTitle || '';
  document.getElementById('eventDescription').value = eventData.eventDescription || '';
  document.getElementById('eventTime').value = eventData.eventTime || '';
  document.getElementById('importance').checked = eventData.importance === 'important';
  document.getElementById('eventDate').value = date;

  //show the form and overlay
  document.getElementById('event-form').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

document.getElementById('deleteEvent').addEventListener('click', () => {
  const eventDate = document.getElementById('eventDate').value;
  const eventTitle = document.getElementById('eventTitle').value;

  if (!eventDate || !eventTitle) {
      alert('Please select a valid event to delete.');
      return;
  }

  //retrieve events for the selected date
  let eventsForDate = JSON.parse(localStorage.getItem(eventDate)) || [];

  //find the index of the event to delete
  const eventIndex = eventsForDate.findIndex(event => event.eventTitle === eventTitle);

  if (eventIndex === -1) {
      alert('Event not found.');
      return;
  }

  //remove the event from the array
  eventsForDate.splice(eventIndex, 1);

  //update or remove the date key in localStorage
  if (eventsForDate.length > 0) {
      localStorage.setItem(eventDate, JSON.stringify(eventsForDate));
  } else {
      localStorage.removeItem(eventDate);

      //remove the highlight from the corresponding calendar cell
      const [year, month, day] = eventDate.split('-');
      const calendarCells = document.querySelectorAll('.calendar-cell');
      calendarCells.forEach(cell => {
          if (cell.textContent === parseInt(day, 10).toString() && currentYear === parseInt(year, 10) && currentMonth === parseInt(month, 10) - 1) {
              cell.classList.remove('event-day');          
            }
      });
  }

  alert(`Event "${eventTitle}" on ${eventDate} has been deleted.`);

  //close the form and refresh reminders
  document.getElementById('event-form').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  populateReminders();
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
        loggedIn = true; 

        document.getElementById('login').style.display = 'none';
        document.getElementById('sign-up').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('profile').style.display = 'block'; 

        populateReminders();
    } else {
        alert('Invalid username or password. Please try again.');
    }
  });

  document.getElementById('profile').addEventListener('click', () => {
    if (!loggedIn) {
      alert('Please log in to view your profile.');
      return;
    }
  
    //retrieve the saved user data from local storage
    const savedUserData = JSON.parse(localStorage.getItem('signUpData'));
  
    //populate the sign-up form with the users data
    document.getElementById('signUpUsername').value = savedUserData.username || '';
    document.getElementById('signUpPassword').value = savedUserData.password || '';
    document.getElementById('email').value = savedUserData.email || '';
  
    //show the sign-up form and overlay
    document.getElementById('sign-up-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  });

  document.getElementById('deleteProfile').addEventListener('click', () => {
    if (!loggedIn) {
      alert('You must be logged in to delete your profile.');
      return;
    }
  
    const confirmation = confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (confirmation) {
      //remove the user's data from local storage
      localStorage.removeItem('signUpData');
      loggedIn = false;
  
      //reset the UI
      document.getElementById('login').style.display = 'block';
      document.getElementById('sign-up').style.display = 'block';
      document.getElementById('profile').style.display = 'none';
      document.getElementById('sign-up-form').style.display = 'none';
      document.getElementById('overlay').style.display = 'none';
  
      alert('Your profile has been deleted.');
      location.reload(); 
    }
  });