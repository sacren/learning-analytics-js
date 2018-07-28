/*!
  * lesson_overview_anytime.js v0.1.0
  * (c) Jεan Sacren <sakiwit@gmail.com>
  * AGPL-3.0
  */
window.jQuery(function ($) {
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

  function setForm () {
    $('form input').val('Show Overview Anytime')
  }

  function setDisplayMsg () {
    $('form + div').html('Would you like to show overview page per lesson at any time?')
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/pages.php'
    var msg = 'Pulling data, please wait...'

    url = checkUrl(url)
    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var msg = ' students visited overview page.'
      var pattern = /(week|lesson)-([1-9]|1[0-6])-overview|overview-(lesson|week)-([1-9]|1[0-6])/i
      var d = JSON.parse(data)
      var courseUsers = []
      var overviewUsers = {
        lessonId: []
      }
      var lessonMsg = ''
      var p, course, selected, userCount

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

      userCount = courseUsers.length

      if (userCount === 0) {
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

      /* sort the array in increase order */
      overviewUsers.lessonId.sort(function (a, b) { return a - b })

      for (var j = 0; j < overviewUsers.lessonId.length; j++) {
        var lessonId, count, lessonStr

        lessonId = overviewUsers.lessonId[j]
        lessonStr = '<div>Lesson ' + lessonId + ':</div>'
        count = overviewUsers[lessonId].length

        switch (count) {
          case 0:
            lessonMsg += lessonStr + '<div>No ' + msg + '</div>'
            break
          case userCount:
            lessonMsg += lessonStr + '<div>' + userCount + ' or 100%' + msg + '</div>'
            break
          default:
            p = count / userCount * 100
            lessonMsg += lessonStr + '<div>' + count + ' or ' + p.toPrecision(2) + '%' + msg + '</div>'
        }
      }

      $('form + div').html(function () {
        return course + '<article>' + lessonMsg + '</article>'
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
