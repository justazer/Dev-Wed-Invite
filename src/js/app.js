// Button
var animateButton = function (e) {
  e.preventDefault;

  //Reset Animation
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

const pagination = {
  page: 1,
  total_page: 0,
  total_data: 0,
};

const prevButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const pageNumber = document.getElementById("page");

let swiperInstance;

// Utily
const util = (() => {
  const opacity = (nama) => {
    let nm = document.getElementById(nama);
    let op = parseInt(nm.style.opacity);
    let clear = null;

    clear = setInterval(() => {
      if (op >= 0) {
        nm.style.opacity = op.toString();
        op -= 10; //0.025;
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

  // Get Guest Name From URL Parameter (?to=Nama)
  const urlParams = new URLSearchParams(window.location.search);
  const tamu = urlParams.get('to');
  if (tamu) {
    document.getElementById('guest-name').innerText = tamu;
    const formName = document.getElementById('form-name');
    if (formName) {
      formName.value = tamu;
    }
  }

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
    const timerElement = document.getElementById("tampilan-waktu");
    let countDownDate = new Date(
      timerElement.getAttribute("time-data").replace(" ", "T")
    ).getTime();

    const x = setInterval(() => {
      let now = new Date().getTime();
      let distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(x);
        timerElement.innerHTML = `<h5 class="m-0 py-1">Acara Berlangsung</h5>`;
        return;
      }

      document.getElementById("hari").innerText = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );
      document.getElementById("jam").innerText = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      document.getElementById("menit").innerText = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      document.getElementById("detik").innerText = Math.floor(
        (distance % (1000 * 60)) / 1000
      );
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

  //COMMENT
  let GUEST_DATA = [];

  async function getListMessage() {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `https://api-asarez.arulajeh.id/list?page=${pagination.page}&limit=1`,
        requestOptions
      )
        .then((response) => response.json())
        .catch((error) => console.error(error));
      pagination.total_page = response.totalPages;
      pagination.total_data = response.total;
      console.log(response);
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching guest messages:", error);
      return [];
    }
  }

  async function loadGuestMessages() {
    const guestList = await getListMessage();

    // add class disabled to prevButton if on first page
    if (pagination.page <= 1) {
      prevButton.classList.add("disabled");
    } else {
      prevButton.classList.remove("disabled");
    }

    // add class disabled to nextButton if on last page
    if (pagination.page >= pagination.total_page) {
      nextButton.classList.add("disabled");
    } else {
      nextButton.classList.remove("disabled");
    }
    pageNumber.innerText = `Page ${pagination.page} of ${pagination.total_page}`;

    GUEST_DATA = guestList.map((item) => {
      return {
        nama: item.name,
        status: item.isAttend ? "Hadir" : "Tidak Hadir",
        pesan: item.message,
        waktu: parseTimeAgo(item.createdAt),
      };
    });
    const container = document.getElementById("guest-list-container");

    //Clear container
    container.innerHTML = "";

    // GUEST_DATA / API_URL
    if (GUEST_DATA.length > 0) {
      const item = GUEST_DATA[0];
      const messageCard = `
            <div class="mb-0">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="fw-bold text-truncate brown-object" style="max-width: 70%;">${item.nama}</span>
                    <span class="badge ${item.status === "Hadir" ? "bg-success" : "bg-secondary"} small">
                        ${item.status}
                    </span>
                </div>
                <div class="mb-2">
                    <div class="p-2 bg-white rounded-3 border-start border-4 border-primary shadow-sm">
                        <span style="font-style: italic; font-size: 0.9rem;" class="text-secondary brown-object">
                            "${item.pesan}"
                        </span>
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <span class="text-muted brown-object" style="font-size: 0.7rem;">
                        ${item.waktu}
                    </span>
                </div>
            </div>
        `;
      container.innerHTML = messageCard;
    } else {
      container.innerHTML = `<div class="text-center text-muted">Belum ada ucapan</div>`;
    }
  }

  //ANIMATION
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

  const open = async (button) => {
    button.disabled = true;

    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }

    document.querySelector("body").style.overflowY = "hidden";
    audio.play();
    opacity("welcome");
    document.getElementById("music-button").style.display = "block";
    timer();

    // Initialize Swiper
    swiperInstance = new Swiper(".mySwiper", {
      direction: "vertical",
      mousewheel: {
        thresholdDelta: 50,
        sensitivity: 1,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      on: {
        slideChange: function () {
          // Update active nav link
          const index = this.activeIndex;
          const navLinks = document.querySelectorAll('.bottom-nav .nav-link');

          // Map slides to nav indices
          const slideToNavMap = {
            0: 0, // Home
            1: 1, // Firman Allah
            2: 1, // Mempelai -> Firman Allah
            3: 2, // Tanggal
            4: 3, // Galeri
            5: 4, // Gift
            6: 5, // Ucapan
            7: 5  // Footer -> Ucapan
          };

          const navIndex = slideToNavMap[index];

          navLinks.forEach((link, i) => {
            if (i === navIndex) link.classList.add('active');
            else link.classList.remove('active');
          });
        },
        touchStart: function (swiper, e) {
          const touch = e.touches ? e.touches[0] : e;
          this.touchStartX = touch.clientX;
          this.touchStartY = touch.clientY;
        },
        touchEnd: function (swiper, e) {
          if (!this.touchStartX || !this.touchStartY) return;

          const touch = e.changedTouches ? e.changedTouches[0] : e;
          const touchEndX = touch.clientX;
          const touchEndY = touch.clientY;

          const diffX = this.touchStartX - touchEndX;
          const diffY = this.touchStartY - touchEndY;

          // Check if the touch target is inside the gallery carousel
          const isGallery = e.target.closest('#carousel-foto-satu');
          if (isGallery) return;

          // Threshold to detect as horizontal swipe (e.g., 30px)
          const threshold = 30;

          // Check if it's more of a horizontal movement than vertical
          if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > threshold) {
              // Swipe Right to Left -> Next Slide
              this.slideNext();
            } else if (diffX < -threshold) {
              // Swipe Left to Right -> Previous Slide
              this.slidePrev();
            }
          }

          this.touchStartX = null;
          this.touchStartY = null;
        }
      }
    });

    // Update Bottom Nav to use Swiper
    const navIndices = {
      '#home': 0,
      '#mempelai': 2,
      '#tanggal': 3,
      '#galeri': 4,
      '#gift': 5,
      '#ucapan': 6
    };

    document.querySelectorAll('.bottom-nav a').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        const slideIndex = navIndices[target];
        if (slideIndex !== undefined && swiperInstance) {
          swiperInstance.slideTo(slideIndex);
        }
      });
    });

    await confetti({
      origin: { y: 0.8 },
      zIndex: 1057,
    });
    await animation();
  };

  const show = () => {
    loadGuestMessages();
    opacity("loading");
    window.scrollTo(0, 1);
  };

  return {
    open,
    modal,
    music,
    salin,
    escapeHtml,
    opacity,
    show,
    loadGuestMessages,
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
    info.innerText = `Now Loading... (${loaded}/${total}) [${parseInt(
      bar.style.width
    ).toFixed(0)}%]`;

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
      audio.src = document
        .getElementById("music-button")
        .getAttribute("data-url");
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
};

// POST
document.getElementById("send-msg").addEventListener("click", () => {
  document.getElementById("send-msg").disabled = true;
  const formName = document.getElementById("form-name");
  const formAttend = document.getElementById("form-attend");
  const formMessage = document.getElementById("form-message");
  // Data to be sent in the POST request
  const postData = {
    // Your POST data properties here
    name: formName.value,
    isAttend: formAttend.value == "1" ? true : false,
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

  fetch("https://api-asarez.arulajeh.id/submit", requestOptions)
    .then((response) => response.json()) // Assuming JSON response
    .then((data) => {
      formName.value = "";
      formAttend.value = "0";
      formMessage.value = "";
      util.loadGuestMessages();
      document.getElementById("send-msg").disabled = false;
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
  util.loadGuestMessages();
}

function paginationPrevious() {
  if (pagination.page <= 1) return;
  pagination.page -= 1;
  util.loadGuestMessages();
}

document.addEventListener("DOMContentLoaded", () => {
  const formName = document.getElementById("form-name");
  const formAttend = document.getElementById("form-attend");
  const formMessage = document.getElementById("form-message");

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

  // Initial check for autofilled name
  checkInput();
});
