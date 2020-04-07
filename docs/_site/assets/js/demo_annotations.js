(function () {
  window.demoAnnotations = [
    {
      id: 1,
      range: {
        start: 12,
        end: 16
      },
      shape: null,
      comments: [
        {
          id: 1,
          meta: {
            datetime: '2017-03-28T19:17:32.238Z',
            user_id: 1,
            user_name: 'Jack'
          },
          body: 'Can we swap these for the new icons?'
        },
        {
          id: 4,
          meta: {
            datetime: '2017-03-28T19:17:32.238Z',
            user_id: 2,
            user_name: 'Blaise'
          },
          body: 'Yes I will update this afternoon.'
        }
      ]
    },
    {
      id: 2,
      range: {
        start: 1,
        stop: 1
      },
      shape: {
        x1: 34,
        y1: 28,
        x2: 65,
        y2: 71
      },
      comments: [
        {
          id: 2,
          meta: {
            datetime: '2017-03-28T19:17:32.238Z',
            user_id: 1,
            user_name: 'Jack'
          },
          body: 'Can you make this logo bigger?'
        },
        {
          id: 3,
          meta: {
            datetime: '2017-03-28T19:17:32.238Z',
            user_id: 2,
            user_name: 'Blaise'
          },
          body: "Sure, I'll make it fill the screen some more in the next draft."
        }
      ]
    }
  ];
})();
