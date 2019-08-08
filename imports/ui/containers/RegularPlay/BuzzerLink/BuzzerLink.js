import React from 'react';
import QRCode from "qrcode.react";

const styles = {
  qr: {
    background: 'white',
    padding: '10px',
    marginTop: '10px'
  },
  h3: {
    marginTop: '0',
    marginBottom: '8px'
  }
};

const buzzerLink = (props) => {
  const url = new URL(window.location.href);
  const qr_url = url.origin + '/games/' + props.game_id + '/buzzer';
  return (
    <div style={styles.qr}>
      <a href={qr_url} target="_blank">
        <h3 style={styles.h3}>Buzzer Link</h3>
      </a>
      <QRCode value={qr_url}/>
    </div>
  )
};

export default buzzerLink;