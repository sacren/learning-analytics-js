/*!
  * all_users.js v0.1.0
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

  function mkUidArray (opt, json) {
    var arr = []

    for (var i in json) {
      var uid = parseInt(json[i]['user_id'])

      if (opt !== parseInt(json[i]['course_id'])) { continue }

      if (!arr.some(function (x) { return x === uid })) { arr.push(uid) }
    }

    return arr
  }

  var analytics = {
    init: function () {
      analytics.setDisplayMsg()
      analytics.setForm()
      analytics.makeSelection()
      analytics.submitForm()
    },

    setDisplayMsg: function () {
      $('form + div').html('Would you like to show the number of all users?')
    },

    setForm: function () {
      $('form input').val('Show All Users')
    },

    makeSelection: function () {
      $('form > select').change(function () {
        $('form input').prop('disabled', false)
        analytics.setDisplayMsg()
      })
    },

    submitForm: function () {
      $('form').submit(function () {
        var url = 'https://mediafiles.uvu.edu/lib/pages.php'

        url = checkUrl(url)
        $('form input').prop('disabled', true)
        $('form + div').html('Pulling data, please wait...')

        $.post(url, $(this).serialize(), function (data) {
          var d = JSON.parse(data)
          var course, a

          if (d.length === 0) {
            $('form + div').html('Data error!')
            return
          }

          $('select option:selected').text(function (i, s) {
            course = '<div>' + s.replace(/-/g, ' ') + '</div>'
            return s
          })

          $('select option:selected').val(function (i, s) {
            a = mkUidArray(parseInt(s), d)
            return s
          })

          if (a.length === 0) {
            $('form + div').html(function () {
              return course + '<div>No enrollment</div>'
            })

            return
          }

          if (a.length === 1) {
            $('form + div').html(function () {
              return course + '<div>One student in total</div>'
            })

            return
          }

          $('form + div').html(function () {
            return course + '<div>' + a.length + ' students in total</div>'
          })
        }).fail(function () {
          window.alert('Error: Pulling data!')
        })

        return false
      })
    }
  }

  analytics.init()
})
