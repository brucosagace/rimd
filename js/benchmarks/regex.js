module.exports = {
  name: 'RegEx',
  tests: {
    'match': function() {
      var content  = '<img src="images/IMGP1463.jpg" alt="Pirru" />',
          srcRex   = /src="([^"]+)/g,
          altRex   = /alt="([^"]+)/g,
          titleRex = /title="([^"]+)/g,
          result   = {},
          src, alt, title;

      src = content.match(srcRex);
      alt = content.match(altRex);
      title = content.match(titleRex);

      if(src && src[1]) result.src = src[1];
      if(alt && alt[1]) result.alt = alt[1];
      if(title && title[1]) result.title = title[1];
    },
    'exec': function() {
      var content  = '<img src="images/IMGP1463.jpg" alt="Pirru" />',
          srcRex   = /src="([^"]+)/g,
          altRex   = /alt="([^"]+)/g,
          titleRex = /title="([^"]+)/g,
          result   = {},
          src, alt, title;

      src = srcRex.exec(content);
      alt = altRex.exec(content);
      title = titleRex.exec(content);

      if(src && src[1]) result.src = src[1];
      if(alt && alt[1]) result.alt = alt[1];
      if(title && title[1]) result.title = title[1];
    }
  }
}