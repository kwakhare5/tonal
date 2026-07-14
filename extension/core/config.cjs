(function(global) {
  const TONES = [
    { id: "casual", l: "Casual", s: "texting" },
    { id: "workChat", l: "Work Chat", s: "natural" },
    { id: "formal", l: "Formal", s: "professional" },
  ];

  if (typeof exports !== 'undefined') {
    exports.TONES = TONES;
  } else {
    global.TonalConfig = { TONES };
  }
})(typeof window !== 'undefined' ? window : this);
