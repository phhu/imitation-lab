API docs for google magenta: https://magenta.github.io/magenta-js/music/

Need to look at https://github.com/surikov/webaudiofont

Proof it works :https://surikov.github.io/webaudiofont/examples/midikey.html played from https://apps.musedlab.org/aqwertyon/?video=R7iNSUoQ4Lk&sound=rock_organ&

Should look at https://github.com/surikov/webaudiofont - might be possible to be virtual instrument 

==sending midi==

// see https://kulak.medium.com/web-midi-api-sending-notes-from-javascript-to-your-synth-1dfee9c57645

Hopefully can just send notes to midi through!

```js
let midiOutput = null;
navigator.requestMIDIAccess()
.then(function(midiAccess) {
  const outputs = Array.from(midiAccess.outputs.values());
  console.log(outputs);
});
```