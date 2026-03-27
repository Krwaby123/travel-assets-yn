const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PUBLIC_DIR = path.join(__dirname, '../public')

const IMAGE_DIRS = [
  'images/spots',
  'images/music-covers',
  'images/icons'
]

const MUSIC_DIR = 'music'

async function compressImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase()
  
  if (ext === '.webp') {
    console.log(`  跳过已是WebP: ${path.basename(inputPath)}`)
    return { skipped: true }
  }

  const finalOutputPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  try {
    await sharp(inputPath)
      .webp({ quality: 75 })
      .toFile(finalOutputPath)

    const originalSize = fs.statSync(inputPath).size
    const newSize = fs.statSync(finalOutputPath).size
    const saved = ((1 - newSize / originalSize) * 100).toFixed(1)

    console.log(`  ${path.basename(inputPath)}: ${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB (节省 ${saved}%)`)

    if (finalOutputPath !== inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath)
    }

    return { originalSize, newSize }
  } catch (err) {
    console.error(`  压缩失败 ${path.basename(inputPath)}:`, err.message)
    return { error: true }
  }
}

async function compressImages() {
  console.log('\n=== 压缩图片 ===\n')
  
  let totalOriginal = 0
  let totalNew = 0

  for (const dir of IMAGE_DIRS) {
    const fullDir = path.join(PUBLIC_DIR, dir)
    if (!fs.existsSync(fullDir)) {
      console.log(`目录不存在: ${dir}`)
      continue
    }

    console.log(`处理目录: ${dir}`)
    
    const files = fs.readdirSync(fullDir)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))

    for (const file of files) {
      const inputPath = path.join(fullDir, file)
      const result = await compressImage(inputPath, inputPath)
      if (!result.skipped && !result.error) {
        totalOriginal += result.originalSize
        totalNew += result.newSize
      }
    }
  }

  console.log(`\n图片压缩完成!`)
  console.log(`原始大小: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`)
  console.log(`压缩后: ${(totalNew / 1024 / 1024).toFixed(2)}MB`)
  console.log(`节省: ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%`)
}

function compressMusic() {
  console.log('\n=== 压缩音乐 ===\n')
  
  const musicDir = path.join(PUBLIC_DIR, MUSIC_DIR)
  if (!fs.existsSync(musicDir)) {
    console.log('music 目录不存在')
    return
  }

  const files = fs.readdirSync(musicDir).filter(f => /\.mp3$/i.test(f))

  if (files.length === 0) {
    console.log('没有找到 mp3 文件')
    return
  }

  let totalOriginal = 0
  let totalNew = 0

  for (const file of files) {
    const inputPath = path.join(musicDir, file)
    const tempPath = path.join(musicDir, `temp_${file}`)
    
    const originalSize = fs.statSync(inputPath).size
    totalOriginal += originalSize

    console.log(`压缩: ${file} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`)

    try {
      execSync(
        `ffmpeg -i "${inputPath}" -y -acodec libmp3lame -b:a 128k "${tempPath}"`,
        { stdio: 'pipe' }
      )

      const newSize = fs.statSync(tempPath).size
      totalNew += newSize
      const saved = ((1 - newSize / originalSize) * 100).toFixed(1)

      console.log(`  完成: ${(newSize / 1024 / 1024).toFixed(2)}MB (节省 ${saved}%)`)

      fs.unlinkSync(inputPath)
      fs.renameSync(tempPath, inputPath)
    } catch (err) {
      console.error(`  压缩失败:`, err.message)
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
    }
  }

  console.log(`\n音乐压缩完成!`)
  console.log(`原始大小: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`)
  console.log(`压缩后: ${(totalNew / 1024 / 1024).toFixed(2)}MB`)
  console.log(`节省: ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%`)
}

async function main() {
  await compressImages()
  compressMusic()
  
  console.log('\n=== 全部完成 ===')
}

main().catch(console.error)