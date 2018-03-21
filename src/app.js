import $ from 'jquery';

const loadImgFileInCanvas = (imgFile) => {
  const reader = new FileReader();

  reader.onprogress = (e) => {
    // 这个是定时触发的事件，文件较大的时候较明显
    const p = `已完成：${Math.round(e.loaded / e.total * 100)}%`;
    $('#read_process').html(p);
    console.log('uploading');
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
    const dataURL = reader.result;
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
      const imgData = document.getElementById('target_canvas').toDataURL();
      $('#download_file').attr('href', imgData);
    };
    img.src = dataURL;
  };
  reader.readAsDataURL(imgFile);
};
const bindEvent = () => {
  $('#target_file').change((event) => {
    const imgFile = event.target.files[0];
    loadImgFileInCanvas(imgFile);
  });
  $('#btn_download').click((event) => {
    const ctx = document.getElementById('target_canvas').getContext('2d');
    //const myImageData = ctx.createImageData(500, 500);
    const myImageData = ctx.getImageData(0, 0, 100, 100);
  });
};
$(() => {
  bindEvent();
});
