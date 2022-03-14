export default [
  {
    type: 'text',
    value: '',
    options: {
      tag: 'p',
    }
  },
  {
    type: 'text',
    value: "Код с lang=css",
  },
  {
    type: 'code',
    value: ".custom-text-field.v-text-field.v-text-field--enclosed .v-input__slot {\n\tpadding: 0;\n}",
    options: {
      lang: 'css'
    }
  },
  {
    type: 'text',
    value: "Код с lang=css и контентом на python",
    options: {
      tag: 'h3'
    },
  },
  {
    type: 'code',
    value: "def factorial(n):\n    if n == 0 or n == 1:\n       …urn 1\n    else:\n        return n * factorial(n-1)",
    options: {
      lang: 'css'
    }
  },
  {
    type: 'text',
    value: "Код с lang=python",
  },
  {
    type: 'code',
    value: "def factorial(n):\n    if n == 0 or n == 1:\n       …urn 1\n    else:\n        return n * factorial(n-1)",
    options: {
      lang: 'python'
    }
  },
  {
    type: 'text',    
    value: "Массив видосиков vimeo",
  },
  {
    type: 'video_vimeo',
    value: [
      'https://player.vimeo.com/video/384162537',
      'https://player.vimeo.com/video/384499922',
      'https://player.vimeo.com/video/384479420',
    ],
  },
  {
    type: 'text',    
    value: "Ютуб видосик",

  },
  {
    type: 'video_youtube',
    value: 'https://youtu.be/aDaOgu2CQtI',
  }
]