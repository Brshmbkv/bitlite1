const decodeHTML = (text) => {
  if (!text) return ''
  let map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  }
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {
    return map[m]
  })
}

// https://gist.github.com/takien/4077195
function YouTubeGetID(url) {
  url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0] //eslint-disable-line
}

const getCourseConfig = (id) => {
  return {
    5: {
      path: 'clike',
      mode: 'text/x-java',
    },
    1: {
      path: 'go',
      mode: 'text/x-go',
    },
    3: {
      path: 'clike',
      mode: 'text/x-c++src',
    },
    4: {
      path: 'python',
      mode: 'text/x-python',
    },
    6: {
      path: 'php',
      mode: 'x-httpd-php',
    },
    7: {
      path: 'clike',
      mode: 'text/x-java',
    },
    2: {
      path: 'clike',
      mode: 'text/x-java',
    },
    10: {
      path: 'php',
      mode: 'x-httpd-php',
    },
    11: {
      path: 'clike',
      mode: 'text/x-java',
    },
    8: {
      path: 'swift',
      mode: 'text/x-swift',
    },
    9: {
      path: 'xml',
      mode: 'application/xml'
    },
    12: {
      path: 'python',
      mode: 'text/x-python',
    },
    13: {
      path: 'python',
      mode: 'text/x-python',
    },
  }[id]
}

export { decodeHTML, YouTubeGetID, getCourseConfig }
