const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const PUBLIC_DIR = path.join(__dirname, '../public')
const MUSIC_DIR = path.join(PUBLIC_DIR, 'music')
const COVERS_DIR = path.join(PUBLIC_DIR, 'images/music-covers')

// 音乐和封面的映射关系
const MAPPINGS = [
  // 已有（保持不变）
  { music: 'spring-flowers.mp3', cover: 'spring-flowers-cover.webp', name: '春花', artist: 'やまだ豊' },
  { music: 'paper-plane.mp3', cover: 'paper-plane-cover.webp', name: '纸飞机', artist: '鸣潮' },
  
  // 新增
  { 
    musicOld: 'dylanf - 卡农（经典钢琴版）.mp3',
    music: 'canon.mp3',
    coverOld: '卡农.jpg',
    cover: 'canon-cover.webp',
    name: '卡农',
    artist: 'dylanf'
  },
  { 
    musicOld: 'トゲナシトゲアリ - 誰にもなれない私だから.mp3',
    music: 'cannot-be-anyone-else.mp3',
    coverOld: '正因为是无法成为他人的我.jpg',
    cover: 'cannot-be-anyone-else-cover.webp',
    name: '正因为是无法成为他人的我',
    artist: 'トゲナシトゲアリ'
  },
  { 
    musicOld: 'ヨルシカ - 老人と海.mp3',
    music: 'old-man-and-the-sea.mp3',
    coverOld: '老人与海.jpg',
    cover: 'old-man-and-the-sea-cover.webp',
    name: '老人与海',
    artist: 'ヨルシカ'
  },
  { 
    musicOld: '塞壬唱片-MSR,Eagle Wei - 海愿.mp3',
    music: 'sea-wish.mp3',
    coverOld: '海愿.jpg',
    cover: 'sea-wish-cover.webp',
    name: '海愿',
    artist: '塞壬唱片-MSR'
  },
  { 
    musicOld: '塞壬唱片-MSR,MeLo_绿萝组 - 相见欢.mp3',
    music: 'meeting-joy.mp3',
    coverOld: '相见欢.jpg',
    cover: 'meeting-joy-cover.webp',
    name: '相见欢',
    artist: '塞壬唱片-MSR'
  },
  { 
    musicOld: '塞壬唱片-MSR,横山克 - 春弦.mp3',
    music: 'spring-string.mp3',
    coverOld: '春弦.jpg',
    cover: 'spring-string-cover.webp',
    name: '春弦',
    artist: '塞壬唱片-MSR'
  },
  { 
    musicOld: '小瀬村晶 - Ahead of Us.mp3',
    music: 'ahead-of-us.mp3',
    coverOld: 'Ahead Of Us.jpg',
    cover: 'ahead-of-us-cover.webp',
    name: 'Ahead of Us',
    artist: '小瀬村晶'
  },
  { 
    musicOld: '鸣潮先约电台,baitian,waka - 星辉抵达之日.mp3',
    music: 'starlight-arrival.mp3',
    coverOld: '星辉抵达之日.jpg',
    cover: 'starlight-arrival-cover.webp',
    name: '星辉抵达之日',
    artist: '鸣潮先约电台'
  },
  { 
    musicOld: '鸣潮先约电台,jixwang,小林未郁 - 那颗星梦见的春日.mp3',
    music: 'spring-in-stars-dream.mp3',
    coverOld: '那颗星梦见的春日.jpg',
    cover: 'spring-in-stars-dream-cover.webp',
    name: '那颗星梦见的春日',
    artist: '鸣潮先约电台'
  },
  { 
    musicOld: '鸣潮先约电台,劣白Leo,jixwang - 星辉的安眠曲 (逆序主题).mp3',
    music: 'starlight-lullaby.mp3',
    coverOld: '星辉的安眠曲.jpg',
    cover: 'starlight-lullaby-cover.webp',
    name: '星辉的安眠曲',
    artist: '鸣潮先约电台'
  },
  { 
    musicOld: '鸣潮先约电台,飞行雪绒,jixwang - 小小奇迹（尚未发布(๑•̀ᴗ- )✧✩°｡⋆！）.mp3',
    music: 'little-miracle.mp3',
    coverOld: '小小奇迹.jpg',
    cover: 'little-miracle-cover.webp',
    name: '小小奇迹',
    artist: '鸣潮先约电台'
  },
  { 
    musicOld: '鸣潮先约电台,飞行雪绒,星炬学院毕业生 - 星炬不熄.mp3',
    music: 'star-torch-forever.mp3',
    coverOld: '星炬不熄.jpg',
    cover: 'star-torch-forever-cover.webp',
    name: '星炬不熄',
    artist: '鸣潮先约电台'
  }
]

async function compressAndRenameCover(oldPath, newPath) {
  console.log(`  压缩封面: ${path.basename(oldPath)}`)
  
  await sharp(oldPath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(newPath)
  
  const oldSize = fs.statSync(oldPath).size
  const newSize = fs.statSync(newPath).size
  const saved = ((1 - newSize / oldSize) * 100).toFixed(1)
  
  console.log(`    ${path.basename(oldPath)}: ${(oldSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB (节省 ${saved}%)`)
  
  // 删除旧文件
  fs.unlinkSync(oldPath)
}

async function main() {
  console.log('\n=== 重命名和压缩音乐文件 ===\n')
  
  const playlist = []
  
  for (let i = 0; i < MAPPINGS.length; i++) {
    const item = MAPPINGS[i]
    console.log(`\n[${i + 1}/${MAPPINGS.length}] ${item.name}`)
    
    // 处理音乐文件
    if (item.musicOld) {
      const oldMusicPath = path.join(MUSIC_DIR, item.musicOld)
      const newMusicPath = path.join(MUSIC_DIR, item.music)
      
      if (fs.existsSync(oldMusicPath)) {
        fs.renameSync(oldMusicPath, newMusicPath)
        console.log(`  音乐重命名: ${item.musicOld} -> ${item.music}`)
      } else {
        console.log(`  ⚠️ 音乐文件不存在: ${item.musicOld}`)
      }
    }
    
    // 处理封面文件
    if (item.coverOld) {
      const oldCoverPath = path.join(COVERS_DIR, item.coverOld)
      const newCoverPath = path.join(COVERS_DIR, item.cover)
      
      if (fs.existsSync(oldCoverPath)) {
        await compressAndRenameCover(oldCoverPath, newCoverPath)
      } else {
        console.log(`  ⚠️ 封面文件不存在: ${item.coverOld}`)
      }
    }
    
    // 添加到播放列表
    playlist.push({
      id: i + 1,
      name: item.name,
      artist: item.artist,
      file: item.music,
      cover: item.cover
    })
  }
  
  // 写入新的 playlist.json
  const playlistPath = path.join(MUSIC_DIR, 'playlist.json')
  const playlistContent = JSON.stringify({ songs: playlist }, null, 2)
  fs.writeFileSync(playlistPath, playlistContent, 'utf-8')
  console.log(`\n✅ 已更新 playlist.json (${playlist.length} 首歌曲)`)
  
  // 打印 playlist.json 内容供复制
  console.log('\n=== playlist.json 内容 ===\n')
  console.log(playlistContent)
  
  console.log('\n=== 完成 ===')
  console.log('\n下一步:')
  console.log('1. 将 music/ 文件夹上传到 GitHub 仓库')
  console.log('2. 将 images/music-covers/ 文件夹上传到 GitHub 仓库')
  console.log('3. 刷新 CDN 缓存')
}

main().catch(console.error)