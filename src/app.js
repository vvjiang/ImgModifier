import $ from 'jquery';

/**
 * 设置canvas图像到下载链接上
 */
const setCanvasImgToDownloadLink = () => {
  const imgData = document.getElementById('target_canvas').toDataURL();
  $('#download_file').attr('href', imgData);
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
    const ctx = document.getElementById('target_canvas').getContext('2d');
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.beginPath();
      ctx.moveTo(30, 96);
      ctx.lineTo(70, 66);
      ctx.lineTo(103, 76);
      ctx.lineTo(170, 15);
      ctx.stroke();
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
  $('#btn_select_file').click((event) => {
    $('#target_file').click();
  });
};
$(() => {
  bindEvent();
});
