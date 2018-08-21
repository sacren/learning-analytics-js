/*!
  * overview_users.js v0.1.0
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

  function setForm () {
    $('form input').val('Show Overview Users')
  }

  function setDisplayMsg () {
    var msg = 'Would you like to show how many overview users?'
    $('form + div').html(msg)
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/pages.php'
    var msg = 'Pulling data, please wait...'

    url = checkUrl(url)
    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var course = $('select option:selected').text().replace(/-/g, ' ')
      var msg = ' students visited overview page.'
      var selected = parseInt($('select option:selected').val())
      var pattern = /overview/i
      var d = JSON.parse(data)
      var a = []

      if (d.length === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      for (var i in d) {
        var courseId = parseInt(d[i]['course_id'])
        var uid = parseInt(d[i]['user_id'])
        var match = d[i]['http_request_clean']

        if (courseId !== selected) { continue }

        if (pattern.test(match) && !a.some(function (x) { return x === uid })) {
          a.push(uid)
        }
      }

      var n = a.length
      if (n === 0) {
        $('form + div').html(function () {
          var openDiv = '<div>'
          var closeDiv = '</div>'
          var line1 = openDiv + course + closeDiv
          var line2 = openDiv + 'No student visited overview page' + closeDiv

          return line1 + line2
        })

        return
      }

      if (n === 1) {
        $('form + div').html(function () {
          var openDiv = '<div>'
          var closeDiv = '</div>'
          var line1 = openDiv + course + closeDiv
          var line2 = openDiv + 'One student visited overview page' + closeDiv

          return line1 + line2
        })

        return
      }

      $('form + div').html(function () {
        var openDiv = '<div>'
        var closeDiv = '</div>'
        var line1 = openDiv + course + closeDiv
        var line2 = openDiv + n + msg + closeDiv

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
