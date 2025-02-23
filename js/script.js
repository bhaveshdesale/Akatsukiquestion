// const INITIAL_PASSWORD = 'kira';
// const FINAL_PASSWORD = 'sharingan';
// let lockoutEndTime = 0;
// let wrongAttempts = 0;


// const errorSound = new Audio('https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3');
// const successSound = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-02.mp3');


// window.history.pushState(null, '', window.location.href);
// window.addEventListener('popstate', function(event) {
//     window.history.pushState(null, '', window.location.href);
// });

// function playSound(sound) {
//     sound.volume = 0.1;
//     sound.play().catch(e => console.log('Sound play prevented'));
// }

// function checkPassword() {
//     const input = document.getElementById('passwordInput');
//     const errorMessage = document.getElementById('errorMessage');
    
//     if (input.value === INITIAL_PASSWORD) {
//         playSound(successSound);
//         document.getElementById('passwordPage').classList.add('hidden');
//         document.getElementById('quizPage').classList.remove('hidden');
//         errorMessage.textContent = '';
//     } else {
//         playSound(errorSound);
//         errorMessage.textContent = 'Incorrect password. Try again, shinobi.';
//         input.value = '';
//         input.classList.add('shake');
//         setTimeout(() => input.classList.remove('shake'), 500);
//     }
// }

// function checkAnswer(option) {
//     if (Date.now() < lockoutEndTime) {
//         return;
//     }

//     const correctAnswer = 'B';
//     if (option === correctAnswer) {
//         playSound(successSound);
//         document.getElementById('quizPage').classList.add('hidden');
//         document.getElementById('successPage').classList.remove('hidden');
//     } else {
//         playSound(errorSound);
//         wrongAttempts++;
//         const lockoutDuration = wrongAttempts === 1 ? 60000 : 300000;
//         lockoutEndTime = Date.now() + lockoutDuration;
        
//         const buttons = document.querySelectorAll('.options button');
//         buttons.forEach(button => button.disabled = true);
        
//         document.getElementById('timer').classList.remove('hidden');
//         startTimer(lockoutDuration);
//     }
// }

// function startTimer(duration) {
//     const timerElement = document.getElementById('timeLeft');
//     const buttons = document.querySelectorAll('.options button');
    
//     const updateTimer = () => {
//         const now = Date.now();
//         const timeLeft = Math.max(0, lockoutEndTime - now);
        
//         if (timeLeft === 0) {
//             timerElement.parentElement.classList.add('hidden');
//             buttons.forEach(button => button.disabled = false);
//             return;
//         }
        
//         const seconds = Math.ceil(timeLeft / 1000);
//         timerElement.textContent = `${seconds} seconds`;
//         setTimeout(updateTimer, 1000);
//     };
    
//     updateTimer();
// }

// function restartChallenge() {
    
//     lockoutEndTime = 0;
//     wrongAttempts = 0;
//     document.getElementById('passwordInput').value = '';
//     document.getElementById('errorMessage').textContent = '';
//     document.getElementById('timer').classList.add('hidden');
    
    
//     document.getElementById('passwordPage').classList.remove('hidden');
//     document.getElementById('quizPage').classList.add('hidden');
//     document.getElementById('successPage').classList.add('hidden');
  
//     const buttons = document.querySelectorAll('.options button');
//     buttons.forEach(button => button.disabled = false);
// }

// document.getElementById('passwordInput').addEventListener('keypress', function(e) {
//     if (e.key === 'Enter') {
//         checkPassword();
//     }
// });

// document.querySelectorAll('button').forEach(button => {
//     button.addEventListener('click', function() {
//         this.classList.add('clicked');
//         setTimeout(() => this.classList.remove('clicked'), 200);
//     });
// });
const INITIAL_PASSWORD = 'kira';
const FINAL_PASSWORD = 'sharingan';
let lockoutEndTime = localStorage.getItem('lockoutEndTime') ? parseInt(localStorage.getItem('lockoutEndTime')) : 0;
let wrongAttempts = localStorage.getItem('wrongAttempts') ? parseInt(localStorage.getItem('wrongAttempts')) : 0;

const errorSound = new Audio('https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3');
const successSound = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-02.mp3');

function playSound(sound) {
    sound.volume = 0.1;
    sound.play().catch(e => console.log('Sound play prevented'));
}

// ✅ Function to Save & Load Page State
function savePageState(state) {
    localStorage.setItem('pageState', state);
}
function loadPageState() {
    return localStorage.getItem('pageState') || 'passwordPage'; // Default to first page
}

// ✅ Function to Show Correct Page on Load
function showPage(pageId) {
    document.getElementById('passwordPage').classList.add('hidden');
    document.getElementById('quizPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    
    document.getElementById(pageId).classList.remove('hidden');
    savePageState(pageId);
}

// ✅ Load the last saved page state
window.onload = function() {
    let lastPage = loadPageState();
    showPage(lastPage);

    // If locked out, continue the timer
    if (Date.now() < lockoutEndTime) {
        document.getElementById('timer').classList.remove('hidden');
        startTimer(lockoutEndTime - Date.now());
    }
};

function checkPassword() {
    const input = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    
    if (input.value === INITIAL_PASSWORD) {
        playSound(successSound);
        showPage('quizPage');
    } else {
        playSound(errorSound);
        errorMessage.textContent = 'Incorrect password. Try again, shinobi.';
        input.value = '';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }
}

function checkAnswer(option) {
    if (Date.now() < lockoutEndTime) {
        return;
    }

    const correctAnswer = 'B';
    if (option === correctAnswer) {
        playSound(successSound);
        showPage('successPage');
    } else {
        playSound(errorSound);
        wrongAttempts++;
        localStorage.setItem('wrongAttempts', wrongAttempts);

        const lockoutDuration = wrongAttempts === 1 ? 60000 : 300000;
        lockoutEndTime = Date.now() + lockoutDuration;
        localStorage.setItem('lockoutEndTime', lockoutEndTime);

        const buttons = document.querySelectorAll('.options button');
        buttons.forEach(button => button.disabled = true);

        document.getElementById('timer').classList.remove('hidden');
        startTimer(lockoutDuration);
    }
}

function startTimer(duration) {
    const timerElement = document.getElementById('timeLeft');
    const buttons = document.querySelectorAll('.options button');

    const updateTimer = () => {
        const now = Date.now();
        const timeLeft = Math.max(0, lockoutEndTime - now);

        if (timeLeft === 0) {
            timerElement.parentElement.classList.add('hidden');
            buttons.forEach(button => button.disabled = false);
            return;
        }

        const seconds = Math.ceil(timeLeft / 1000);
        timerElement.textContent = `${seconds} seconds`;
        setTimeout(updateTimer, 1000);
    };

    updateTimer();
}

function restartChallenge() {
    lockoutEndTime = 0;
    wrongAttempts = 0;
    localStorage.removeItem('lockoutEndTime');
    localStorage.removeItem('wrongAttempts');
    localStorage.removeItem('pageState');

    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('timer').classList.add('hidden');

    showPage('passwordPage');

    const buttons = document.querySelectorAll('.options button');
    buttons.forEach(button => button.disabled = false);
}

document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
    });
});
