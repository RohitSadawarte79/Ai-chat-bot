const socket = io();
const speechButton = document.getElementById('speak-button');


// define the speech recognition object (this was missing) --
//check if the browser support the api

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition ;

if(!SpeechRecognition) {
    console.error("Your browser does not support the Web speech API. Try Chrome or Edge.");
    speechButton.textContent = "Browser Not Supported";
    speechButton.disabled = true;
}

//create and configure the recognistion instance 
 const recognition = new SpeechRecognition();
 recognition.lang = 'en-US'; // set the language
 recognition.interimResults = false // we only want final results
 recognition.maxAlternatives = 1; // Get only the top one result


 // -2 . Define the recognition event handlers --
 

 recognition.onresult = (event) => {
    console.log(event);
    console.log(event.results);
    const speechResult = event.results[0][0].transcript;
    console.log("You said: " + speechResult);
    console.log("Confidence: " + event.results[0][0].confidence);
    socket.emit('chat message', speechResult);
 };


 // add handlers for other events
 recognition.onstart = () => {
    console.log("Voice recognition started. Try speaking...");
    speechButton.textContent = 'Listening...';
 };
 
 recognition.onspeechend = () => {
    console.log("Voice rocognition stopped.");
    recognition.stop();
    speechButton.textContent = 'Talk';
 };

 recognition.onerror = (event) => {
    console.error("Speech recognition error: ", event.error);
    speechButton.textContent = 'Talk';
 }


 // 3 Define the socket.io 'bot reply' handler

 socket.on('bot reply', (speechText) => {
    console.log("Received bot reply:", speechText);
    const utterance = new SpeechSynthesisUtterance(speechText);
    speechSynthesis.speak(utterance);
 });


 // 4 Add the button click listner 

 speechButton.addEventListener('click', () => {
    console.log('Button clicked, starting recognition');
    recognition.start(); //This is the command to start listening
 })