export default function(Handlebars) {
  if ('breaklines' in Handlebars.helpers) return;

  Handlebars.registerHelper('breaklines', text => {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
  });
}
