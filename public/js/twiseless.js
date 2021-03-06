(function($) {
  var methods = {
    render: function() {
      $.getJSON("/mentions", function(data) {

      var viz = new $jit.Sunburst({
	injectInto: 'viz',
	Node: {
	  overridable: true,
	  type: 'multipie'
	},
	Edge: {
	  overridable: true,
	  type: 'hyperline',
	  lineWidth: 2,
	  color: '#990033'
	},
	Label: {
	  type: 'Native'
	},
	NodeStyles: {
	  enable: true,
	  type: 'Native',
	  stylesClick: {
	    'color': '#990033'
	  },
	  stylesHover: {
	    'color': '#CCCC99'
	  },
	  duration: 700
	},
	Events: {
	  enable: true,
	  type: 'Native',
	  onClick: function(node, eventInfo, e) {
	    if (!node) return;
	    var tweets = $("#tweets");
	    tweets.empty();
	    tweets.hide();

	    tweets.append($("<div><span>"+node.name+" said:</span></div>").addClass('tweet-info'));

	    $.getJSON("/tweets/" + node.id, function(data) {
		for(var lang in data) {
		    var block = $("<div />").addClass('tweet-block');
		    block.append($("<div><span>Language: "+lang+"</span></div>").addClass('tweet-lang'));
		    $.each(data[lang], function(i, tweet) {
			block.append($("<div />").addClass('tweet').append(tweet.text));
		    });
		    tweets.append(block);
		}
		tweets.show('slow');
	    });
	    
           viz.rotate(node, 'animate', {  
               duration: 1000,  
               transition: $jit.Trans.Quart.easeInOut  
           });
	  },
	  levelDistance: 90,
	  onCreateLabel: function(domElement, node){
	    var labels = viz.config.Label.type;
	    if (labels === 'HTML') {
	      domElement.innerHTML = node.name;
	    } else if (labels === 'SVG') {
	      domElement.firstChild.appendChild(document.createTextNode(node.name));
	    }
	  },
	  onPlaceLabel: function(domElement, node){
	    var labels = viz.config.Label.type;
	    if (labels === 'SVG') {
	      var fch = domElement.firstChild;
	      var style = fch.style;
	      style.display = '';
	      style.cursor = 'pointer';
	      style.fontSize = "0.8em";
	      fch.setAttribute('fill', "#fff");
	    } else if (labels === 'HTML') {
	      var style = domElement.style;
	      style.display = '';
	      style.cursor = 'pointer';
	      if (node._depth <= 1) {
		style.fontSize = "0.8em";
		style.color = "#ddd";
	      }
	      var left = parseInt(style.left);
	      var w = domElement.offsetWidth;
	      style.left = (left - w / 2) + 'px';
	    }
	  }
	}
      });
      viz.loadJSON(data);
      viz.refresh();
      });
    }
  };

  $.fn.twiseless = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || ! method) {
	return methods.init.apply(this, arguments);
      } else {
	$.error('Method ' +  method + ' does not exist on jQuery.twiseless');
      }
  };
})(jQuery);
