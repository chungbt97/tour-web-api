const text2Speech = (text = "", speed = 1, volume = 1) => {
  const voiceList = window.speechSynthesis.getVoices();
  const globalVoices = voiceList.filter((i) => i.lang.indexOf("en") !== -1);

  const speech = new SpeechSynthesisUtterance();
  window.speechSynthesis.cancel();

  speech.lang = "en";
  speech.text = text;
  speech.volume = volume;
  speech.voice = globalVoices[0];
  speech.rate = speed;

  window.speechSynthesis.speak(speech);
};