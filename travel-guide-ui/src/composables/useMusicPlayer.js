import { ref, computed, nextTick } from 'vue'

export function useMusicPlayer () {
  const bgMusic = ref(null)
  const isMusicPlaying = ref(false)
  const isMusicPausing = ref(false)
  const showMusicPlaylist = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(80)
  const currentSongIndex = ref(0)
  const playlist = ref([])
  const isLoadingPlaylist = ref(true)
  const playMode = ref('list')
  const shuffleHistory = ref([])

  const currentSong = computed(() => playlist.value[currentSongIndex.value] || null)

  const musicProgress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const seekProgress = (e) => {
    if (!bgMusic.value || duration.value === 0) return
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    bgMusic.value.currentTime = percent * duration.value
  }

  const seekProgressByKey = (seconds) => {
    if (!bgMusic.value || duration.value === 0) return
    const newTime = Math.max(0, Math.min(duration.value, currentTime.value + seconds))
    bgMusic.value.currentTime = newTime
  }

  const loadPlaylist = async () => {
    try {
      const response = await fetch('./music/playlist.json')
      const data = await response.json()
      playlist.value = data.songs || []
    } catch (e) {
      console.error('加载播放列表失败:', e)
      playlist.value = []
    } finally {
      isLoadingPlaylist.value = false
    }
  }

  const togglePlay = () => {
    if (!bgMusic.value || !currentSong.value) return

    if (isMusicPlaying.value) {
      bgMusic.value.pause()
      isMusicPausing.value = true
      isMusicPlaying.value = false
      setTimeout(() => {
        isMusicPausing.value = false
      }, 800)
    } else {
      bgMusic.value.play().then(() => {
        isMusicPlaying.value = true
      }).catch(() => {})
    }
  }

  const playSong = (index) => {
    if (index === currentSongIndex.value && isMusicPlaying.value) return

    currentSongIndex.value = index

    nextTick(() => {
      if (bgMusic.value) {
        bgMusic.value.load()
        bgMusic.value.play().then(() => {
          isMusicPlaying.value = true
        }).catch(() => {})
      }
    })
  }

  const prevSong = () => {
    if (playlist.value.length <= 1) return

    if (playMode.value === 'shuffle' && shuffleHistory.value.length > 0) {
      const prevIndex = shuffleHistory.value.pop()
      currentSongIndex.value = prevIndex
      playSong(currentSongIndex.value)
    } else {
      if (currentSongIndex.value > 0) {
        currentSongIndex.value--
      } else {
        currentSongIndex.value = playlist.value.length - 1
      }
      playSong(currentSongIndex.value)
    }
  }

  const nextSong = () => {
    if (playlist.value.length <= 1) return

    if (playMode.value === 'shuffle') {
      const nextIndex = getRandomIndex()
      shuffleHistory.value.push(currentSongIndex.value)
      currentSongIndex.value = nextIndex
      playSong(currentSongIndex.value)
    } else {
      if (currentSongIndex.value < playlist.value.length - 1) {
        currentSongIndex.value++
      } else {
        currentSongIndex.value = 0
      }
      playSong(currentSongIndex.value)
    }
  }

  const updateProgress = () => {
    if (bgMusic.value) {
      currentTime.value = bgMusic.value.currentTime
    }
  }

  const onAudioLoaded = () => {
    if (bgMusic.value) {
      duration.value = bgMusic.value.duration
      bgMusic.value.volume = volume.value / 100
    }
  }

  const onSongEnded = () => {
    if (playlist.value.length === 1) {
      bgMusic.value.currentTime = 0
      bgMusic.value.play().catch(() => {})
      return
    }

    if (playMode.value === 'single') {
      bgMusic.value.currentTime = 0
      bgMusic.value.play().catch(() => {})
    } else if (playMode.value === 'shuffle') {
      const nextIndex = getRandomIndex()
      shuffleHistory.value.push(currentSongIndex.value)
      currentSongIndex.value = nextIndex
      nextTick(() => {
        if (bgMusic.value) {
          bgMusic.value.load()
          bgMusic.value.play().then(() => {
            isMusicPlaying.value = true
          }).catch(() => {})
        }
      })
    } else {
      nextSong()
    }
  }

  const cyclePlayMode = () => {
    const modes = ['list', 'single', 'shuffle']
    const currentModeIndex = modes.indexOf(playMode.value)
    playMode.value = modes[(currentModeIndex + 1) % modes.length]
    if (playMode.value === 'shuffle') {
      shuffleHistory.value = []
    }
  }

  const getRandomIndex = () => {
    if (playlist.value.length <= 1) return 0
    let randomIndex
    const availableIndices = playlist.value
      .map((_, i) => i)
      .filter(i => i !== currentSongIndex.value && !shuffleHistory.value.includes(i))

    if (availableIndices.length === 0) {
      shuffleHistory.value = []
      randomIndex = Math.floor(Math.random() * playlist.value.length)
      if (randomIndex === currentSongIndex.value) {
        randomIndex = (randomIndex + 1) % playlist.value.length
      }
    } else {
      randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    }
    return randomIndex
  }

  const setVolume = (e) => {
    volume.value = parseInt(e.target.value, 10)
    if (bgMusic.value) {
      bgMusic.value.volume = volume.value / 100
    }
  }

  const handleDiscClick = (song, openLightboxFn) => {
    if (song?.cover && openLightboxFn) {
      openLightboxFn(`/images/music-covers/${song.cover}`, song.name)
    }
  }

  return {
    bgMusic,
    isMusicPlaying,
    isMusicPausing,
    showMusicPlaylist,
    currentTime,
    duration,
    volume,
    currentSongIndex,
    playlist,
    isLoadingPlaylist,
    playMode,
    currentSong,
    musicProgress,
    formatTime,
    seekProgress,
    seekProgressByKey,
    loadPlaylist,
    togglePlay,
    playSong,
    prevSong,
    nextSong,
    updateProgress,
    onAudioLoaded,
    onSongEnded,
    cyclePlayMode,
    setVolume,
    handleDiscClick
  }
}
