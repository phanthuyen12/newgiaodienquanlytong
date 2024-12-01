import https from 'https';

const sendSMS = () => {
  const postData = JSON.stringify({
    senderId: 40,  // Thay thế bằng senderId thực tế của bạn từ Stringee
    to: "84379361752",  // Thay thế bằng số điện thoại đích của bạn
    content: "Hello"  // Nội dung tin nhắn SMS
  });

  const options = {
    hostname: 'api.stringeex.com',
    port: 443,
    path: '/v1/sms/send',
    method: 'POST',
    headers: {
      'X-STRINGEE-AUTH': 'your_json_web_token',  // Thay bằng JWT của bạn từ Stringee
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    // Nhận dữ liệu từ phản hồi
    res.on('data', (chunk) => {
      data += chunk;
    });

    // Kết thúc phản hồi
    res.on('end', () => {
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
  });

  // Gửi dữ liệu
  req.write(postData);
  req.end();
};

sendSMS();
