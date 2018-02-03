jQuery(function ($) {
  function setForm () {
    $('form input').val('Show Overview Anytime')
  }

  function setDisplayMsg () {
    var msg = 'Would you like to show the lesson overview at any time?'
    $('form + div').html(msg)
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/extracted.php'
    var msg = 'Pulling data, please wait...'

    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var course = $('select option:selected').text().replace(/-/g, ' ')
      var msg = ' students visited overview page.'
      var selected = parseInt($('select option:selected').val())
      var pattern = /overview/i
      var d = {}
      var courseUsers = []
      var overviewUsers = []
      var p

      d = $.parseJSON(data)
      if (d.length === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      for (var i in d) {
        var courseId = parseInt(d[i]['course_id'])
        var uid = parseInt(d[i]['user_id'])
        var match = d[i]['http_request_clean']

        if (courseId !== selected) { continue }

        if (!courseUsers.some(function (x) { return x === uid })) { courseUsers.push(uid) }

        if (pattern.test(match) && !overviewUsers.some(function (x) { return x === uid })) {
          overviewUsers.push(uid)
        }
      }

      var n = courseUsers.length
      var m = overviewUsers.length

      if (n === 0) {
        $('form + div').html(function () {
          var openDiv = '<div>'
          var closeDiv = '</div>'
          var line1 = openDiv + course + closeDiv
          var line2 = openDiv + 'No enrollment.' + closeDiv

          return line1 + line2
        })

        return
      }

      if (m === 0) {
        $('form + div').html(function () {
          var openDiv = '<div>'
          var closeDiv = '</div>'
          var line1 = openDiv + course + closeDiv
          var line2 = openDiv + 'At any time, no student visited overview page.' + closeDiv

          return line1 + line2
        })

        return
      }

      if (n === m) {
        $('form + div').html(function () {
          var openDiv = '<div>'
          var closeDiv = '</div>'
          var line1 = openDiv + course + closeDiv
          var line2 = openDiv + 'At any time, ' + m + ' or 100%' + msg + closeDiv

          return line1 + line2
        })

        return
      }

      p = m / n * 100
      msg = m + ' or ' + p.toPrecision(2) + '%' + msg
      $('form + div').html(function () {
        var openDiv = '<div>'
        var closeDiv = '</div>'
        var line1 = openDiv + course + closeDiv
        var line2 = openDiv + 'At any time, ' + msg + closeDiv

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
