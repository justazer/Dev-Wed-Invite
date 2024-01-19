// Button
var animateButton = function (e) {
  e.preventDefault;
  //reset animation
  e.target.classList.remove("animate");

  e.target.classList.add("animate");
  setTimeout(function () {
    e.target.classList.remove("animate");
  }, 700);
};

var classname = document.getElementsByClassName("confetti-button");

for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener("click", animateButton, false);
}

// Utily
const util = (() => {
  const opacity = (nama) => {
    let nm = document.getElementById(nama);
    let op = parseInt(nm.style.opacity);
    let clear = null;

    clear = setInterval(() => {
      if (op >= 0) {
        nm.style.opacity = op.toString();
        op -= 0.025;
      } else {
        clearInterval(clear);
        clear = null;
        nm.remove();
        return;
      }
    }, 10);
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Copy Account Number Button
  const salin = (btn, msg = "Tersalin", timeout = 1500) => {
    navigator.clipboard.writeText(btn.getAttribute("data-nomer"));

    let tmp = btn.innerHTML;
    btn.innerHTML = msg;
    btn.disabled = true;

    let clear = null;
    clear = setTimeout(() => {
      btn.innerHTML = tmp;
      btn.disabled = false;
      btn.focus();

      clearTimeout(clear);
      clear = null;
      return;
    }, timeout);
  };

  // Countdown
  const timer = () => {
    let countDownDate = new Date(
      document.getElementById("tampilan-waktu").getAttribute("time-data").replace(" ", "T")
    ).getTime();

    setInterval(() => {
      let distance = Math.abs(countDownDate - new Date().getTime());

      document.getElementById("hari").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
      document.getElementById("jam").innerText = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      document.getElementById("menit").innerText = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      document.getElementById("detik").innerText = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  };

  // Musikkk
  const music = (btn) => {
    if (btn.getAttribute("data-status") !== "true") {
      btn.setAttribute("data-status", "true");
      audio.play();
      btn.innerHTML = '<i class="fa-solid fa-circle-pause spin-button"></i>';
    } else {
      btn.setAttribute("data-status", "false");
      audio.pause();
      btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    }
  };

  // Zoom Photo
  const modal = (img) => {
    document.getElementById("show-modal-image").src = img.src;
    new bootstrap.Modal("#modal-image").show();
  };

  const tamu = () => {
    let name = new URLSearchParams(window.location.search).get("to");

    if (!name) {
      document.getElementById("nama-tamu").remove();
      return;
    }

    let div = document.createElement("div");
    div.classList.add("m-2");
    div.innerHTML = `<p class="mt-0 mb-1 mx-0 p-0 text-light">Kepada Yth Bapak/Ibu/Saudara/i</p><h2 class="text-light">${escapeHtml(
      name
    )}</h2>`;

    document.getElementById("form-name").value = name;
    document.getElementById("nama-tamu").appendChild(div);
  };

  const animation = async () => {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    let randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    (async function frame() {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));

      skew = Math.max(0.8, skew - 0.001);

      await confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: Math.random() * skew - 0.2,
        },
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
        shapes: ["heart"],
        gravity: randomInRange(0.5, 1),
        scalar: randomInRange(1, 2),
        drift: randomInRange(-0.5, 0.5),
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const buka = async (button) => {
    button.disabled = true;
    document.querySelector("body").style.overflowY = "scroll";
    AOS.init();
    audio.play();
    opacity("welcome");
    document.getElementById("music-button").style.display = "block";
    timer();

    await confetti({
      origin: { y: 0.8 },
      zIndex: 1057,
    });
    // await session.check();
    await animation();
  };

  const show = () => {
    tamu();
    opacity("loading");
    window.scrollTo(0, 0);
  };

  return {
    buka,
    tamu,
    modal,
    music,
    salin,
    escapeHtml,
    opacity,
    show,
  };
})();

// Loading Progress
const progress = (() => {
  const assets = document.querySelectorAll("img");
  const info = document.getElementById("progress-info");
  const bar = document.getElementById("bar");

  let total = assets.length;
  let loaded = 0;

  const progress = () => {
    loaded += 1;

    bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
    info.innerText = `Now Loading... (${loaded}/${total}) [${parseInt(bar.style.width).toFixed(
      0
    )}%]`;

    if (loaded == total) {
      util.show();
    }
  };

  assets.forEach((asset) => {
    if (asset.complete && asset.naturalWidth !== 0) {
      progress();
    } else {
      asset.addEventListener("load", () => progress());
    }
  });
})();

// MUSIKKK
const audio = (() => {
  let audio = null;

  const singleton = () => {
    if (!audio) {
      audio = new Audio();
      audio.src = document.getElementById("music-button").getAttribute("data-url");
      audio.load();
      audio.currentTime = 0;
      audio.autoplay = true;
      audio.muted = false;
      audio.loop = true;
      audio.volume = 1;
    }

    return audio;
  };

  return {
    play: () => singleton().play(),
    pause: () => singleton().pause(),
  };
})();

// API OM Sahrul
const api_url = "https://arulajeh.my.id/api/greetings";

function getGreetingsData() {
  fetch(api_url)
    .then((response) => response.json()) // Assuming JSON response
    .then((data) => {
      // Update the HTML content with the fetched data
      const d = data.data[0];
      console.log(d);
      const nameContainer = document.getElementById("span-one");
      nameContainer.innerHTML = `${d.name}`; // Replace with actual property from API response
      const hadirContainer = document.getElementById("span-two");
      hadirContainer.innerHTML = d.is_hadir ? "Hadir" : "Tidak Hadir";
      const msgContainer = document.getElementById("span-three");
      msgContainer.innerHTML = `${d.message}`;
      const dateContainer = document.getElementById("span-four");
      dateContainer.innerHTML = `${moment(d.created_at).format("DD-MM-YYYY HH:mm:ss")}`;
    })
    .catch((error) => {
      console.error("Error fetching API data", error);
    });
}

getGreetingsData();

// POST
document.getElementById("send-msg").addEventListener("click", () => {
  const formName = document.getElementById("form-name").value;
  const formAttend = document.getElementById("form-attend").value;
  const formMessage = document.getElementById("form-message").value;
  // Data to be sent in the POST request
  const postData = {
    // Your POST data properties here
    name: formName,
    is_hadir: formAttend == "1" ? true : false,
    message: formMessage,
  };

  // Configuration for the POST request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add any required headers here
    },
    body: JSON.stringify(postData),
  };

  fetch(api_url, requestOptions)
    .then((response) => response.json()) // Assuming JSON response
    .then((data) => {
      //   console.log(data);
      getGreetingsData();
    })
    .catch((error) => {
      console.error("Error sending or receiving API data", error);
    });
});
