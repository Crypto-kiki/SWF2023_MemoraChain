import React, { useRef, useState } from "react";
import { useEffect } from "react";

function CanvasForm7({
  lat,
  lon,
  city,
  country,
  countryCode,
  address,
  size,
  img,
  file,
  setEnd,
  account,
  message,
  temperature,
  weather,
  fonts,
  time,
}) {
  const canvasRef = useRef(null);

  //1 가로가 김, 2 세로가 김, 3 비율 비슷함
  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };
  // 이미지 그리기
  useEffect(() => {
    //이미지 불러오기
    (async () => {
      const image2 = await loadImage(
        `${process.env.PUBLIC_URL}/image/logo2.png`
      );
      const image3 = await loadImage(
        `${process.env.PUBLIC_URL}/image/logo3.png`
      );

      // 캔버스에 그리기
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const cw = canvas.width;
      const ch = canvas.height;

      // 가로가 긴버전
      if (size[0] == 1) {
        // console.log(size);
        const image = new Image();
        image.src = file;
        image.onload = () => {
          //배경 프레임 그리기
          const rectWidth = cw / 2;
          const rectheight = ch;
          ctx.fillStyle = "#ececec"; //바꿔야되는부분
          ctx.fillRect(0, 0, rectWidth * 2, rectheight);

          ctx.filter = "none";
          // 오른쪽에 사각형 그리기
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(cw / 2 - 15, 15, rectWidth, rectheight - 30);
          //사각형 아웃라인

          //삽화
          //이미지 크기
          const iw = image.width;
          const ih = image.height;
          const iar = iw / ih;

          const rectWidth2 = cw / 1.78;
          const rectheight2 = cw / 1.78;

          //가로가 김
          ctx.drawImage(image3, cw - 95, 25, 73, 73);
          if (iw > 1100 || iar > 1.5) {
            ctx.fillStyle = "white";
            ctx.fillRect(
              cw / 2 - (rectWidth2 * iar * 0.5) / 2,
              ch / 2 - (rectheight2 * 0.5) / 2,
              rectWidth2 * iar * 0.5,
              rectheight2 * 0.5
            );
            ctx.drawImage(image, 15, 15, 870, 520);
            ctx.drawImage(image2, 20, 23, 74, 74);

            const imageDataUrl = canvas.toDataURL("image/png"); // 파일 url 저장부분
            img(imageDataUrl);
            setEnd(false);
          } else {
            ctx.fillStyle = "white";
            ctx.fillRect(
              cw / 2 - (rectWidth2 * iar * 0.6) / 2,
              ch / 2 - (rectheight2 * 0.6) / 2,
              rectWidth2 * iar * 0.6,
              rectheight2 * 0.6
            );
            ctx.drawImage(image, 15, 15, 870, 520);
            ctx.drawImage(image2, 20, 23, 74, 74);

            const imageDataUrl = canvas.toDataURL("image/png"); // 파일 url 저장부분
            img(imageDataUrl);
            setEnd(false);
          }
        };
      }
      //세로가 긴 버전, 비율이 비슷한버전
      if (size[0] == 2 || size[0] == 3) {
        const image = new Image();
        image.src = file;

        image.onload = () => {
          //배경테두리 사각형 그리기

          const rectWidth = cw / 2;
          const rectheight = ch;
          console.log(cw);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, rectWidth * 2, rectheight);

          //이미지 크기
          const iw = image.width;
          const ih = image.height;
          const iar = iw / ih;

          const rectWidth2 = cw / 1.78;
          const rectheight2 = cw / 1.78;

          //삽화

          //세로가 김
          if (iar < 0.9) {
            if (iar < 0.6) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(
                cw / 2 - cw / 7.33,
                ch / 2 - ch / 18.18 - (rectheight2 * (2 - iar) - rectheight2),
                rectWidth2 * 0.8,
                rectheight2 * (2 - iar) * 0.7
              );
              ctx.drawImage(image, 15, 15, 520, 870);
              ctx.drawImage(image2, 20, 20, 74, 74);
              const imageDataUrl = canvas.toDataURL("image/png"); // 파일 url 저장부분
              img(imageDataUrl);
              setEnd(false);
            } else {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(
                cw / 2 - cw / 7.33,
                ch / 2 - ch / 18.18 - (rectheight2 * (2 - iar) - rectheight2),
                rectWidth2,
                rectheight2 * (2 - iar)
              );
              ctx.drawImage(image, 15, 15, 520, 870);
              ctx.drawImage(image2, 20, 30, 74, 74);
              const imageDataUrl = canvas.toDataURL("image/png"); // 파일 url 저장부분
              img(imageDataUrl);
              setEnd(false);
            }
          } else {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(
              cw / 2 - cw / 7.33,
              ch / 2 - ch / 18.18 - (rectheight2 * (2 - iar) - rectheight2),
              rectWidth2 * 0.8,
              rectheight2 * (2 - iar) * 0.7
            );
            ctx.drawImage(image, 15, 15, 520, 870);
            ctx.drawImage(image2, 20, 20, 74, 74);
            const imageDataUrl = canvas.toDataURL("image/png"); // 파일 url 저장부분
            img(imageDataUrl);
          }
        };
      }
    })();
  }, [size]);

  return (
    <div className="hidden">
      {size[0] == 1 ? (
        <canvas ref={canvasRef} width={900} height={550} />
      ) : (
        <canvas ref={canvasRef} width={550} height={900} />
      )}
    </div>
  );
}

// additionalImage.src = `https://gateway.pinata.cloud/ipfs/${imgad}`;
export default CanvasForm7;
