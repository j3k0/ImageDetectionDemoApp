/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        var imgDetectionPlugin = window.plugins.ImageDetectionPlugin || new ImageDetectionPlugin();

        imgDetectionPlugin.startProcessing(true, function(success){console.log(success);}, function(error){console.log(error);});

        imgDetectionPlugin.isDetecting(function(success){
          // console.log(success);
          var resp = JSON.parse(success);
          // alert("Image detected: " + indexes[resp.index]);
          // alert(success);
          var color = ["red","green","blue","yellow","pink","cyan","lightgreen","violet","orange","black"];
          document.getElementById('readmore' + resp.index).setAttribute('style', 
            'width: 20px;' +
            'height: 20px;' +
            'background: ' + color[resp.index] + ';' +
            'position: absolute;' +
            'left: ' + Math.round(0.5 * resp.corners[0][0]) + 'px;' +
            'top: ' + Math.round(0.5 * resp.corners[0][1]) + 'px;' +
            'display: block;');
        }, function(error){
          try {
            var resp = JSON.parse(error);
            document.getElementById('readmore' + resp.index).setAttribute('style', 'display: none');
            console.log(resp.message);
          }
          catch (e) {
            console.log(error);
          }
        });

        function setAllPatterns(patterns) {
          imgDetectionPlugin.setPatterns(patterns, function(success){console.log(success);}, function(error){console.log(error);});
        }

        var loadAllImg = 0;
        var patternsHolder = [];
        var indexes = {};

        function ToDataURL (self) {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var dataURL;
          canvas.height = self.height;
          canvas.width = self.width;
          ctx.drawImage(self, 0, 0);
          dataURL = canvas.toDataURL("image/jpeg", 0.8);
          patternsHolder.push(dataURL);
          indexes[loadAllImg] = self.src.substr(self.src.lastIndexOf("/") + 1);
          loadAllImg += 1;
          console.log("!!!", loadAllImg, indexes);
          if(loadAllImg == numTargets){
            console.log("patterns set", patternsHolder);
            setAllPatterns(patternsHolder);
          }
          canvas = null;
        }

        function addTarget(url) {
          var img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = function(){
            ToDataURL(this)
          };
          img.src = url;
        }

        var numTargets = 10;
        addTarget("img/patterns/target1.jpg");
        addTarget("img/patterns/target2.jpg");
        addTarget("img/patterns/target3.jpg");
        addTarget("img/patterns/target4.png");
        addTarget("img/patterns/bag1.jpeg");
        addTarget("img/patterns/bag2.jpeg");
        addTarget("img/patterns/bag3.jpeg");
        addTarget("img/patterns/bag4.jpeg");
        addTarget("img/patterns/bag5.jpeg");
        addTarget("img/patterns/ruban.png");
    }
};

app.initialize();
