document.addEventListener("DOMContentLoaded", () => {
  let audio = new Audio();
  let currentPlayingBtn = null; // Track the current play button
  const playPauseBtn = document.querySelector(".play_pause");
  const seekbar = document.getElementById("progress");
  const song_list = document.querySelector(".song_list");
  const thumbnail = document.getElementById("play_thumbnail");
  const title = document.getElementById("play_song");
  const artist = document.getElementById("play_artist");

  async function onloadsongs() {
    try {
      const response = await fetch("http://127.0.0.1:8001/onload");
      const data = await response.json();
      console.log(data);
      display(data);
    } catch (err) {
      alert(`Error: ${err}`);
    }
  }

  async function songsearch() {
    const search_word = document.getElementById("keyword").value;
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/search?q=${search_word}`
      );
      const data = await response.json();
      console.log(data);
      display(data);
    } catch (err) {
      alert(`Error: ${err}`);
    }
  }

  window.songsearch = songsearch;

  if (document.getElementById("keyword").value === "") {
    onloadsongs();
  } else {
    songsearch();
  }

  function display(data) {
    let songs = "";
    data.forEach((song) => {
      songs += `<div class="song_box">
                      <div class="album_thumbnail">
                          <img src="${song.thumbnail}" alt="Album Thumbnail">
                      </div>
                      <div class="name">
                          <div class="song_name">${
                            song.title.length > 10
                              ? song.title.substring(0, 25) + "..."
                              : song.title
                          }</div>
                          <div class="artist_name">${
                            song.artist.length > 10
                              ? song.artist.substring(0, 15) + "..."
                              : song.artist
                          }
                          </div>
                      </div>
                      <div>
                          <img onclick="playAudio(this, '${
                            song.videoId
                          }')" class="play_pause" src="./images/play-button-arrowhead.png"
                              alt="Play/Pause">
                      </div>
                  </div>`;
    });
    song_list.innerHTML = songs;
  }

  function playpause() {
    if (audio.paused) {
      audio.play();
      playPauseBtn.src = "./images/pause.png"; // Change to pause icon
      if (currentPlayingBtn) {
        currentPlayingBtn.src = "./images/pause.png";
      }
    } else {
      audio.pause();
      playPauseBtn.src = "./images/play-button-arrowhead.png"; // Change to play icon
      if (currentPlayingBtn) {
        currentPlayingBtn.src = "./images/play-button-arrowhead.png";
      }
    }
  }

  // ✅ Fix: Make playAudio() global and stop current song before playing new one
  window.playAudio = async function (btn, videoId) {
    try {
      if (currentPlayingBtn && currentPlayingBtn !== btn) {
        audio.pause();
        currentPlayingBtn.src = "./images/play-button-arrowhead.png";
      }

      const response = await fetch(
        `http://127.0.0.1:8001/get_audio?video_id=${videoId}`
      );
      const data = await response.json();

      console.log(data);

      if (data.audio_url) {
        audio.src = data.audio_url;
        thumbnail.src = data.thumbnail;
        title.innerText =
          data.title.length > 10
            ? data.title.substring(0, 25) + "..."
            : data.title;
        artist.innerText =
          data.artist.length > 10
            ? data.artist.substring(0, 15) + "..."
            : data.artist;

        if (audio.paused) {
          audio.play();
          btn.src = "./images/pause.png"; // Change to pause icon
          playPauseBtn.src = "./images/pause.png"; // Sync main play button
        } else {
          audio.pause();
          btn.src = "./images/play-button-arrowhead.png"; // Change to play icon
          playPauseBtn.src = "./images/play-button-arrowhead.png";
        }

        currentPlayingBtn = btn;
      } else {
        alert("Audio not found!");
      }
    } catch (error) {
      alert(`Error fetching audio: ${error}`);
    }
  };

  playPauseBtn.addEventListener("click", playpause);

  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
      seekbar.max = audio.duration;
      seekbar.value = audio.currentTime;
    }
  });

  seekbar.addEventListener("input", () => {
    audio.currentTime = seekbar.value;
  });

  audio.addEventListener("loadedmetadata", () => {
    seekbar.max = audio.duration;
  });

  audio.addEventListener("ended", () => {
    playPauseBtn.src = "./images/play-button-arrowhead.png";
    if (currentPlayingBtn) {
      currentPlayingBtn.src = "./images/play-button-arrowhead.png";
    }
    seekbar.value = 0;
  });
});
