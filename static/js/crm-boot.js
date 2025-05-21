/*** ...existing boot code above... ***/
// Add this CDN to your index.html before crm-boot.js:
// <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>

// EmailJS initialization (Put your public key here)
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");

// Messaging Form Submit - updated
msgForm.addEventListener('submit', async e => {
  e.preventDefault();
  const recipients = document.getElementById('msg-recipients').value.split(/,\s*/).filter(Boolean);
  const body = document.getElementById('msg-body').value;
  const templateId = document.getElementById('msg-template').value || "default_template";
  let allSucceeded = true;

  for (let recipient of recipients) {
    try {
      await emailjs.send("YOUR_SERVICE_ID", templateId, {
        to_email: recipient,
        message: body
      });
    } catch (err) {
      allSucceeded = false;
      showToast(`Failed to send to: ${recipient}`);
    }
  }
  showToast(allSucceeded
    ? `Message sent to ${recipients.length} recipients`
    : "Some messages failed to send");
});
/*** ...rest of boot code... ***/