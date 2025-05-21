/**
 * sms-bulk.js
 * SMS Bulk-Send with batching, progress UI, and retry logic
 */

(function() {
  'use strict';

  // Customize these
  const BATCH_SIZE = 100;         // how many texts per API call
  const RETRY_DELAY = 2000;       // ms before retrying a failed batch
  const MAX_RETRIES = 2;          // max attempts per batch

  // Add a progress bar under the message form
  const smsProgress = document.createElement('div');
  smsProgress.id = 'sms-progress';
  smsProgress.style.marginTop = '8px';
  document.getElementById('message-form').append(smsProgress);

  // Helper: split array into chunks
  function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  // Send one batch to your backend
  async function sendBatch(numbers, body) {
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: numbers, message: body })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // Main handler
  document.getElementById('message-form').addEventListener('submit', async e => {
    e.preventDefault();

    // Read numbers and message
    const raw = document.getElementById('msg-recipients').value;
    const body = document.getElementById('msg-body').value;
    const allNums = raw.split(/\s*,\s*/).filter(Boolean);
    if (!allNums.length || !body) {
      alert('Please provide both recipients and a message.');
      return;
    }

    // Chunk and dispatch
    const batches = chunkArray(allNums, BATCH_SIZE);
    let sentCount = 0;
    smsProgress.textContent = `0 / ${allNums.length} sent`;

    for (let i = 0; i < batches.length; i++) {
      let attempt = 0;
      const batch = batches[i];

      while (attempt <= MAX_RETRIES) {
        try {
          await sendBatch(batch, body);
          sentCount += batch.length;
          smsProgress.textContent = `${sentCount} / ${allNums.length} sent`;
          break;   // success → move to next batch
        } catch (err) {
          attempt++;
          console.warn(`Batch ${i+1} failed (attempt ${attempt}):`, err);
          if (attempt > MAX_RETRIES) {
            showToast(`Batch ${i+1} failed after ${MAX_RETRIES} retries.`);
            break;
          }
          await new Promise(r => setTimeout(r, RETRY_DELAY));
        }
      }
    }

    showToast(`SMS campaign complete: ${sentCount}/${allNums.length} delivered.`);
  });

  // Reuse the toast from crm-boot.js
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.append(t);
    setTimeout(() => t.remove(), 3000);
  }

})();
