// generate background street lines
const container = document.getElementById("street-lines");

for (let i = 0; i < 7; i++) {
  const rect = document.createElement("div");
  rect.classList.add("street-rectangle");
  container.appendChild(rect);
}

//data storage 
class DaySequence {
    constructor(day, sequence) {
        this.day = day;
        this.sequence = sequence; // array of 8 numbers, each 1-8
    }

    play(onStep, onDone) {
    this.sequence.forEach((num, i) => {
        setTimeout(() => {
            onStep(num, i);
            if (i === this.sequence.length - 1 && onDone) {
                setTimeout(onDone, 400);
            }
        }, i * 400);
    });
}
}

// each day's sequence here ---
const calendar = {
    1:  new DaySequence(1,  [3, 8, 3, 1, 6, 3]),
    2: new DaySequence(2, [3, 6, 5, 6, 3, 2, 4, 5, 3]),
    3: new DaySequence(3, [3, 7, 3, 2, 8, 3]),
    4: new DaySequence(4, [3, 5, 4, 2, 3, 1, 3, 4, 3]),
    5: new DaySequence(5, [3, 7, 3, 1, 2, 3]),
    6: new DaySequence(6, [3, 1, 2, 3]),
    7: new DaySequence(7, []),
    8: new DaySequence(8, [3, 4, 3, 8, 5, 2, 5, 3]),
    9: new DaySequence(9, [3, 5, 3, 2, 1, 6, 3]),
    10: new DaySequence(10, [3, 7, 3, 8, 3]),
    11: new DaySequence(11, [3, 4, 5, 2, 1, 3, 1, 3]),
    12: new DaySequence(12, [3, 6, 4, 1, 3]),
    13: new DaySequence(13, [3, 1, 5, 1, 3]),
    14: new DaySequence(14, [3, 2, 1, 3, 5, 3]),
    15: new DaySequence(15, [3, 5, 3, 6, 3]),
    16: new DaySequence(16, []),
    17: new DaySequence(17, []),
    18: new DaySequence(18, []),
    19: new DaySequence(19, []),
    20: new DaySequence(20, []),
    21: new DaySequence(21, []),
    22: new DaySequence(22, []),
    23: new DaySequence(23, []),
    24: new DaySequence(24, []),
    25: new DaySequence(25, []),
    26: new DaySequence(26, []),
    27: new DaySequence(27, []),
    28: new DaySequence(28, []),
    29: new DaySequence(29, []),
    30: new DaySequence(30, []),
    31: new DaySequence(31, []),        
};
//make it so if the day is empty i just make it gray
//shouldn't be clickable

const notes = {
    1: 261.63, // C4
    2: 293.66, // D4
    3: 329.63, // E4
    4: 349.23, // F4
    5: 392.00, // G4
    6: 440.00, // A4
    7: 493.88, // B4
    8: 523.25  // C5
};

const ctx = new AudioContext();


function playNote(freq) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
}

function lightUp(num) {
    // turn off all keys
    for (let i = 1; i <= 8; i++) {
        document.querySelector(`.r${i}`).classList.remove("lit");
    }
    // turn on the matching one
    document.querySelector(`.r${num}`).classList.add("lit");
}

function onDayClick(day) {
    const seq = calendar[day];
    if (!seq) return;
    seq.play((num) => {
        lightUp(num);
        playNote(notes[num]);
    });
}


let isPlaying = false; 

//generate calendar buttons
const buttonBox = document.getElementById("button-box");

const col1 = document.createElement("div");
const col2 = document.createElement("div");
col1.classList.add("day-column");
col2.classList.add("day-column");


for (let i = 1; i <= 31; i++) {
    const btn = document.createElement("button");
    btn.classList.add("day-btn");
    btn.textContent = i;

    const seq = calendar[i];
    if (!seq || seq.sequence.length === 0) {
        btn.classList.add("deactivated");
    } else {
        btn.addEventListener("click", () => {
            ctx.resume();
            if (isPlaying) return;
            isPlaying = true;

            document.querySelectorAll("button").forEach(b => b.classList.remove("selected"));

            for (let j = 1; j <= 8; j++) {
                document.querySelector(`.r${j}`).classList.remove("on");
                document.querySelector(`.r${j}`).classList.remove("lit");
            }

            btn.classList.add("selected");

            seq.play(
                (num) => {
                    lightUp(num);
                    playNote(notes[num]);
                    btn.classList.add("playing");
                    setTimeout(() => btn.classList.remove("playing"), 400);
                },
                () => {
                    isPlaying = false;

                    for (let j = 1; j <= 8; j++) {
                        document.querySelector(`.r${j}`).classList.remove("lit");
                    }

                    const visited = new Set(seq.sequence);
                    visited.forEach(streetNum => {
                        document.querySelector(`.r${streetNum}`).classList.add("on");
                    });
                }
            );
        });
    } // <-- else closes here

    if (i <= 16) {
        col1.appendChild(btn);
    } else {
        col2.appendChild(btn);
    }
}

// outside the loop
document.addEventListener("click", (e) => {
    if (e.target.closest(".day-btn")) return;

    document.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    for (let i = 1; i <= 8; i++) {
        document.querySelector(`.r${i}`).classList.remove("on");
        document.querySelector(`.r${i}`).classList.remove("lit");
    }
});
// for (let i = 1; i <=31; i++){
//     const btn = document.createElement("button");
//     btn.classList.add("day-btn");
//     btn.textContent = i;

   

//       const seq = calendar[i];
//       if (!seq || seq.sequence.length === 0) { 
//         isPlaying = false; 
//         btn.classList.add("deactivated");
//         btn.deactivated = true;
//     } else{


//          btn.addEventListener("click", () => {
//             ctx.resume(); 
//             if (isPlaying) return;
//             isPlaying = true;

//             document.querySelectorAll("button").forEach(b => b.classList.remove("selected"));

//             for (let i = 1; i <= 8; i++) {
//                 document.querySelector(`.r${i}`).classList.remove("on");
//                 document.querySelector(`.r${i}`).classList.remove("lit");

//                 }

//             btn.classList.add("selected"); 

//         seq.play(
//         (num) => {
//             lightUp(num);
//             playNote(notes[num]);
//             btn.classList.add("playing");
//             setTimeout(() => btn.classList.remove("playing"), 400);
//         },
//         () => {
//             isPlaying = false;

//             for (let i = 1; i <= 8; i++) {
//                 document.querySelector(`.r${i}`).classList.remove("lit");
//             }

//             const visited = new Set(seq.sequence);
//             visited.forEach(streetNum => {
//                 document.querySelector(`.r${streetNum}`).classList.add("on");
//             });
//         });
//         });
//     }

//     if(i <= 16){
//         col1.appendChild(btn);
//     } else{
//         col2.appendChild(btn);
//     }
// }

    
//       document.addEventListener("click", () => {
//         // if (e.target.closest("button")) return;

//         document.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
//         for (let i = 1; i <= 8; i++) {
//             document.querySelector(`.r${i}`).classList.remove("on");
//             document.querySelector(`.r${i}`).classList.remove("lit");

//             }

//     });



buttonBox.appendChild(col1);
buttonBox.appendChild(col2);


