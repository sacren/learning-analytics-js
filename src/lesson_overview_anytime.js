/*!
  * lesson_overview_anytime.js v0.1.0
  * (c) Jεan Sacren <sakiwit@gmail.com>
  * AGPL-3.0
  */
window.jQuery(function ($) {
  function getPercent (a, b) {
    var p = a / b * 100

    if (p >= 10) {
      p = p.toPrecision(3)
    } else {
      p = p.toPrecision(2)
    }

    return p
  }

  function checkUrl (url) {
    var forUvu = [
      'for-uvu',
      'github',
      'io'
    ]
    var hostname = window.location.hostname.split('.')

    if (hostname.every(function (x) {
      return forUvu.includes(x)
    })) {
      return url.replace('pages', 'pages-for-uvu')
    }

    return url
  }

  function getLesson (s) {
    var tmp

    tmp = s.split('/')
    tmp = tmp[tmp.length - 1].split('-')

    for (var i = 0; i < tmp.length; i++) {
      if (Number(tmp[i])) { return tmp[i] }
    }
  }

  function getLessonMsg (overview, course) {
    var msg = ' students visited overview page.'
    var userCount = course.length
    var lessonMsg = ''
    var lesson, count

    /* sort the array in increase order */
    overview.lessonId.sort(function (a, b) { return a - b })

    for (var i = 0; i < overview.lessonId.length; i++) {
      lesson = '<div>Lesson ' + overview.lessonId[i] + ':</div>'
      count = overview[ overview.lessonId[i] ].length

      switch (count) {
        case 0:
          lessonMsg += lesson + '<div>No ' + msg + '</div>'
          break
        case userCount:
          lessonMsg += lesson + '<div>' + userCount + ' or 100%' + msg + '</div>'
          break
        default:
          lessonMsg += lesson + '<div>' + count + ' or ' + getPercent(count, userCount) + '%' + msg + '</div>'
      }
    }

    return lessonMsg
  }

  function setForm () {
    $('form input').val('Show Overview Anytime')
  }

  function setDisplayMsg () {
    $('form + div').html('Would you like to show overview page per lesson at any time?')
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/pages.php'

    url = checkUrl(url)
    $('form input').prop('disabled', true)
    $('form + div').html('Pulling data, please wait...')

    $.post(url, $(this).serialize(), function (data) {
      var pattern = /(week|lesson)-([1-9]|1[0-6])-overview|overview-(lesson|week)-([1-9]|1[0-6])/i
      var d = JSON.parse(data)
      var courseUsers = []
      var overviewUsers = {
        lessonId: []
      }
      var course, selected

      if (d.length === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      $('select option:selected').text(function (i, s) {
        course = '<div>At any time: ' + s.replace(/-/g, ' ') + '</div>'
        return s
      })

      $('select option:selected').val(function (i, s) {
        selected = parseInt(s)
        return s
      })

      for (var i in d) {
        var courseId = parseInt(d[i]['course_id'])
        var uid = parseInt(d[i]['user_id'])
        var match = d[i]['http_request_clean']
        var lesson

        if (courseId !== selected) { continue }

        if (!courseUsers.some(function (x) { return x === uid })) { courseUsers.push(uid) }

        if (pattern.test(match)) {
          lesson = getLesson(match)
          if (!overviewUsers.lessonId.some(function (x) { return x === lesson })) {
            overviewUsers.lessonId.push(lesson)
          }

          if (overviewUsers.hasOwnProperty(lesson)) {
            if (!overviewUsers[lesson].some(function (x) { return x === uid })) {
              overviewUsers[lesson].push(uid)
            }
          } else {
            overviewUsers[lesson] = [ uid ]
          }
        }
      }

      if (courseUsers.length === 0) {
        $('form + div').html(function () {
          return course + '<div>No enrollment.</div>'
        })

        return
      }

      if (overviewUsers.lessonId.length === 0) {
        $('form + div').html(function () {
          return course + '<div>No student visited overview page of any lesson.</div>'
        })

        return
      }

      $('form + div').html(function () {
        return course + '<article>' + getLessonMsg(overviewUsers, courseUsers) + '</article>'
      })
    }).fail(function () {
      window.alert('Error: Pulling data!')
    })

    return false
  })

  $('form > select').change(function () {
    $('form input').prop('disabled', false)
    setDisplayMsg()
  })

  function init () {
    setDisplayMsg()
    setForm()
  }

  init()
})
