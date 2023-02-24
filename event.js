window.EventCapable = {
  on: function (event, fn) {
    this.evts = this.evts || {};
    this.evts[event] = this.evts[event] || [];
    this.evts[event].push(fn);
  },
  off: function (event, fn) {
    this.evts = this.evts || {};
    if (event in this.evts) {
      this.evts[event].splice(this.evts[event].indexOf(fn), 1);
    }
  },
  fire: function (event /* , args... */) {
    this.evts = this.evts || {};
    if (event in this.evts) {
      for (var i = 0; i < this.evts[event].length; i++){
        this.evts[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
      }
    }
  }
};