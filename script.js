const greetingCard = document.getElementById("greetingCard");
const bgMusic = document.getElementById("bgMusic");
const cardScene = document.querySelector(".card-scene");
const cardObject = document.querySelector(".card-object");
let isCardOpen = false;
let audioStarted = false;

// === INTERACTION LOGIC ===
greetingCard.addEventListener("click", () => {
  toggleCard();
  playAudio();
});

// Play audio on first interaction
document.body.addEventListener("click", playAudio, { once: true });

function toggleCard() {
  isCardOpen = !isCardOpen;
  cardObject.classList.toggle("opened", isCardOpen);

  // REMOVED: Cinema Spotlight Toggle
  // document.body.classList.toggle('spotlight-mode', isCardOpen);

  if (isCardOpen) {
    document.body.classList.add("celebrating");
    fireConfetti();
    startMagicalTyping();
  }

  // Mobile scroll
  if (isCardOpen && window.innerWidth < 800) {
    setTimeout(() => {
      greetingCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1200);
  }
}

function playAudio() {
  if (audioStarted) return;
  if (bgMusic) {
    bgMusic.volume = 0.5;
    bgMusic
      .play()
      .then(() => {
        audioStarted = true;
      })
      .catch((e) => console.log("Audio play failed"));
  }
}

// === 1. CONFETTI BLAST ===
function fireConfetti() {
  const colors = ["#C5A065", "#E5CDA2", "#D4A5A5", "#8A9A7B", "#C4797A"];
  for (let i = 0; i < 150; i++) {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    particles.push(
      new Particle(
        x,
        y,
        colors[Math.floor(Math.random() * colors.length)],
        true
      )
    );
  }
}

// === 2. MAGICAL HANDWRITING ===
const titleEl = document.querySelector(".message-title");
const namesEl = document.querySelector(".message-names");
const blessingEl = document.querySelector(".message-blessing");
const signatureArea = document.querySelector(".signature-area");

// TEXT CONTENT
const texts = {
  title: "Happy\u00A032nd\u00A0Wedding\u00A0Anniversary",
  names: "Mama\u00A0aur\u00A0Papa",
  blessing:
    "Allah aap dono ko hamesha khush aur sehatmand rakhe. Aap dono ki jodi hamesha salamat rahe. Ameen! ❤️",
};

let typewriterStarted = false;

function startMagicalTyping() {
  if (typewriterStarted) return;
  typewriterStarted = true;

  // Clear content visually
  titleEl.innerHTML = "";
  namesEl.innerHTML = "";
  blessingEl.innerHTML = "";

  // Start Sequence
  setTimeout(() => {
    typeWriter(titleEl, texts.title, () => {
      setTimeout(() => {
        typeWriter(namesEl, texts.names, () => {
          setTimeout(() => {
            typeWriter(blessingEl, texts.blessing, () => {
              if (signatureArea) signatureArea.classList.add("visible");
            });
          }, 500);
        });
      }, 300);
    });
  }, 1500);
}

function typeWriter(element, text, callback) {
  let i = 0;
  let displayText = "";
  element.style.borderRight = "2px solid #C5A065";

  function type() {
    if (i < text.length) {
      const char = text.charAt(i);
      // Convert spaces to &nbsp; to preserve them in HTML
      if (char === " ") {
        displayText += "&nbsp;";
      } else if (char === "\n") {
        displayText += "<br>";
      } else {
        displayText += char;
      }
      element.innerHTML = displayText;
      i++;
      const speed = Math.random() * 30 + 30;
      setTimeout(type, speed);
    } else {
      element.style.borderRight = "none";
      if (callback) callback();
    }
  }
  type();
}

// === 3. 3D MOUSE PARALLAX ===
document.addEventListener("mousemove", (e) => {
  if (window.innerWidth < 800) return;
  const x = (window.innerWidth / 2 - e.pageX) / 25;
  const y = (window.innerHeight / 2 - e.pageY) / 25;
  if (!isCardOpen) {
    cardScene.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  } else {
    cardScene.style.transform = `rotateY(${x / 2}deg) rotateX(${y / 2}deg)`;
  }
});

// === GOLDEN DUST ===
const canvas = document.getElementById("gold-dust");
const ctx = canvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
class Particle {
  constructor(startX, startY, color, isExplosion = false) {
    this.reset(startX, startY, color, isExplosion);
  }
  reset(startX, startY, color, isExplosion) {
    if (isExplosion) {
      this.x = startX;
      this.y = startY;
      this.size = Math.random() * 5 + 2;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 15 + 2;
      this.speedX = Math.cos(angle) * velocity;
      this.speedY = Math.sin(angle) * velocity;
      this.gravity = 0.5;
      this.drag = 0.96;
      this.opacity = 1;
      this.fadeSpeed = 0.01;
      this.color = color;
      this.isExplosion = true;
    } else {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.5 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = 0.005;
      this.color = "229, 205, 162";
      this.isExplosion = false;
    }
  }
  update() {
    if (this.isExplosion) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.speedX *= this.drag;
      this.speedY *= this.drag;
      this.opacity -= this.fadeSpeed;
    } else {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
    }
  }
  draw() {
    if (this.opacity <= 0) return;
    ctx.fillStyle = this.isExplosion
      ? this.color
      : `rgba(${this.color}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
function initParticles() {
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  animateParticles();
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => !p.isExplosion || p.opacity > 0);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
initParticles();
