jQuery(function ($) {
  function setForm () {
    $('form input').val('Show All Users')
  }

  function setDisplayMsg () {
    var msg = 'Would you like to show the number of all users?'
    $('form + div').html(msg)
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/t/extracted.php'
    var msg = 'Pulling data, please wait...'

    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var course = $('select option:selected').text().replace(/-/g, ' ') + ': '
      var msg = ' students in total.'
      var selected = parseInt($('select option:selected').val())
      var d = {}
      var a = []

      d = $.parseJSON(data)
      if (d.length === 0) {
        $('form + div').html('No enrollment.')
        return
      }

      for (var i in d) {
        var courseId = parseInt(d[i]['course_id'])
        var uid = parseInt(d[i]['user_id'])

        if (courseId !== selected) { continue }

        if (!a.some(function (x) { return x === uid })) { a.push(uid) }
      }

      var n = a.length
      if (n === 0) {
        $('form + div').html(course + 'No enrollment.')
        return
      }

      if (n === 1) {
        $('form + div').html(course + 'One user only.')
        return
      }

      msg = course + n + msg
      $('form + div').html(msg)
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
