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
        op -= 10 //0.025;
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
    window.scrollTo(0, 1);
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

const pagination = {
  page: 1,
  total_page: 0,
  total_data: 0,
};

const prevButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const pageNumber = document.getElementById("page");

function getGreetingsData() {
  fetch(api_url, {
    headers: {
      "Content-Type": "application/json",
      page: pagination.page,
    },
  })
    .then((response) => response.json()) // Assuming JSON response
    .then((data) => {
      const cotainer = document.getElementById("guest-list-container");
      let strHtml = "";
      data.data.forEach((d) => {
        strHtml += parseContentGreeting(d.name, d.message, d.is_hadir, d.created_at);
      });
      cotainer.innerHTML = strHtml;
      pagination.page = data.pagination.page;
      pagination.total_page = data.pagination.total_page;
      pagination.total_data = data.pagination.total_data;

      pageNumber.innerHTML = pagination.page;
      if (pagination.page == 1) {
        prevButton.classList.add("disabled");
      } else {
        prevButton.classList.remove("disabled");
      }
      if (pagination.page >= pagination.total_page) {
        nextButton.classList.add("disabled");
      } else {
        nextButton.classList.remove("disabled");
      }
    })
    .catch((error) => {
      console.error("Error fetching API data", error);
    });
}

// Time Remains
const parseTimeAgo = (time) => {
  const d = new Date(time).getTime();
  const now = new Date().getTime();
  const diff = (now - d) / 1000;

  const years = Math.floor(diff / 31536000);
  const months = Math.floor(diff / 2592000);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);

  // console.log(years, months, days, hours, minutes, seconds);

  if (minutes <= 0) {
    return `${seconds} Detik yang lalu`;
  } else if (hours <= 0) {
    return `${minutes} Menit yang lalu`;
  } else if (days <= 0) {
    return `${hours} Jam yang lalu`;
  } else if (months <= 0) {
    return `${days} Hari yang lalu`;
  } else if (years <= 0) {
    return `${months} Bulan yang lalu`;
  } else {
    return `${years} Tahun yang lalu`;
  }
}

// Content Comment
const parseContentGreeting = (name, message, isHadir, date) => {
  let strHtml = "";
  strHtml += `
    <div class="shadow p-3 mb-3 rounded">
    <div
      class="flex-wrap justify-content-between align-items-center"
      id="apiData1"
    >
    <!-- Name -->
    <span class="text-truncate m-0 p-0 gs-c" id="span-one">${name}</span>
    <!-- Status -->
      <span class="text-truncate m-0 p-0 gs-c" id="span-two">${isHadir ? '<i class="fa-solid fa-circle-check text-success"></i>' : '<i class="fa-solid fa-circle-xmark text-danger"></i>'}</span>
    </div>
    <div
      class="d-flex flex-wrap justify-content-between align-items-center"
      id="apiData2"
    >
      <!-- Message -->
      <span class="m-0 p-0 gs-c" id="span-three">${message}</span>
      <!-- Timestamp -->
      <span class="col-12 gs-c" id="span-four">${parseTimeAgo(date)}</span>
    </div>
    </div>
    `;
  return strHtml;
}

// POST
document.getElementById("send-msg").addEventListener("click", () => {
  const formName = document.getElementById("form-name");
  const formAttend = document.getElementById("form-attend");
  const formMessage = document.getElementById("form-message");
  // Data to be sent in the POST request
  const postData = {
    // Your POST data properties here
    name: formName.value,
    is_hadir: formAttend.value == "1" ? true : false,
    message: formMessage.value,
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
      formName.value = "";
      formAttend.value = "";
      formMessage.value = "";
      getGreetingsData();
    })
    .catch((error) => {
      console.error("Error sending or receiving API data", error);
    });
});

function checkInput() {
  const formName = document.getElementById("form-name");
  const formAttend = document.getElementById("form-attend");
  const formMessage = document.getElementById("form-message");

  if (
    formName.value == "" ||
    formAttend.value == "" ||
    formMessage.value == "" ||
    formAttend.value == "0"
  ) {
    document.getElementById("send-msg").disabled = true;
  } else {
    document.getElementById("send-msg").disabled = false;
  }
}

function paginationNext() {
  if (pagination.page >= pagination.total_page) return;
  pagination.page += 1;
  getGreetingsData();
}

function paginationPrevious() {
  if (pagination.page <= 1) return;
  pagination.page -= 1;
  getGreetingsData();
}

document.addEventListener("DOMContentLoaded", () => {
  const formName = document.getElementById("form-name");
  const formAttend = document.getElementById("form-attend");
  const formMessage = document.getElementById("form-message");

  getGreetingsData();

  nextButton.addEventListener("click", () => {
    paginationNext();
  });
  prevButton.addEventListener("click", () => {
    paginationPrevious();
  });

  formName.addEventListener("keyup", () => {
    checkInput();
  });
  formAttend.addEventListener("change", () => {
    checkInput();
  });
  formMessage.addEventListener("keyup", () => {
    checkInput();
  });
});
