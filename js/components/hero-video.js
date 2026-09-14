// Hero Looping Background Video Component

export class HeroVideo {
  constructor(containerId = "hero-video-container") {
    this.container = document.getElementById(containerId);
    this.videoList = [
      {
        id: "alpine-lake",
        name: "Emerald Alpine Lake",
        tag: "Banff / Glacial Lake",
        icon: "mountain-snow",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/lake.mp4",
        poster: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "alpine-mountains",
        name: "Majestic Alpine Peaks",
        tag: "Swiss Alps / Summits",
        icon: "mountain",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/mountains.mp4",
        poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "tropical-beach",
        name: "Tropical Coastline & Waves",
        tag: "Bali / Coastal Paradise",
        icon: "palmtree",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/beach.mp4",
        poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "ocean-sunset",
        name: "Golden Hour Ocean Sunset",
        tag: "Maldives / Horizon",
        icon: "sunset",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/sunset.mp4",
        poster: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "desert-dunes",
        name: "Golden Desert Dunes Aerial",
        tag: "Sahara / Arabian Dunes",
        icon: "sun",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/desert-overhead.mp4",
        poster: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "forest-canopy",
        name: "Lush Emerald Forest Canopy",
        tag: "Rainforest / Pines",
        icon: "trees",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/trees.mp4",
        poster: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "coral-reef",
        name: "Turquoise Coral Reef Aerial",
        tag: "Oceania / Atoll Reef",
        icon: "waves",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/beach-overhead.mp4",
        poster: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "island-drone",
        name: "Aerial Island Panorama",
        tag: "Polynesia / Island Flight",
        icon: "plane",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/drone.mp4",
        poster: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
      },
      {
        id: "coastal-road",
        name: "Scenic Highway Road Trip",
        tag: "Mountain Pass / Journey",
        icon: "compass",
        src: "https://shotstack-assets.s3.amazonaws.com/footage/road.mp4",
        poster: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
      }
    ];
    this.currentIndex = 0;
    this.isPlaying = true;
    this.isMuted = true;
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }

