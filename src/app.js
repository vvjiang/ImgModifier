import $ from 'jquery';
import './app.css';


let img = new Image();
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

const setTextIntoCanvas = () => {
  const x = $('#watermark').offset().left - $('#target_canvas').offset().left;
  const y = $('#watermark').offset().top - $('#target_canvas').offset().top;
  const text = $('#watermark').text();
  const ctx = document.getElementById('target_canvas').getContext('2d');
  const fontSize = Number.parseInt($('#text_size').val(), 10);
  ctx.font = '18px cursive';
  ctx.fillStyle = '#fffbf0';
  ctx.fillText(text, Number.parseInt(x, 10), Number.parseInt(y, 10) + fontSize);
  setCanvasImgToDownloadLink();
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
  $('#set_canvas').click(() => {
    const width = $('#canvas_width').val();
    const height = $('#canvas_height').val();
    setCanvasSize(width, height);
  });
  $('#add_text').click(() => {
    let offsetX = 0;
    let offsetY = 0;
    $('#canvas-container').append(`<span draggable="true" id="watermark">${$('#inject_text').val()}</span>`);
    setTextIntoCanvas();
    $('#watermark').on('dragstart', (e) => {
      e.originalEvent.dataTransfer.effectAllowed = 'move';
      e.originalEvent.dataTransfer.dropEffect = 'move';
      const ctx = document.getElementById('target_canvas').getContext('2d');
      ctx.clearRect(0, 0, $('#target_canvas').width(), $('#target_canvas').height());
      ctx.drawImage(img, 0, 0);
      // 开始拖拽文本出现
      $('#watermark').addClass('selected');
      const canvasPosition = $('#target_canvas').offset();
      offsetX = e.offsetX + canvasPosition.left;
      offsetY = e.offsetY + canvasPosition.top;
    });
    $('#watermark').on('dragover', (e) => {
      e.originalEvent.dataTransfer.dropEffect = 'move';
    });
    $('#watermark').on('drag', (e) => {
      let x = e.pageX;
      let y = e.pageY;
      // drag事件最后一刻，无法读取鼠标的坐标，pageX和pageY都变为0
      if (x === 0 && y === 0) {
        return; // 不处理拖动最后一刻X和Y都为0的情形
      }
      x -= offsetX;
      y -= offsetY;

      $('#watermark').css('left', x).css('top', y);
    });
    $('#watermark').on('dragend', (e) => {
      let x = e.pageX - offsetX;
      let y = e.pageY - offsetY;
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      const textHeight = $('#watermark').height();
      const textWidth = $('#watermark').width();
      const maxX = $('#target_canvas').width() - textWidth;
      const maxY = $('#target_canvas').height() - textHeight;
      if (x > maxX) {
        x = maxX;
      }
      if (y > maxY) {
        y = maxY;
      }
      $('#watermark').css('left', x).css('top', y);
      // 拖拽完水印文本隐藏
      $('#watermark').removeClass('selected');
      setTextIntoCanvas();
    });
  });
};
$(() => {
  bindEvent();
});
