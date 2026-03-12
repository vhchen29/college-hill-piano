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

// --- Manually assign each day's sequence here ---
const calendar = {
    1:  new DaySequence(1,  [1, 2, 3, 4, 5, 6, 7, 8])
    // ... continue for days 11-31
};

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
        document.querySelector(`.r${i}`).classList.remove("on");
    }
    // turn on the matching one
    document.querySelector(`.r${num}`).classList.add("on");
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



for (let i = 1; i <=31; i++){
    const btn = document.createElement("button");
    btn.classList.add("day-btn");
    btn.textContent = i;

    btn.addEventListener("click", () => {
    ctx.resume(); 
      if (isPlaying) return;
      isPlaying = true;

      document.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      const seq = calendar[i];
      if (!seq) { isPlaying = false; return; }

    //   document.getElementById("status").textContent = `DAY ${i} — PLAYING`;
    //   updateSeqDisplay(seq.sequence, -1);

      seq.play(
        (num) => {
          lightUp(num);
          playNote(notes[num]);
        //   updateSeqDisplay(seq.sequence, stepIndex);
          btn.classList.add("playing");
          setTimeout(() => btn.classList.remove("playing"), 400);
        },
        () => {
          isPlaying = false;
          for (let i = 1; i <= 8; i++) {
            document.querySelector(`.r${i}`).classList.remove("on"); // deactivate last key
            }
        btn.classList.remove("selected"); // deselect the day button
        //   document.getElementById("status").textContent = `DAY ${i} — DONE`;
        //   document.querySelectorAll(".seq-dot").forEach(d => d.classList.remove("on"));
        }
      );
    });

    if(i <= 16){
        col1.appendChild(btn);
    } else{
        col2.appendChild(btn);
    }



}

buttonBox.appendChild(col1);
buttonBox.appendChild(col2);


