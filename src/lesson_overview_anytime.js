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

  function setOverviewAndCourse (opt, o, json) {
    var pattern, uid, match, lesson

    for (var i in json) {
      pattern = /(week|lesson)-([1-9]|1[0-6])-overview|overview-(lesson|week)-([1-9]|1[0-6])/i
      uid = parseInt(json[i]['user_id'])
      match = json[i]['http_request_clean']

      if (opt !== parseInt(json[i]['course_id'])) { continue }

      if (!o.course.some(function (x) { return x === uid })) { o.course.push(uid) }

      if (pattern.test(match)) {
        lesson = getLesson(match)
        if (!o.overview.lessonId.some(function (x) { return x === lesson })) {
          o.overview.lessonId.push(lesson)
        }

        if (o.overview.hasOwnProperty(lesson)) {
          if (!o.overview[lesson].some(function (x) { return x === uid })) {
            o.overview[lesson].push(uid)
          }
        } else {
          o.overview[lesson] = [ uid ]
        }
      }
    }
  }

  function getLessonMsg (o) {
    var str = ' students visited overview page.'
    var fullCount = o.course.length
    var msg = ''
    var name, count

    /* sort the array in increase order */
    o.overview.lessonId.sort(function (a, b) { return a - b })

    for (var i = 0; i < o.overview.lessonId.length; i++) {
      name = '<div>Lesson ' + o.overview.lessonId[i] + ':</div>'
      count = o.overview[ o.overview.lessonId[i] ].length

      switch (count) {
        case 0:
          msg += name + '<div>No ' + str + '</div>'
          break
        case fullCount:
          msg += name + '<div>' + fullCount + ' or 100%' + str + '</div>'
          break
        default:
          msg += name + '<div>' + count + ' or ' + getPercent(count, fullCount) + '%' + str + '</div>'
      }
    }

    return msg
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
      var d = JSON.parse(data)
      var users = {
        course: [],
        overview: {
          lessonId: []
        }
      }
      var course

      if (d.length === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      $('select option:selected').text(function (i, s) {
        course = '<div>At any time: ' + s.replace(/-/g, ' ') + '</div>'
        return s
      })

      $('select option:selected').val(function (i, s) {
        setOverviewAndCourse(parseInt(s), users, d)
        return s
      })

      if (users.course.length === 0) {
        $('form + div').html(function () {
          return course + '<div>No enrollment.</div>'
        })

        return
      }

      if (users.overview.lessonId.length === 0) {
        $('form + div').html(function () {
          return course + '<div>No student visited overview page of any lesson.</div>'
        })

        return
      }

      $('form + div').html(function () {
        return course + '<article>' + getLessonMsg(users) + '</article>'
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
