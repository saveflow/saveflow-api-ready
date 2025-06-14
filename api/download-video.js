import { createClient } from '@supabase/supabase-js';
import ytDlpWrap from 'yt-dlp-wrap';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    const ytDlp = new ytDlpWrap();
    await ytDlp.execPromise([
      url,
      '-f', 'mp4',
      '-o', videoPath,
      '--no-playlist'
    ]);

    return res.status(200).json({
      message: 'Download complete',
      path: videoPath
    });
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Failed to download video' });
  }
}
// redeploy trigger
