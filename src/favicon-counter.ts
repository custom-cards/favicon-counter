/* eslint-disable @typescript-eslint/no-explicit-any */
// Modified from https://medium.com/@alperen.talaslioglu/building-dynamic-favicon-with-javascript-223ad7999661
let favurl: string;
function GetNotifyCount(): number {
  let hass = document.querySelector('home-assistant');
  if (hass === null) return 0;
  hass = (hass as any).hass;
  let notifications = 0;

  if (hass === null) return 0;

  for (const state in (hass as any).states) {
    if (state.startsWith('persistent_notification.')) notifications += 1;
  }
  return notifications;
}

function UpdateFavicon(): void {
  const count = GetNotifyCount();
  const favicon = parent.document.querySelector('link[rel=icon]');

  if (favurl === undefined) favurl = (favicon as any).href;

  const faviconSize = 16;
  const canvas = document.createElement('canvas');
  canvas.width = faviconSize;
  canvas.height = faviconSize;
  const context = canvas.getContext('2d');
  const img = document.createElement('img');

  if (favicon === null) return;
  img.src = (favicon as any).href;

  img.onload = (): void => {
    // Draw Original Favicon as Background
    if (context === null) return;
    context.drawImage(img, 0, 0, faviconSize, faviconSize);
    if (count > 0) {
      // Draw Notification Circle
      context.beginPath();
      context.arc(canvas.width - faviconSize / 3, faviconSize / 3, faviconSize / 3, 0, 2 * Math.PI);
      context.fillStyle = '#FF0000';
      context.fill();

      // Draw Notification Number
      context.font = '10px "helvetica", sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#FFFFFF';
      context.fillText(String(count), canvas.width - faviconSize / 3, faviconSize / 3);
      // Replace favicon
      (favicon as any).href = canvas.toDataURL('image/png');
    } else {
      (favicon as any).href = favurl;
    }
  };
}

let prevCount: number;
window.setInterval(function() {
  if (prevCount !== GetNotifyCount()) {
    UpdateFavicon();
    prevCount = GetNotifyCount();
  }
}, 1000);
