'use client';

import { useState } from 'react';

interface ScreenCaptureProps {
  className?: string;
}

export default function ScreenCapture({ className = '' }: ScreenCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = async () => {
    setIsCapturing(true);
    
    try {
      // ブラウザが画面キャプチャをサポートしているかチェック
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        // サポートされていない場合は、メタデータを使用した保存を提案
        alert('画面保存機能をご利用いただくには、最新のブラウザをご使用ください。\n\n代替方法：\n1. 右クリック → 「名前を付けて画像を保存」\n2. スクリーンショット機能をご利用ください');
        return;
      }

      // 画面共有の許可を求める
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      // ビデオ要素を作成してストリームを再生
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // キャンバスを作成してビデオを描画
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // ビデオをキャンバスに描画
        ctx?.drawImage(video, 0, 0);
        
        // ストリームを停止
        stream.getTracks().forEach(track => track.stop());
        
        // 画像としてダウンロード
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'yosaPARK-screenshot.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      });

    } catch (error) {
      console.error('画面キャプチャエラー:', error);
      alert('画面保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsCapturing(false);
    }
  };

  const saveAsImage = () => {
    // 現在のページを画像として保存する代替方法
    const link = document.createElement('a');
    link.href = '/images/hero/yosa-image-w1600.jpg';
    link.download = 'yosaPARK.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 成功メッセージを表示
    setTimeout(() => {
      alert('yosaPARKの画像を保存しました！');
    }, 100);
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <button
        onClick={captureScreen}
        disabled={isCapturing}
        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isCapturing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            保存中...
          </>
        ) : (
          <>
            <i className="ri-camera-line text-lg"></i>
            画面を保存
          </>
        )}
      </button>
      
      <button
        onClick={saveAsImage}
        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
      >
        <i className="ri-image-line text-lg"></i>
        画像を保存
      </button>
    </div>
  );
} 