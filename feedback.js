var nodemailer = require('nodemailer');

module.exports = {
  sendFeedback
}

async function sendFeedback(body){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'medtrackfeedback@gmail.com',
      pass: 'xYz53$!eeeee'
    }
  })
  
  var mailOptions = {
    from: 'medtrackfeedback@gmail.com',
    to: 'drauch@hawk.iit.edu',
    subject: 'Some MedTrack Feedback has come in',
    text: body 
  }
  
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }else {
      console.log('Email sent: ' + info.response);
    }
  })
}

