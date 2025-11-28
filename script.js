// Utility: throttle resize events for canvas
const debounce = (fn, delay = 200) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

// Navigation interactions
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".site-nav");
const navClose = document.querySelector(".nav-close");

const setNavState = (open) => {
  navMenu.classList.toggle("open", open);
  navToggle.classList.toggle("active", open);
  document.body.classList.toggle("nav-open", open);
};

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("open");
  setNavState(!isOpen);
});

navClose.addEventListener("click", () => setNavState(false));

navMenu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => setNavState(false))
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavState(false);
});

navMenu.addEventListener("click", (event) => {
  if (event.target === navMenu) setNavState(false);
});

// Active link indicator
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const navLink = document.querySelector(`.site-nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        document
          .querySelectorAll(".site-nav a")
          .forEach((link) => link.classList.remove("active"));
        navLink?.classList.add("active");
      }
    });
  },
  {
    threshold: 0.5,
  }
);

sections.forEach((section) => observer.observe(section));

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Prevent default contact form submission for demo
document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message relayed. Expect a follow-up shortly.");
});

// Ribbon canvas animation
const canvas = document.getElementById("ribbonCanvas");
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
};

const ribbons = Array.from({ length: 3 }).map((_, idx) => ({
  offset: Math.random() * Math.PI * 2,
  speed: 0.4 + Math.random() * 0.3,
  colorStops:
    idx === 0
      ? ["#63f5ff", "#8b5cf6"]
      : idx === 1
      ? ["#ff92e0", "#63f5ff"]
      : ["#ffd86f", "#63f5ff"],
}));

const draw = (time) => {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.globalAlpha = 0.85;

  ribbons.forEach((ribbon, idx) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, ribbon.colorStops[0]);
    gradient.addColorStop(1, ribbon.colorStops[1]);

    ctx.lineWidth = 90 - idx * 20;
    ctx.strokeStyle = gradient;
    ctx.lineCap = "round";
    ctx.beginPath();

    const amplitude = 60 + idx * 20;
    const frequency = 0.002 + idx * 0.0006;
    const offset = ribbon.offset + time * 0.0004 * ribbon.speed;

    for (let x = 0; x <= width; x += 20) {
      const y =
        height / 2 +
        Math.sin(x * frequency + offset) * amplitude +
        Math.cos(x * frequency * 0.3 + offset) * (amplitude / 3);
      ctx.lineTo(x / window.devicePixelRatio, y / window.devicePixelRatio);
    }

    ctx.stroke();
  });

  ctx.restore();
  requestAnimationFrame(draw);
};

resizeCanvas();
requestAnimationFrame(draw);
window.addEventListener("resize", debounce(resizeCanvas, 150));