  render() {
    const currentVideo = this.videoList[this.currentIndex];

    this.container.innerHTML = `
      <div class="relative w-full h-full overflow-hidden select-none">
        <!-- Video Element -->
        <video 
          id="hero-bg-video" 
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          autoplay 
          muted 
          loop 
          playsinline 
          preload="auto"
          poster="${currentVideo.poster}"
        >
          <source src="${currentVideo.src}" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>

        <!-- Dark Gradient Overlay for optimal text legibility -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/45 to-slate-950 pointer-events-none"></div>

        <!-- Scenic Moods Quick Picker Drawer / Popover -->
        <div id="video-scenes-menu" class="hidden absolute bottom-20 right-6 z-30 w-80 max-w-[calc(100vw-3rem)] max-h-96 overflow-y-auto bg-slate-900/95 backdrop-blur-2xl border border-slate-700/70 rounded-2xl p-3 shadow-2xl transition-all animate-in fade-in duration-200">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <i data-lucide="clapperboard" class="w-4 h-4 text-emerald-400"></i>
              <span class="text-xs font-bold text-white tracking-wide uppercase">Scenic Atmosphere (${this.videoList.length})</span>
            </div>
            <button id="btn-close-video-menu" class="text-slate-400 hover:text-white p-1 rounded-md transition-colors" title="Close menu">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <div class="space-y-1.5" id="video-scenes-list">
            ${this.renderScenesList()}
          </div>
        </div>

        <!-- Video Controls Floating Island -->
        <div class="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 sm:gap-2 bg-slate-900/85 backdrop-blur-xl border border-slate-700/70 rounded-full px-2.5 sm:px-3.5 py-1.5 shadow-2xl text-xs text-slate-300">
          
          <!-- Prev Video Button -->
          <button id="btn-prev-video" class="hover:text-emerald-400 p-1.5 rounded-full hover:bg-slate-800/60 transition-all focus:outline-none" title="Previous scenic video">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>

          <!-- Play / Pause -->
          <button id="btn-toggle-video-play" class="hover:text-emerald-400 p-1.5 rounded-full hover:bg-slate-800/60 transition-all focus:outline-none" title="Play / Pause video">
            <i data-lucide="pause" class="w-4 h-4" id="icon-video-play"></i>
          </button>
          
          <span class="h-3 w-px bg-slate-700/80"></span>

          <!-- Mute / Unmute -->
          <button id="btn-toggle-video-mute" class="hover:text-emerald-400 p-1.5 rounded-full hover:bg-slate-800/60 transition-all focus:outline-none" title="Mute / Unmute audio">
            <i data-lucide="volume-x" class="w-4 h-4" id="icon-video-mute"></i>
          </button>

          <span class="h-3 w-px bg-slate-700/80"></span>

          <!-- Scenic Scene Selector Pill & Trigger -->
          <button id="btn-toggle-video-menu" class="flex items-center gap-1.5 hover:text-emerald-400 px-2 py-1 rounded-full hover:bg-slate-800/60 transition-all focus:outline-none group" title="Choose scenic landscape">
            <i data-lucide="film" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span class="text-[11px] font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors hidden sm:inline" id="label-video-name">
              ${currentVideo.name}
            </span>
            <span class="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20" id="label-video-counter">
              ${this.currentIndex + 1}/${this.videoList.length}
            </span>
          </button>

          <!-- Next Video Button -->
          <button id="btn-next-video" class="hover:text-emerald-400 p-1.5 rounded-full hover:bg-slate-800/60 transition-all focus:outline-none" title="Next scenic video">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderScenesList() {
    return this.videoList.map((vid, idx) => {
      const isActive = idx === this.currentIndex;
      return `
        <button 
          data-video-index="${idx}"
          class="video-scene-item w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
            isActive 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm' 
              : 'hover:bg-slate-800/70 border border-transparent text-slate-300 hover:text-white'
          }"
        >
          <img 
            src="${vid.poster}" 
            alt="${vid.name}" 
            class="w-12 h-8 rounded-lg object-cover shrink-0 border border-slate-700/60"
            loading="lazy"
          />
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold truncate ${isActive ? 'text-emerald-300' : 'text-slate-200'}">
              ${vid.name}
            </p>
            <p class="text-[10px] text-slate-400 truncate">
              ${vid.tag}
            </p>
          </div>
          ${isActive ? '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>' : ''}
        </button>
      `;
    }).join("");
  }

  bindEvents() {
    const video = document.getElementById("hero-bg-video");
    const playBtn = document.getElementById("btn-toggle-video-play");
    const muteBtn = document.getElementById("btn-toggle-video-mute");
    const nextBtn = document.getElementById("btn-next-video");
    const prevBtn = document.getElementById("btn-prev-video");
    const menuBtn = document.getElementById("btn-toggle-video-menu");
    const closeMenuBtn = document.getElementById("btn-close-video-menu");
    const menuEl = document.getElementById("video-scenes-menu");

    if (!video) return;

    // Graceful autoplay handling
    video.play().catch(() => {
      this.isPlaying = false;
      this.updatePlayIcon();
    });

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (video.paused) {
          video.play().then(() => {
            this.isPlaying = true;
            this.updatePlayIcon();
          }).catch(() => {});
        } else {
          video.pause();
          this.isPlaying = false;
          this.updatePlayIcon();
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        video.muted = !video.muted;
        this.isMuted = video.muted;
        this.updateMuteIcon();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.switchVideo((this.currentIndex + 1) % this.videoList.length);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const prevIndex = (this.currentIndex - 1 + this.videoList.length) % this.videoList.length;
        this.switchVideo(prevIndex);
      });
    }

    if (menuBtn && menuEl) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isMenuOpen = !this.isMenuOpen;
        menuEl.classList.toggle("hidden", !this.isMenuOpen);
        if (this.isMenuOpen && window.lucide) window.lucide.createIcons();
      });
    }

    if (closeMenuBtn && menuEl) {
      closeMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isMenuOpen = false;
        menuEl.classList.add("hidden");
      });
    }

    // Dismiss menu on outside click
    document.addEventListener("click", (e) => {
      if (this.isMenuOpen && menuEl && !menuEl.contains(e.target) && !menuBtn?.contains(e.target)) {
        this.isMenuOpen = false;
        menuEl.classList.add("hidden");
      }
    });

    // Scene picker item click delegation
    this.container.addEventListener("click", (e) => {
      const item = e.target.closest(".video-scene-item");
      if (item) {
        const targetIndex = parseInt(item.getAttribute("data-video-index"), 10);
        if (!isNaN(targetIndex) && targetIndex !== this.currentIndex) {
          this.switchVideo(targetIndex);
        }
        if (menuEl) {
          this.isMenuOpen = false;
          menuEl.classList.add("hidden");
        }
      }
    });
  }

  switchVideo(targetIndex) {
    if (typeof targetIndex === "number") {
      this.currentIndex = targetIndex;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.videoList.length;
    }

    const nextVideo = this.videoList[this.currentIndex];
    const video = document.getElementById("hero-bg-video");
    const label = document.getElementById("label-video-name");
    const counter = document.getElementById("label-video-counter");
    const scenesList = document.getElementById("video-scenes-list");

    if (video) {
      video.style.opacity = "0.2";
      setTimeout(() => {
        video.src = nextVideo.src;
        video.poster = nextVideo.poster;
        video.load();
        video.play().then(() => {
          this.isPlaying = true;
          this.updatePlayIcon();
        }).catch(() => {});
        video.style.opacity = "1";
        
        if (label) label.textContent = nextVideo.name;
        if (counter) counter.textContent = `${this.currentIndex + 1}/${this.videoList.length}`;
        if (scenesList) {
          scenesList.innerHTML = this.renderScenesList();
          if (window.lucide) window.lucide.createIcons();
        }
      }, 300);
    }
  }

  updatePlayIcon() {
    const icon = document.getElementById("icon-video-play");
    if (!icon) return;
    if (this.isPlaying) {
      icon.setAttribute("data-lucide", "pause");
    } else {
      icon.setAttribute("data-lucide", "play");
    }
    if (window.lucide) window.lucide.createIcons();
  }

  updateMuteIcon() {
    const icon = document.getElementById("icon-video-mute");
    if (!icon) return;
    if (this.isMuted) {
      icon.setAttribute("data-lucide", "volume-x");
    } else {
      icon.setAttribute("data-lucide", "volume-2");
    }
    if (window.lucide) window.lucide.createIcons();
  }
}
