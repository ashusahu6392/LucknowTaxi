/* =========================================================
   Google Places Autocomplete — Pickup & Drop
   ---------------------------------------------------------
   1. Get an API key:  https://console.cloud.google.com/
      Enable: "Maps JavaScript API" + "Places API"
   2. Restrict the key to your domain (lucknowtaxi.com/*)
   3. In each HTML page, the loader script calls initAutocomplete:
      <script async
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places&loading=async&callback=initAutocomplete">
      </script>
   ---------------------------------------------------------
   NOTE: If the key is missing/invalid, the pickup & drop fields
   still work as normal text inputs (graceful fallback).
   ========================================================= */

function initAutocomplete() {
  if (!(window.google && google.maps && google.maps.places)) return;

  const options = {
    componentRestrictions: { country: 'in' },     // limit to India
    fields: ['formatted_address', 'name', 'geometry'],
    types: ['geocode', 'establishment']
  };

  // Bias results toward Lucknow
  const lucknowBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(26.30, 80.70),
    new google.maps.LatLng(27.10, 81.30)
  );

  document.querySelectorAll('.places-autocomplete').forEach(input => {
    const ac = new google.maps.places.Autocomplete(input, options);
    ac.setBounds(lucknowBounds);
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      // store a clean value for the form/WhatsApp message
      if (place && (place.formatted_address || place.name)) {
        input.value = place.name && place.formatted_address &&
          !place.formatted_address.startsWith(place.name)
          ? `${place.name}, ${place.formatted_address}`
          : (place.formatted_address || place.name);
      }
    });

    // prevent form submit when picking a suggestion with Enter
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') e.preventDefault();
    });
  });
}

// Expose globally for the async callback
window.initAutocomplete = initAutocomplete;
