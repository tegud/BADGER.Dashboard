(function() {
  'use strict';
  TLRGRP.messageBus.setUpClearDown = (function() {
    var subscribedMessages = {};
    var originalPublish = TLRGRP.messageBus.publish;
    var originalSubscribe = TLRGRP.messageBus.subscribe;
    
    function wrappedSubscribe (eventName, callback) {
      if(!subscribedMessages[eventName]) {
        subscribedMessages[eventName] = [callback];
      }
      else {
        subscribedMessages[eventName].push(callback);
      }

      originalSubscribe(eventName, callback);
    }

    function attachMessageSubscriberTracking() {
      TLRGRP.messageBus.subscribe = wrappedSubscribe;
    }

    function clearDownSubscribedEvents() {
      _(subscribedMessages).each(function(callbacks, eventName) {
        _(callbacks).each(function(callback){
          TLRGRP.messageBus.unsubscribe(eventName, callback);
        });
      });
    }
    
    return function() {
      beforeEach(function() {
        attachMessageSubscriberTracking();
      });

      afterEach(function() {
        clearDownSubscribedEvents();
      });  
    };
  })();
})();