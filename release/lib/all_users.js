jQuery(function ($) {
  var lax = window.lax

  function setForm () {
    var op1 = new window.Option('Select Course', '')
    $('select').append(op1)

    for (var i = 0; i < lax.list.length; i++) {
      var id = lax.list[i]
      var op2 = new window.Option(lax.courses[id], id)
      $('select').append(op2)
    }

    $('form input').val('Show All Users')
  }

  function setDisplayMessage () {
    var msg = 'Would you like to show the number of all users?'
    $('form + div').html(msg)
  }

  $('form').submit(function () {
    var url = 'https://mediafiles.uvu.edu/lib/t/extracted.php'
    var msg = 'Pulling data, please wait...'

    $('form input').prop('disabled', true)
    $('form + div').html(msg)

    $.post(url, $(this).serialize(), function (data) {
      var selected = parseInt($('select option:selected').val())
      var msg = 'users in total.'
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
        $('form + div').html('No enrollment.')
        return
      }

      if (n === 1) {
        $('form + div').html('One user only.')
        return
      }

      msg = n + ' ' + msg
      $('form + div').html(msg)
    }).fail(function () {
      window.alert('Error: Pulling data!')
    })

    return false
  })

  $('form > select').change(function () {
    $('form input').prop('disabled', false)
    setDisplayMessage()
  })

  function init () {
    setDisplayMessage()
    setForm()
  }

  init()
})
