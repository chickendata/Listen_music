const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'
const heading = $("header h2");
const cdThum = $(".cd-thumb");
const playList = $(".playlist");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat');
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {} ,
  songs: [
    {
      name: "An thần",
      singer: "Low G ft thắng",
      path: "./asset/music/an_than.mp3",
      img: "./asset/img/an_than.jpg",
    },
    {
      name: "Anh nhớ ra",
      singer: "Vũ.",
      path: "./asset/music/anh_nho_ra.mp3",
      img: "./asset/img/anh_nho_ra.jpg",
    },
    {
      name: "Hành tinh song song",
      singer: "Vũ.",
      path: "./asset/music/hanh_tinh_song_song.mp3",
      img: "./asset/img/hanh_tinh_song_song.jpg",
    },
    {
      name: "Golden hour",
      singer: "JVKE",
      path: "./asset/music/golden_hour.mp3",
      img: "./asset/img/golden_hour.jpg",
    },
    {
      name: "Khó vẽ nụ cười",
      singer: "Đạt G ft Du Uyên",
      path: "./asset/music/kho_ve_nu_cuoi.mp3",
      img: "./asset/img/kho_ve_nu_cuoi.jpg",
    },
    {
      name: "Có em",
      singer: "Low G ft Madihu",
      path: "./asset/music/Co_em.mp3",
      img: "./asset/img/co_em.jpg",
    },
    {
      name: "Truy lùng",
      singer: "Namlee",
      path: "./asset/music/Truy_lung.mp3",
      img: "./asset/img/truy_lung.jpg",
    },
    {
      name: "Simp gái 808",
      singer: "Low G",
      path: "./asset/music/simp_gai.mp3",
      img: "./asset/img/simp_gai.jpg",
    },
    {
      name: "Until I Found You",
      singer: "Stephen Sanchez",
      path: "./asset/music/until_i_found_you.mp3",
      img: "./asset/img/until_i_found_you.jpg",
    },
    {
      name: "Vì anh đâu có biết",
      singer: "Madihu ft Vũ.",
      path: "./asset/music/vi_anh_dau_Co_biet.mp3",
      img: "./asset/img/vi_anh_dau_co_biet.jpg",
    },
  ],

  setConfig: function(key,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((songs,index) => {
      return `<div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div
                  class="thumb"
                  style="
                    background-image: url('${songs.img}');
                  "
                ></div>
                <div class="body">
                  <h3 class="title">${songs.name}</h3>
                  <p class="author">${songs.singer}</p>
                </div>
                <div class="option" onclick={app.test(${index})}>
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>`;
    });


    playList.innerHTML = htmls.join("");
  },

  test: function(i) {
    
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
     const cdWidth = cd.offsetWidth;

      // Xử lí CD quay/dừng
      const cdThumAnimate = cdThum.animate([{ transform: "rotate(360deg)" }], {
        duration: 10000,
        iterations: Infinity,
      });

      cdThumAnimate.pause();

      // Xử lí phóng to/thu nhỏ CD
      document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      };

      // Xử lí khi click play
      document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
          event.preventDefault();
          playBtn.click();
      }});

      playBtn.onclick = function () {
        if (app.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      };

      // Khi song được play
      audio.onplay = function () {
        app.isPlaying = true;
        player.classList.add("playing");
        cdThumAnimate.play();
      };

      // Khi song bị pause
      audio.onpause = function () {
        app.isPlaying = false;
        player.classList.remove("playing");
        cdThumAnimate.pause();
      };

      // Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        var currentTime = audio.currentTime;
        if (audio.duration) {
          const progressPercent = Math.floor(
            (currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      // Xử lí khi tua
      progress.oninput = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };

      // Khi next bài
      nextBtn.onclick = function () {
        if(app.isRandom === true) {
          app.playRandom()
        } else {
          app.nextSong();
        }
        audio.play();
        app.render();
        app.scrollToActiveSong();
      };

      // Khi prev bài
      prevBtn.onclick = function () {
        if(app.isRandom === true)
        {
          app.playRandom();
        } else {
          app.prevSong();
        }
        audio.play();
        app.render();
        app.scrollToActiveSong();
      };

      // Xử lí random bật/tắt 

      randomBtn.onclick = function() {
        if(app.isRandom == true) {
          app.isRandom = false;
          randomBtn.classList.remove('active');
        } else {
          app.isRandom = true;
          randomBtn.classList.add('active');
        }
        app.setConfig('isRandom', app.isRandom);
      }

      // Xử lí repeat bật/tắt
      repeatBtn.onclick = function() {
        if(app.isRepeat == true) {
          app.isRepeat = false;
          repeatBtn.classList.remove('active');
        } else {
          app.isRepeat = true;
          repeatBtn.classList.add('active');
        }
        app.setConfig('isRepeat', app.isRepeat);
      }

      // Xử lí kết thúc bài

      audio.onended = function() {
        if(app.isRepeat) {
          audio.play();
        }else
        nextBtn.click();
      }

      // Lắng nghe hành vi click vào playlist
      playList.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)');
        if( songNode || e.target.closest('.option')){
          // Xử lí khi click vào song
          if(songNode) {
            if(e.target.closest('.option')){
              console.log('aaaaaaaaaaa');
            }else {
              app.currentIndex = Number(songNode.dataset.index);
              app.loadCurrentSong();
              app.render();
              audio.play();
            }

          }

          // Khi click vào option
          if(e.target.closest('.option')) {

          }
        }
      }
  },

  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 300);
  },

  loadConfig: function() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThum.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  playRandom: function() {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      }while(newIndex === this.currentIndex)

      this.currentIndex = newIndex;
      this.loadCurrentSong();
  },

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    //Định nghĩa các thuộc tính cho object
    this.defineProperties();
    //Lắng nghe/ xử lí sự kiện (DOM events)
    this.handleEvents();
    //Tải thông tin bài hát đầu tiên UI khi chạy ứng dụng
    this.loadCurrentSong();
    //Render playlist
    this.render();
    // Hiển thị trạng thái ban đầu của button repeat và random
    randomBtn.classList.toggle('active', this.config.isRandom)
    repeatBtn.classList.toggle('active', this.config.isRepeat)

  },
};
app.start();
