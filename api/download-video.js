import YtDlpWrap from 'yt-dlp-wrap';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, user_id } = req.body;

  if (!url || !user_id) {
    return res.status(400).json({ error: 'Missing URL or user_id' });
  }

  try {
    const videoId = uuidv4();
    const videoPath = `/tmp/${videoId}.mp4`;

    const ytDlpWrap = new YtDlpWrap();

    await ytDlpWrap.execPromise([
      url,
      '-f', 'mp4',
      '-o', videoPath,
      '--no-playlist'
    ]);

    res.status(200).json({ message: 'Video downloaded successfully', videoPath });

  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
}