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

Operations:
 compare
 rec
 vary

Youtube loop example: https://codepen.io/ekwibrium/pen/JjKeyLY?editors=0010

Modification to react-piano-esm.js to get caps lock to work
for octave shift
```js
    _defineProperty(_assertThisInitialized(_this), "getMidiNumberForKey", function (key,event) {
      if (!_this.props.keyboardShortcuts) {
        return null;
      }
      var capsLockOn = event && event.getModifierState && event.getModifierState("CapsLock")
      var shortcut = _this.props.keyboardShortcuts.find(function (sh) {
        return sh.key === key.toLowerCase();
      });

      return shortcut && (shortcut.midiNumber + (capsLockOn ? 12 : 0) );
    });

    _defineProperty(_assertThisInitialized(_this), "getKeyForMidiNumber", function (midiNumber) {
      if (!_this.props.keyboardShortcuts) {
        return null;
      }

      var shortcut = _this.props.keyboardShortcuts.find(function (sh) {
        return sh.midiNumber === midiNumber;
      });

      return shortcut && shortcut.key;
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDown", function (event) {
      //console.log("reactpiano key down esm", event,capsLockOn)
      // Don't conflict with existing combinations like ctrl + t
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      var midiNumber = _this.getMidiNumberForKey(event.key,event) ;

      if (midiNumber) {
        _this.onPlayNoteInput(midiNumber);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyUp", function (event) {
      // This *should* also check for event.ctrlKey || event.metaKey || event.ShiftKey like onKeyDown does,
      // but at least on Mac Chrome, when mashing down many alphanumeric keystrokes at once,
      // ctrlKey is fired unexpectedly, which would cause onStopNote to NOT be fired, which causes problematic
      // lingering notes. Since it's fairly safe to call onStopNote even when not necessary,
      // the ctrl/meta/shift check is removed to fix that issue.
      
      var midiNumber = _this.getMidiNumberForKey(event.key,event);

      if (midiNumber) {
        _this.onStopNoteInput(midiNumber);
      }
    });
    ```