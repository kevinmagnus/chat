let ws;
let username;

function joinChat() {
  const usernameInput = document.getElementById('username');
  username = usernameInput.value.trim();
  if (!username) {
    alert('Please enter a username');
    return;
  }

  // Connect to WebSocket
  ws = new WebSocket('ws://localhost:3000');

  // Handle WebSocket open
  ws.onopen = () => {
    // Send join message
    ws.send(JSON.stringify({ type: 'join', username }));
    // Show chat section, hide join section
    document.getElementById('join-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
  };

  // Handle incoming messages
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const messages = document.getElementById('messages');
    const userList = document.getElementById('user-list');

    switch (data.type) {
      case 'message':
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = `[${data.timestamp}] ${data.username}: ${data.content}`;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight; // Auto-scroll to bottom
        break;

      case 'system':
        const systemDiv = document.createElement('div');
        systemDiv.className = 'system-message';
        systemDiv.textContent = data.content;
        messages.appendChild(systemDiv);
        messages.scrollTop = messages.scrollHeight;
        break;

      case 'users':
        userList.innerHTML = '';
        data.users.forEach((user) => {
          const li = document.createElement('li');
          li.textContent = user;
          userList.appendChild(li);
        });
        break;
    }
  };

  // Handle WebSocket errors
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    document.getElementById('messages').textContent = 'Error connecting to server';
  };

  // Handle WebSocket close
  ws.onclose = () => {
    const messages = document.getElementById('messages');
    messages.textContent = 'Disconnected from server';
    document.getElementById('join-section').style.display = 'block';
    document.getElementById('chat-section').style.display = 'block';
  };
}

// Handle form submission
document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('message-input');
  const content = input.value.trim();

  if (content && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'message', content }));
    input.value = ''; // Reset input field after sending
  }
});


function getTime() {

        const time = document.getElementById("head-1");
time.innerHTML = Date();

setTimeout(getTime, 1000);


}

getTime();


function greet() {

    const greeting_heading = document.getElementById("greeting-heading");

    const current_time = new Date().getHours();
;
if( (current_time >= 0) && (current_time < 12) ) {


    greeting_heading.innerHTML = "Good morning! Welcome to Emmanuel's Chat Room.";

}else if( (current_time >= 12) && (current_time <= 15) ) {

   
   greeting_heading.innerHTML = "Good afternoon! Welcome to Emmanuel's Chat Room."; 


}else{

    greeting_heading.innerHTML = "Good evening! Welcome to Emmanuel's Chat Room.";

}


}

greet();





const textElement = document.querySelector(".fade-text");

const texts = [ 

    "Welcome to Emmanuel's Chat Room!", 
    "From Emmanuel Chigemezu, The Guru Behind the Code",
    "Connect, Chat and have fun!"
    

];

let index = 0;


function changeText() {

    textElement.textContent = texts[index];

    index = (index + 1) % texts.length;


}

changeText();

setInterval(changeText, 3000);



const head3 = document.querySelector("h3");

head3.innerHTML = "Online:";