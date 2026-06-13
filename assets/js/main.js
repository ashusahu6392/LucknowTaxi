/* =========================================================
   Lucknow Taxi & Rental — main.js
   Handles: navbar scroll, mobile year, booking form -> WhatsApp,
   optional email (Web3Forms / FormSubmit), toast feedback.
   ========================================================= */

/* ---- CONFIG: change these in ONE place ---- */
const BIZ = {
  phone: '916392000833',        // WhatsApp + tel (country code, no +)
  phoneDisplay: '+91 63920 00833',
  email: 'info@lucknowtaxi.com',
  // OPTIONAL email-to-mobile inquiry providers (see README):
  web3formsKey: '',             // <-- paste your Web3Forms access key to enable email option
  formsubmitEmail: 'info@lucknowtaxi.com'
};

/* ---------- Navbar shadow on scroll ---------- */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---------- Auto year in footer ---------- */
document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

/* ---------- Set min date = today on date inputs ---------- */
document.querySelectorAll('input[type="date"]').forEach(d => {
  d.min = new Date().toISOString().split('T')[0];
});

/* ---------- Toast helper ---------- */
function showToast(msg) {
  let t = document.querySelector('.toast-success');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast-success';
    document.body.appendChild(t);
  }
  t.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

/* ---------- Build a readable inquiry message ---------- */
function buildInquiryText(data) {
  const lines = [
    '🚕 *New Taxi Inquiry — Lucknow Taxi & Rental*',
    '',
    `📍 *Pickup:* ${data.pickup || '-'}`,
    `🎯 *Drop:* ${data.drop || '-'}`,
    `📅 *Date:* ${data.date || '-'}`,
    `⏰ *Time:* ${data.time || '-'}`,
    `🛣️ *Trip Type:* ${data.trip || '-'}`,
    `🚗 *Vehicle:* ${data.vehicle || '-'}`,
    '',
    `👤 *Name:* ${data.name || '-'}`,
    `📞 *Mobile:* ${data.mobile || '-'}`
  ];
  if (data.notes) lines.push(`📝 *Note:* ${data.notes}`);
  if (data.source) lines.push('', `🔗 _From: ${data.source}_`);
  return lines.join('\n');
}

/* ---------- Read a booking form into an object ---------- */
function readForm(form) {
  const g = name => {
    const el = form.querySelector(`[name="${name}"]`);
    return el ? el.value.trim() : '';
  };
  // trip type can be radio pills OR a select
  let trip = '';
  const tripRadio = form.querySelector('input[name="trip"]:checked');
  if (tripRadio) trip = tripRadio.value; else trip = g('trip');
  return {
    pickup: g('pickup'), drop: g('drop'), date: g('date'), time: g('time'),
    trip, vehicle: g('vehicle'), name: g('name'), mobile: g('mobile'),
    notes: g('notes'), source: g('source') || document.title
  };
}

/* ---------- Basic validation ---------- */
function validForm(d) {
  if (!d.pickup) return 'Please enter a pickup location.';
  if (!d.name) return 'Please enter your name.';
  if (!/^[0-9]{10}$/.test(d.mobile.replace(/\D/g, '').slice(-10)))
    return 'Please enter a valid 10-digit mobile number.';
  return null;
}

/* =========================================================
   OPTION 1 (PRIMARY): Send inquiry to WhatsApp
   Opens WhatsApp chat to business number with prefilled text.
   ========================================================= */
function sendToWhatsApp(data) {
  const text = encodeURIComponent(buildInquiryText(data));
  const url = `https://wa.me/${BIZ.phone}?text=${text}`;
  window.open(url, '_blank');
}

/* =========================================================
   OPTION 3 (RECOMMENDED for email-to-mobile): Web3Forms
   Sends inquiry to your email instantly (free). Get the
   notification on phone via Gmail / Outlook push.
   Requires BIZ.web3formsKey.
   ========================================================= */
async function sendViaWeb3Forms(data) {
  if (!BIZ.web3formsKey) return false;
  const payload = {
    access_key: BIZ.web3formsKey,
    subject: `New Taxi Inquiry: ${data.pickup} → ${data.drop || data.trip}`,
    from_name: data.name,
    ...data
  };
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) { return false; }
}

/* =========================================================
   MAIN: attach to every form with class "booking-form"
   ========================================================= */
document.querySelectorAll('.booking-form').forEach(form => {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = readForm(form);
    const err = validForm(data);
    if (err) { showToast(err); return; }

    // Fire email in background if Web3Forms key configured (Option 3)
    sendViaWeb3Forms(data);

    // Primary action -> WhatsApp (instant inquiry on your mobile)
    sendToWhatsApp(data);

    showToast('Inquiry ready! Opening WhatsApp to confirm…');
    form.reset();
    // restore default trip pill if present
    const firstPill = form.querySelector('input[name="trip"]');
    if (firstPill) firstPill.checked = true;
  });
});

/* ---------- Quick "Book this vehicle / route" buttons ---------- */
document.querySelectorAll('[data-wa-msg]').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const text = encodeURIComponent(this.dataset.waMsg);
    window.open(`https://wa.me/${BIZ.phone}?text=${text}`, '_blank');
  });
});
