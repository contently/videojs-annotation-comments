var Handlebars = require("handlebars/runtime");

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['comment.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"vac-comment\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"vac-comment-header\">\n    <div class=\"vac-author-name\">"
    + alias4(container.lambda(((stack1 = (depth0 != null ? depth0.meta : depth0)) != null ? stack1.user_name : stack1), depth0))
    + "</div>\n    <div class=\"vac-timestamp\">"
    + alias4(((helper = (helper = helpers.timeSince || (depth0 != null ? depth0.timeSince : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"timeSince","hash":{},"data":data}) : helper)))
    + " ago\n      <span class=\"vac-delete-comment\">&nbsp;&nbsp;X</span>\n    </div>\n  </div>\n  <div class=\"vac-comment-body\">\n    "
    + alias4((helpers.breaklines || (depth0 && depth0.breaklines) || alias2).call(alias1,(depth0 != null ? depth0.body : depth0),{"name":"breaklines","hash":{},"data":data}))
    + "\n  </div>\n</div>\n";
},"useData":true});
templates['comment_list.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "      "
    + ((stack1 = container.lambda(blockParams[0][0], depth0)) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"vac-comments-container\">\n  <div class=\"vac-comments-wrap\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.commentsHTML : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "    <div class=\"vac-reply-btn vac-button\">ADD REPLY</div>\n    <div class=\"vac-add-new-shapebox\"></div>\n  </div>\n  <div class=\"vac-comments-control-bar\">\n    <div class=\"vac-range\"><b>@</b> "
    + container.escapeExpression(((helper = (helper = helpers.rangeStr || (depth0 != null ? depth0.rangeStr : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"rangeStr","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "</div>\n    <div class=\"vac-control-buttons\">\n      <a class=\"vac-delete-annotation\">DELETE</a> | <a class=\"vac-close-comment-list\">CLOSE</a>\n    </div>\n  </div>\n</div>\n";
},"useData":true,"useBlockParams":true});
templates['controls.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"vac-controls vac-control\">\n        <button class=\"vac-button\">+ NEW</button>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.showNav : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "            <div class=\"vac-annotation-nav\">\n                <div class=\"vac-a-prev\">Prev</div>\n                <div class=\"vac-a-next\">Next</div>\n            </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <div class=\"vac-video-cover vac-control\">\n        <div class=\"vac-video-cover-canvas\"></div>\n    </div>\n\n    <div class=\"vac-add-controls vac-control\">\n        <i>Select shape + range</i>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.internalCommenting : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"vac-video-move\">\n            <div class=\"vac-a-prev\">-1 sec</div>\n            <div class=\"vac-a-next\">+1 sec</div>\n        </div>\n    </div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.writingComment : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "            <button class=\"vac-button\">CONTINUE</button>\n            <a>cancel</a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        <div class=\"vac-video-write-new-wrap vac-control\">\n            <div class=\"vac-video-write-new vac-is-annotation\">\n                <div>\n                    <h5><b>New Annotation</b> @ "
    + container.escapeExpression(((helper = (helper = helpers.rangeStr || (depth0 != null ? depth0.rangeStr : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"rangeStr","hash":{},"data":data}) : helper)))
    + "</h5>\n                    <div class=\"vac-comment-showbox\">\n                        <textarea placeholder=\"Enter comment...\"></textarea>\n                        <div>\n                            <button class=\"vac-button\">SAVE</button>\n                            <a>Cancel</a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.adding : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.adding : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['draggable_marker.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"vac-marker-draggable ranged-marker\" style=\"left: "
    + alias4(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"left","hash":{},"data":data}) : helper)))
    + "; width:"
    + alias4(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width","hash":{},"data":data}) : helper)))
    + ";\">\n</div>\n";
},"useData":true});
templates['marker.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "ranged-marker";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "width:"
    + container.escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"width","hash":{},"data":data}) : helper)))
    + ";";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.tooltipBody : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div>\n                <span class=\"vac-tooltip "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.tooltipRight : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                    <b>"
    + alias4(((helper = (helper = helpers.tooltipTime || (depth0 != null ? depth0.tooltipTime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tooltipTime","hash":{},"data":data}) : helper)))
    + "</b> - "
    + alias4(((helper = (helper = helpers.tooltipBody || (depth0 != null ? depth0.tooltipBody : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tooltipBody","hash":{},"data":data}) : helper)))
    + "\n                </span>\n            </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "vac-right-side";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"vac-marker "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.rangeShow : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" style=\"left: "
    + alias4(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"left","hash":{},"data":data}) : helper)))
    + "; "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.rangeShow : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " z-index: "
    + alias4(((helper = (helper = helpers.zIndex || (depth0 != null ? depth0.zIndex : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"zIndex","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showTooltip : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
templates['new_comment.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"vac-video-write-new-wrap vac-new-comment\">\n  <div class=\"vac-video-write-new vac-is-comment\">\n    <div class=\"vac-comment-showbox\" style=\"width:"
    + alias4(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width","hash":{},"data":data}) : helper)))
    + "px;top:"
    + alias4(((helper = (helper = helpers.top || (depth0 != null ? depth0.top : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"top","hash":{},"data":data}) : helper)))
    + "px;right:"
    + alias4(((helper = (helper = helpers.right || (depth0 != null ? depth0.right : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"right","hash":{},"data":data}) : helper)))
    + "px\">\n      <textarea placeholder=\"Enter comment...\"></textarea>\n      <div>\n        <button class=\"vac-button\">SAVE</button>\n        <a>Cancel</a>\n      </div>\n    </div>\n</div>\n";
},"useData":true});
})();