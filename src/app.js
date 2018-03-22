import $ from 'jquery';
import './app.css';

/**
 * 设置canvas图像到下载链接上
 */
const setCanvasImgToDownloadLink = () => {
  const imgData = document.getElementById('target_canvas').toDataURL();
  $('#download_file').attr('href', imgData);
};
const setCanvasSize = (width, height) => {
  $('#target_canvas').attr('width', width).attr('height', height);
};

const loadImgFileInCanvas = (imgFile) => {
  const reader = new FileReader();

  reader.onprogress = (e) => {
    // 这个是定时触发的事件，文件较大的时候较明显
    const p = `已完成：${Math.round((e.loaded / e.total) * 100)}%`;
    $('#read_process').html(p);
  };
  reader.onabort = () => {
    console.log('abort');
  };
  reader.onerror = () => {
    console.log('error');
  };
  reader.onload = () => {
    console.log('load complete');
  };
  reader.onloadend = (e) => {
    const dataURL = e.target.result;
    const img = new Image();
    img.onload = (event) => {
      setCanvasSize(event.target.naturalWidth, event.target.naturalHeight);
      const ctx = document.getElementById('target_canvas').getContext('2d');
      ctx.drawImage(img, 0, 0);
      setCanvasImgToDownloadLink();
    };
    img.src = dataURL;
  };
  reader.readAsDataURL(imgFile);
};


// 绑定事件
const bindEvent = () => {
  $('#target_file').change((event) => {
    const imgFile = event.target.files[0];
    loadImgFileInCanvas(imgFile);
  });
  $('#btn_select_file').click(() => {
    $('#target_file').click();
  });
  $('#set_text').click(() => {
    const x = $('#position_x').val();
    const y = $('#position_y').val();
    const text = $('#inject_text').val();
    const ctx = document.getElementById('target_canvas').getContext('2d');
    const fontSize = Number.parseInt($('#text_size').val(), 10);
    ctx.font = `${fontSize}px cursive`;
    ctx.fillStyle = $('#text_color').val();
    ctx.fillText(text, Number.parseInt(x, 10), Number.parseInt(y, 10) + fontSize);
    setCanvasImgToDownloadLink();
  });
  $('#set_canvas').click(() => {
    const width = $('#canvas_width').val();
    const height = $('#canvas_height').val();
    setCanvasSize(width, height);
  });
};
$(() => {
  bindEvent();
});
