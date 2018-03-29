jQuery(function ($) {
  function getLesson (s) {
    var lesson
    var tmp

    tmp = s.split('/')
    tmp = tmp[tmp.length - 1].split('-')

    for (var i = 0; i < tmp.length; i++) {
      lesson = tmp[i]
      if (!isNaN(lesson)) { break }
    }

    return lesson
  }

  function doLessonOrder (x, y) { return x - y }

  function setForm () {
    $('form input').val('Show Overview Anytime')
  }

  function setDisplayMsg () {
    var msg = 'Would you like to show overview page per lesson at any time?'
    $('form + div').html(msg)
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/extracted.php'
    var msg = 'Pulling data, please wait...'
    var i

    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var course = $('select option:selected').text().replace(/-/g, ' ')
      var msg = ' students visited overview page.'
      var selected = parseInt($('select option:selected').val())
      var pattern = /(week|lesson)-([1-9]|1[0-6])-overview|overview-(lesson|week)-([1-9]|1[0-6])/i
      var d = {}
      var courseUsers = []
      var overviewUsers = {
        lessonId: []
      }
      var p

      d = $.parseJSON(data)
      if (d.length === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      for (i in d) {
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

      var lessonMsg = ''
      var userNumber = courseUsers.length
      var lessonNumber = overviewUsers.lessonId.length
      var openDiv = '<div>'
      var closeDiv = '</div>'
      var openArticle = '<article>'
      var closeArticle = '</article>'

      if (userNumber === 0) {
        $('form + div').html(function () {
          var line1 = openDiv + 'At any time: ' + course + closeDiv
          var line2 = openDiv + 'No enrollment.' + closeDiv

          return line1 + line2
        })

        return
      }

      if (lessonNumber === 0) {
        $('form + div').html(function () {
          var line1 = openDiv + 'At any time: ' + course + closeDiv
          var line2 = openDiv + 'No student visited overview page of any lesson.' + closeDiv

          return line1 + line2
        })

        return
      }

      for (i = 0; i < lessonNumber; i++) {
        var lessonId = overviewUsers.lessonId.sort(doLessonOrder)[i]
        var count = overviewUsers[lessonId].length

        switch (count) {
          case 0:
            lessonMsg += openDiv + 'Lesson ' + lessonId + ':' + closeDiv
            lessonMsg += openDiv + 'No ' + msg + closeDiv
            break
          case userNumber:
            lessonMsg += openDiv + 'Lesson ' + lessonId + ':' + closeDiv
            lessonMsg += openDiv + userNumber + ' or 100%' + msg + closeDiv
            break
          default:
            p = count / userNumber * 100
            lessonMsg += openDiv + 'Lesson ' + lessonId + ':' + closeDiv
            lessonMsg += openDiv + count + ' or ' + p.toPrecision(2) + '%' + msg + closeDiv
        }
      }

      $('form + div').html(function () {
        var line1 = openDiv + 'At any time: ' + course + closeDiv
        var line2 = openArticle + lessonMsg + closeArticle

        return line1 + line2
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
