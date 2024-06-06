import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
//import './styles.css'; // Import the CSS file

import "./QRCodeCss.css";

const QRcodePage = (props) => {
  const [data, setData] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {

    if (show === false) return
    if (show === true) {
      setData('');
    }
  }, [show]);

  console.log("kkk" + data);

  return (
    <>
      <h2 className="qr-scanner-title">Scan the QR code for promotion</h2>

      <center>
        <div className="qr-scanner-container" style={{ width: '500px', height: '500px' }}>
          {data && (
            <>  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmWUTqAhTw20Z-XS0LRKM2CzjKetp93S9CYPoQdaHUdw&s" alt="qr-code" style={{ width: '100%', objectFit: "cover" }} />
            </>
          )}
          {show && (
            <>
              <QrReader
                onResult={(result, error) => {
                  console.log(result)

                  if (!!result) {
                    setData(result?.text);
                    setShow(false);
                  }

                  if (!!error) {
                    console.info(error);
                  }
                }}
                className="qr-scanner"

              />
            </>
          )}
        </div>
      </center>
      <br />

      <center>
        {data ?

          <button
            className="mr-2 qr-scanner-button"
            style={{ backgroundColor: '#D17316' }}
            onClick={() => {
              window.location.reload()
            }
            }
          >
            {'Scan Again'}
          </button>
          :
          <button
            className="qr-scanner-button"
            style={{ backgroundColor: '#D17316' }}
            onClick={() => {
              setShow(true);
            }
            }
          >
            {'Scan QR Code'}
          </button>

        }


        {data && (
          <>
            <button style={{ backgroundColor: '#D17316' }} className="qr-scanner-button" onClick={() => window.location.replace(`${data}`)}>Go to Promotion</button>
          </>
        )}
      </center>

    </>
  );
};

export default QRcodePage;

