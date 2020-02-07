const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-6e0e5-firebase-adminsdk-235yn-4e402573f5.json')
const databaseURL = 'https://fcm-6e0e5.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-6e0e5/messages:send'
const deviceToken =
  'dxktuN1OTORN6hEVk3KI9d:APA91bGL21hKXC-NQbNmwY-dJlzULEzUnQ60hj8scmc3PEYRBrH-I-Js2oCWYuIJQY09DHUynugYa3KODLzPA9GcDL9Zf9C_CwlvdewoMxD725kvCsdtmTSBUiamZlPkRxQeybNWGh1T'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()