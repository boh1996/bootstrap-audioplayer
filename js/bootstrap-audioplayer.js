/* ==========================================================
 * bootstrap-affix.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


 /* AUDIO PLAYER CLASS DEFINITION
  * ====================== */
  var AudioPlayer = function (element, options) {
    this.options = $.extend({}, $.fn.audioplayer.defaults, options);
    this.$element = $(element);
    this.$audio = $(element).find("audio").get(0);
    this.songs = options.songs || this.$audio.src;
    this.currentSong = options.song || 0;
    if (this.$audio.length == 0) return;

    if (this.$element.find("div.playback").length > 0) {
      var playback = this.$element.find("div.playback");
      var volume = this.$element.find("div.volume");

      if (this.$audio.paused)
        this.$element.find("div.playback button.playback-play i:first").addClass("icon-play").removeClass("icon-pause");
      else
        this.$element.find("div.playback button.playback-play").find("i").addClass("icon-pause").removeClass("icon-play");

      //Prev
      $(playback).find(".playback-prev").live("click",$.proxy(function(){this.prev()},this));

      //Next
      $(playback).find(".playback-next").live("click",$.proxy(function(){this.next()},this));

      $(volume).find(".volume-down").live("click",$.proxy(function(){
        if (this.$audio.volume*100 != 0) this.volume(this.$audio.volume*100 - 10)
      },this));

      $(volume).find(".volume-up").live("click",$.proxy(function(){
        if (this.$audio.volume*100 != 100) this.volume(this.$audio.volume*100 + 10)
      },this));

       $(volume).find(".volume-mute").live("click",$.proxy(function(){
        if (this.$audio.volume > 0) {
          this.volume(0);
        } else {
          this.volume(100);
        }
      },this));

      //On done event
      $(this.$audio).bind('ended', $.proxy(function(){
        this.$element.find("div.playback button.playback-play i:first").addClass("icon-play").removeClass("icon-pause");
      },this));
      
      //Pause/Play
      $(playback).find(".playback-play").live("click",$.proxy(function(){
        if (this.$audio.src == ""){
          this.play(0);
          return;
        } 
        if (this.$audio.paused) {
          this.play(this.currentSong);
        } else {
          this.pause();
        }
      },this));
    }
  }

  AudioPlayer.prototype.volume = function (volume) {
    if (volume > 1 || volume == 0) {
      this.$audio.volume = volume/100;
    }
    if (this.$audio.volume < 0.1) {
      this.$audio.volume = 0;
    }
    if (this.$audio.volume > 0.9) {
      this.$audio.volume = 1;
    }
  }

  AudioPlayer.prototype.prev = function () {
    var paused = this.$audio.paused;
    var newSong = this.currentSong;
    if ($(this.songs).length > 1) {
      if (this.currentSong == 0) 
         newSong = $(this.songs).length -1; 
      else
         newSong--;
      this.change(newSong);
      if (!paused) this.play(newSong);
    }
  }

  AudioPlayer.prototype.next = function () {
    var paused = this.$audio.paused;
    var newSong = this.currentSong;
    if ($(this.songs).length > 1) {
      if (this.currentSong == $(this.songs).length -1)
        newSong = 0; 
      else 
       newSong++;
      this.change(newSong);
      if (!paused) this.play(newSong);     
    }
  }

  AudioPlayer.prototype.change = function (song) {
    if (typeof this.songs[song] != "undefined") {
      if (this.currentSong != song) {
        this.currentSong = song;
        if (this.$audio.src != this.songs[song]) this.$audio.src = this.songs[song];
      } else {
        if (this.$audio.src == "") this.$audio.src = this.songs[song];
      }
    }
  }

  AudioPlayer.prototype.play = function(song) {
    if (typeof this.songs[song] != "undefined") {
      this.change(song);
      $(this.$audio).trigger("play");
      this.$element.find("div.playback button.playback-play").find("i").addClass("icon-pause").removeClass("icon-play");
    }
  }

  AudioPlayer.prototype.pause = function () {
    $(this.$audio).trigger("pause");
    this.$element.find("div.playback button.playback-play i:first").addClass("icon-play").removeClass("icon-pause");
  }

 /* AUDIO PLAYER PLUGIN DEFINITION
  * ======================= */

  $.fn.audioplayer = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('audioplayer')
        , options = typeof option == 'object' && option;
      if (!data) {
        $this.data('audioplayer', (data = new AudioPlayer(this, options)));
      }
      if (typeof option == 'string') {
        data[option]()
      }
    })
  }

  $.fn.audioplayer.Constructor = AudioPlayer

  $.fn.audioplayer.defaults = {
    offset: 0
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-audioplayer="audioplayer"]').each(function () {
      var $player = $(this)
        , data = $player.data()

      $player.audioplayer(data)
    })
  })


}(window.jQuery);
