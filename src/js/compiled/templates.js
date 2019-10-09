var Handlebars = require("handlebars/runtime");
 exports["comment"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

  return "<div class=\"vac-comment\" data-id=\""
    + alias5(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"vac-comment-header\">\n    <div class=\"vac-author-name\">"
    + alias5(container.lambda(((stack1 = (depth0 != null ? depth0.meta : depth0)) != null ? stack1.user_name : stack1), depth0))
    + "</div>\n    <div class=\"vac-timestamp\">"
    + alias5(((helper = (helper = helpers.timeSince || (depth0 != null ? depth0.timeSince : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"timeSince","hash":{},"data":data}) : helper)))
    + "\n      <span class=\"vac-delete-comment\">&nbsp;&nbsp;X</span>\n    </div>\n  </div>\n  <div class=\"vac-comment-body\">\n    "
    + alias5((helpers.breaklines||(depth0 && depth0.breaklines)||alias3).call(alias2,(depth0 != null ? depth0.body : depth0),{"name":"breaklines","hash":{},"data":data}))
    + "\n  </div>\n</div>\n";
},"useData":true});
exports["comment_list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "      "
    + ((stack1 = container.lambda(blockParams[0][0], depth0)) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"vac-comments-container\">\n  <div class=\"vac-comments-wrap\">\n"
    + ((stack1 = helpers.each.call(alias2,(depth0 != null ? depth0.commentsHTML : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "    <div class=\"vac-reply-btn vac-button\">ADD REPLY</div>\n    <div class=\"vac-add-new-shapebox\"></div>\n  </div>\n  <div class=\"vac-comments-control-bar\">\n    <div class=\"vac-range\"><b>@</b> "
    + container.escapeExpression(((helper = (helper = helpers.rangeStr || (depth0 != null ? depth0.rangeStr : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"rangeStr","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "</div>\n    <div class=\"vac-control-buttons\">\n      <a class=\"vac-delete-annotation\">DELETE</a> | <a class=\"vac-close-comment-list\">CLOSE</a>\n    </div>\n  </div>\n</div>\n";
},"useData":true,"useBlockParams":true});
exports["controls"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.propertyIsEnumerable;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.showControls : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.propertyIsEnumerable;

  return "        <div class=\"vac-controls vac-control\">\n            <button class=\"vac-button\">+ NEW</button>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.showNav : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "                <div class=\"vac-annotation-nav\">\n                    <div class=\"vac-a-prev\">Prev</div>\n                    <div class=\"vac-a-next\">Next</div>\n                </div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <div class=\"vac-video-cover vac-control\">\n        <div class=\"vac-video-cover-canvas\">\n            <div class=\"vac-cursor-tool-tip vac-hidden\">Click and drag to select</div>\n        </div>\n    </div>\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.showControls : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.writingComment : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.propertyIsEnumerable;

  return "        <div class=\"vac-add-controls vac-control\">\n            <i>Select shape + range</i>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.internalCommenting : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <div class=\"vac-video-move\">\n                <div class=\"vac-a-prev\">-1 sec</div>\n                <div class=\"vac-a-next\">+1 sec</div>\n            </div>\n        </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"vac-button\">CONTINUE</button>\n                <a>cancel</a>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.propertyIsEnumerable;

  return "        <div class=\"vac-video-write-new-wrap vac-control\">\n            <div class=\"vac-video-write-new vac-is-annotation\">\n                <div>\n                    <h5><b>New Annotation</b> @ "
    + container.escapeExpression(((helper = (helper = helpers.rangeStr || (depth0 != null ? depth0.rangeStr : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"rangeStr","hash":{},"data":data}) : helper)))
    + "</h5>\n                    <div class=\"vac-comment-showbox\">\n                        <textarea placeholder=\"Enter comment...\"></textarea>\n                        <div>\n                            <button class=\"vac-button\">SAVE</button>\n                            <a>Cancel</a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.unless.call(alias2,(depth0 != null ? depth0.adding : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.adding : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
exports["draggable_marker"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

  return "<div data-marker-id=\""
    + alias5(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"vac-marker-draggable vac-ranged-marker\" style=\"left: "
    + alias5(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"left","hash":{},"data":data}) : helper)))
    + "; width:"
    + alias5(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"width","hash":{},"data":data}) : helper)))
    + ";\">\n</div>\n";
},"useData":true});
exports["marker"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "vac-ranged-marker";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.propertyIsEnumerable;

  return "width:"
    + container.escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"width","hash":{},"data":data}) : helper)))
    + ";";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.propertyIsEnumerable;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.tooltipBody : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

  return "            <div>\n                <span class=\"vac-tooltip "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.tooltipRight : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                    <b>"
    + alias5(((helper = (helper = helpers.tooltipTime || (depth0 != null ? depth0.tooltipTime : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"tooltipTime","hash":{},"data":data}) : helper)))
    + "</b> - "
    + alias5(((helper = (helper = helpers.tooltipBody || (depth0 != null ? depth0.tooltipBody : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"tooltipBody","hash":{},"data":data}) : helper)))
    + "\n                </span>\n            </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "vac-right-side";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

  return "<div data-marker-id=\""
    + alias5(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"vac-marker "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.rangeShow : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" style=\"left: "
    + alias5(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"left","hash":{},"data":data}) : helper)))
    + "; "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.rangeShow : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " z-index: "
    + alias5(((helper = (helper = helpers.zIndex || (depth0 != null ? depth0.zIndex : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"zIndex","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.showTooltip : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
exports["marker_wrap"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"vac-marker-owrap\">\n	<div class=\"vac-marker-wrap\"></div>\n</div>";
},"useData":true});
exports["new_comment"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.propertyIsEnumerable, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", alias5=container.escapeExpression;

  return "<div class=\"vac-video-write-new-wrap vac-new-comment\">\n  <div class=\"vac-video-write-new vac-is-comment\">\n    <div class=\"vac-comment-showbox\" style=\"width:"
    + alias5(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"width","hash":{},"data":data}) : helper)))
    + "px;top:"
    + alias5(((helper = (helper = helpers.top || (depth0 != null ? depth0.top : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"top","hash":{},"data":data}) : helper)))
    + "px;right:"
    + alias5(((helper = (helper = helpers.right || (depth0 != null ? depth0.right : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"right","hash":{},"data":data}) : helper)))
    + "px\">\n      <textarea placeholder=\"Enter comment...\"></textarea>\n      <div>\n        <button class=\"vac-button\">SAVE</button>\n        <a>Cancel</a>\n      </div>\n    </div>\n</div>\n";
},"useData":true});
exports["player_button"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<b></b>\n<i class=\"vac-player-icon\">\n	<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\n	    <path d=\"M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z\"/>\n	    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n	</svg>\n</i>";
},"useData":true});