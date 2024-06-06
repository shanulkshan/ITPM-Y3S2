import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './QR.css'

function ViewQRCode() {

    const [url, setUrl] = useState('')
    const [qrCode, setQrCode] = useState('')

    const { id } = useParams()

    const generateQrCode = () => {
        QRCode.toDataURL(url, {
            width: 800,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, (err, url) => {
            if (err) return console.log(err)

            console.log(url)
            setQrCode(url)
        })
    }

    useEffect(() => {
        if (id) {
            setUrl(`http://localhost:5173/admin/promotion-view/${id}/qr`)
        }
    }, [id])

    useEffect(() => {
        if (url) {
            generateQrCode()
        }
    }, [url])


    return (
        <div className='qr-code-css'>
            <div className='app'>
                <h1>QR Code</h1>

                <center>
                    {qrCode && <>
                        <img src={qrCode} />
                        <a href={qrCode} download="QRcode.png" >Download QR Code</a>
                    </>}
                </center>
            </div>

        </div>
    )
}

export default ViewQRCode